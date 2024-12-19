import { Accessor, Setter, createSignal } from "solid-js";

import { detect } from "detect-browser";
import { API, Client, ConnectionState } from "@upryzing/upryzing.js";

import {
  CONFIGURATION,
  getController,
  registerController,
} from "@revolt/common";
import { state } from "@revolt/state";
import type { Session } from "@revolt/state/stores/Auth";

export enum State {
  Ready,
  LoggingIn,
  Onboarding,
  Error,
  Dispose,
  Connecting,
  Connected,
  Disconnected,
  Reconnecting,
  Offline,
}

export enum TransitionType {
  LoginUncached,
  LoginCached,
  SocketConnected,
  DeviceOffline,
  DeviceOnline,
  PermanentFailure,
  TemporaryFailure,
  UserCreated,
  NoUser,
  Cancel,
  Dispose,
  Dismiss,
  Ready,
  Retry,
  Logout,
}

export type Transition =
  | {
      type: TransitionType.LoginUncached | TransitionType.LoginCached;
      session: Session;
    }
  | {
      type: TransitionType.PermanentFailure;
      error: string;
    }
  | {
      type:
        | TransitionType.NoUser
        | TransitionType.UserCreated
        | TransitionType.TemporaryFailure
        | TransitionType.SocketConnected
        | TransitionType.DeviceOffline
        | TransitionType.DeviceOnline
        | TransitionType.Cancel
        | TransitionType.Dismiss
        | TransitionType.Ready
        | TransitionType.Retry
        | TransitionType.Dispose
        | TransitionType.Logout;
    };

class Lifecycle {
  readonly state: Accessor<State>;
  #setStateSetter: Setter<State>;

  readonly loadedOnce: Accessor<boolean>;
  #setLoadedOnce: Setter<boolean>;

  client: Client;

  #connectionFailures = 0;
  #permanentError: string | undefined;
  #retryTimeout: number | undefined;

  constructor() {
    this.onState = this.onState.bind(this);
    this.onReady = this.onReady.bind(this);

    const [state, setState] = createSignal(State.Ready);
    this.state = state;
    this.#setStateSetter = setState;

    const [loadedOnce, setLoadedOnce] = createSignal(false);
    this.loadedOnce = loadedOnce;
    this.#setLoadedOnce = setLoadedOnce;

    this.client = null!;
    this.dispose();
  }

  private dispose() {
    if (this.client) {
      this.client.events.removeAllListeners();
      this.client.removeAllListeners();
      this.client.events.disconnect();
    }

    this.client = new Client({
      baseURL: CONFIGURATION.DEFAULT_API_URL,
      autoReconnect: false,
      syncUnreads: true,
      debug: import.meta.env.DEV,
    });

    let useBaseConfig = !CONFIGURATION.REQUEST_CONFIG;

    if (!useBaseConfig) {
      fetch(CONFIGURATION.DEFAULT_API_URL)
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);

          return response.json();
        })
        .then((conf) => {
          // TODO: swap these around (not in revolt land anymore)
          if (!conf.features.january) {
            conf.features.january = conf.features.dove;
            delete conf.features.dove;
          }

          if (!conf.features.autumn) {
            conf.features.autumn = conf.features.pigeon;
            delete conf.features.pigeon;
          }

          this.client.configuration = conf;
        })
        .catch((error) => {
          console.error(error);

          useBaseConfig = true;
        });
    }

    if (useBaseConfig) {
      this.client.configuration = {
        revolt: String(),
        app: String(),
        build: {} as never,
        features: {
          autumn: {
            enabled: true,
            url: CONFIGURATION.DEFAULT_MEDIA_URL,
          },
          january: {
            enabled: true,
            url: CONFIGURATION.DEFAULT_PROXY_URL,
          },
          captcha: {} as never,
          email: true,
          invite_only: CONFIGURATION.INVITE_ONLY,
          voso: {} as never,
        },
        vapid: String(),
        ws: CONFIGURATION.DEFAULT_WS_URL,
      };
    }

    this.client.events.on("state", this.onState);
    this.client.on("ready", this.onReady);
  }

  #enter(nextState: State) {
    console.debug("Entering state", nextState);
    this.#setStateSetter(nextState);

    // Clean up retry timer
    if (this.#retryTimeout) {
      clearTimeout(this.#retryTimeout);
      this.#retryTimeout = undefined;
    }

    switch (nextState) {
      case State.LoggingIn:
        this.client.api.get("/onboard/hello").then(({ onboarding }) => {
          if (onboarding) {
            this.transition({
              type: TransitionType.NoUser,
            });
          } else {
            this.client.connect();
          }
        });

        break;
      case State.Connecting:
      case State.Reconnecting:
        this.client.connect();
        break;
      case State.Connected:
        state.auth.markValid();
        this.#setLoadedOnce(true);
        this.#connectionFailures = 0;
        break;
      case State.Dispose:
        this.dispose();
        this.transition({
          type: TransitionType.Ready,
        });
        this.#setLoadedOnce(false);
        break;
      case State.Disconnected:
        this.#connectionFailures++;

        if (!navigator.onLine) {
          this.transition({
            type: TransitionType.DeviceOffline,
          });
        } else {
          const retryIn =
            (Math.pow(2, this.#connectionFailures) - 1) *
            (0.8 + Math.random() * 0.4);

          console.info(
            "Will try to reconnect in",
            retryIn.toFixed(2),
            "seconds!"
          );

          this.#retryTimeout = setTimeout(() => {
            this.#retryTimeout = undefined;
            this.transition({
              type: TransitionType.Retry,
            });
          }, retryIn * 1e3) as never;
        }
        break;
    }
  }

  transition(transition: Transition) {
    console.debug("Received transition", transition.type);

    const currentState = this.state();
    switch (currentState) {
      case State.Ready:
        if (transition.type === TransitionType.LoginUncached) {
          this.client.useExistingSession({
            ...transition.session,
            user_id: transition.session.userId,
          });

          this.#enter(State.LoggingIn);
        } else if (transition.type === TransitionType.LoginCached) {
          this.client.useExistingSession({
            ...transition.session,
            user_id: transition.session.userId,
          });

          this.#enter(State.Connecting);
        }
        break;
      case State.LoggingIn:
        switch (transition.type) {
          case TransitionType.SocketConnected:
            this.#enter(State.Connected);
            break;
          case TransitionType.NoUser:
            this.#enter(State.Onboarding);
            break;
          case TransitionType.PermanentFailure:
          case TransitionType.TemporaryFailure:
            // TODO: relay error
            this.#enter(State.Error);
            break;
        }
        break;
      case State.Onboarding:
        if (transition.type === TransitionType.UserCreated) {
          this.#enter(State.Connecting);
        } else if (transition.type === TransitionType.Cancel) {
          this.#enter(State.Dispose);
        }
        break;
      case State.Error:
        if (transition.type === TransitionType.Dismiss) {
          this.#enter(State.Dispose);
        }
        break;
      case State.Dispose:
        if (transition.type === TransitionType.Ready) {
          this.#enter(State.Ready);
        }
        break;
      case State.Connecting:
        switch (transition.type) {
          case TransitionType.SocketConnected:
            this.#enter(State.Connected);
            break;
          case TransitionType.TemporaryFailure:
            this.#enter(State.Disconnected);
            break;
          case TransitionType.PermanentFailure:
            this.#permanentError = transition.error;
            this.#enter(State.Error);
            break;
          case TransitionType.Logout:
            this.#enter(State.Dispose);
            break;
        }
        break;
      case State.Connected:
        switch (transition.type) {
          case TransitionType.TemporaryFailure:
            this.#enter(State.Disconnected);
            break;
          case TransitionType.Logout:
            this.#enter(State.Dispose);
            break;
        }
        break;
      case State.Disconnected:
        switch (transition.type) {
          case TransitionType.DeviceOffline:
            this.#enter(State.Offline);
            break;
          case TransitionType.Retry:
            this.#enter(State.Reconnecting);
            break;
          case TransitionType.Logout:
            this.#enter(State.Dispose);
            break;
        }
        break;
      case State.Reconnecting:
        switch (transition.type) {
          case TransitionType.SocketConnected:
            this.#enter(State.Connected);
            break;
          case TransitionType.TemporaryFailure:
            this.#enter(State.Disconnected);
            break;
          case TransitionType.PermanentFailure:
            // TODO: relay error
            this.#enter(State.Error);
            break;
          case TransitionType.Logout:
            this.#enter(State.Dispose);
            break;
        }
        break;
      case State.Offline:
        switch (transition.type) {
          case TransitionType.DeviceOnline:
            this.#enter(State.Reconnecting);
            break;
          case TransitionType.Logout:
            this.#enter(State.Dispose);
            break;
        }
        break;
    }

    if (currentState === this.state()) {
      console.error(
        "An unhandled transition occurred!",
        transition,
        "was received on",
        currentState
      );
    }
  }

  private onReady() {
    this.transition({
      type: TransitionType.SocketConnected,
    });
  }

  private onState(state: ConnectionState) {
    switch (state) {
      case ConnectionState.Disconnected:
        if (this.client.events.lastError) {
          if (this.client.events.lastError.type === "revolt") {
            // if (this.client.events.lastError.data.type == 'InvalidSession') {

            this.transition({
              type: TransitionType.PermanentFailure,
              error: this.client.events.lastError.data.type,
            });

            break;
          }
        }

        this.transition({
          type: TransitionType.TemporaryFailure,
        });

        break;
    }
  }

  /**
   * Get the permanent error
   */
  get permanentError() {
    return this.#permanentError!;
  }
}

/**
 * Controls lifecycle of clients
 */
export default class ClientController {
  /**
   * API Client
   */
  readonly api: API.API;

  /**
   * Lifecycle
   */
  readonly lifecycle: Lifecycle;

  /**
   * Construct new client controller
   */
  constructor() {
    this.api = new API.API({
      baseURL: CONFIGURATION.DEFAULT_API_URL,
    });

    this.lifecycle = new Lifecycle();

    registerController("client", this);
  }

  getCurrentClient() {
    return this.lifecycle.client;
  }

  isLoggedIn() {
    return [
      State.Connecting,
      State.Connected,
      State.Disconnected,
      State.Offline,
      State.Reconnecting,
    ].includes(this.lifecycle.state());
  }

  isError() {
    return this.lifecycle.state() === State.Error;
  }

  /**
   * Login given a set of credentials
   * @param credentials Credentials
   */
  async login(credentials: API.DataLogin) {
    const browser = detect();

    // Generate a friendly name for this browser
    let friendly_name;
    if (browser) {
      let { name, os } = browser as { name: string; os: string };
      if (name === "ios") {
        name = "safari";
      } else if (name === "fxios") {
        name = "firefox";
      } else if (name === "crios") {
        name = "chrome";
      } else if (os === "Mac OS" && navigator.maxTouchPoints > 0) {
        os = "iPadOS";
      }

      friendly_name = `Upryzing for Web (${name} on ${os})`;
    } else {
      friendly_name = "Upryzing for Web (Unknown Device)";
    }

    // Try to login with given credentials
    let session = await this.api.post("/auth/session/login", {
      ...credentials,
      friendly_name,
    });

    // Prompt for MFA verification if necessary
    if (session.result === "MFA") {
      const { allowed_methods } = session;
      while (session.result === "MFA") {
        const mfa_response: API.MFAResponse | undefined = await new Promise(
          (callback) =>
            getController("modal").push({
              type: "mfa_flow",
              state: "unknown",
              available_methods: allowed_methods,
              callback,
            })
        );

        if (typeof mfa_response === "undefined") {
          break;
        }

        try {
          session = await this.api.post("/auth/session/login", {
            mfa_response,
            mfa_ticket: session.ticket,
            friendly_name,
          });
        } catch (err) {
          console.error("Failed login:", err);
        }
      }

      if (session.result === "MFA") {
        throw "Cancelled";
      }
    }

    if (session.result === "Disabled") {
      // TODO
      alert("Account is disabled, run special logic here.");
      return;
    }

    const createdSession = {
      _id: session._id,
      token: session.token,
      userId: session.user_id,
      valid: false,
    };

    state.auth.setSession(createdSession);
    this.lifecycle.transition({
      type: TransitionType.LoginUncached,
      session: createdSession,
    });
  }

  async selectUsername(username: string) {
    await this.lifecycle.client.api.post("/onboard/complete", {
      username,
    });

    this.lifecycle.transition({
      type: TransitionType.UserCreated,
    });
  }

  logout() {
    state.auth.removeSession();
    this.lifecycle.transition({
      type: TransitionType.Logout,
    });
  }
}
