import { Match, Show, Switch } from "solid-js";
import { Match, Show, Switch } from "solid-js";

import { clientController } from "@revolt/client";
import { TransitionType } from "@revolt/client/Controller";
import { TransitionType } from "@revolt/client/Controller";
import { useTranslation } from "@revolt/i18n";
import { Navigate } from "@revolt/routing";
import { Button, Column } from "@revolt/ui";

import RevoltSvg from "../../../../public/assets/wordmark_wide_500px.svg?component-solid";
import { cva } from "styled-system/css";

const logo = cva({
  base: {
    width: "100%",
    objectFit: "contain",
    fill: "var(--colours-messaging-message-box-foreground)",
  },
});

/**
 * Flow for logging into an account
 */
export default function FlowHome() {
  const t = useTranslation();

  return (
    <Switch
      fallback={
        <>
          <Show when={clientController.isLoggedIn()}>
            <Navigate href="/app" />
          </Show>
          <Switch
            fallback={
              <>
                <Show when={clientController.isLoggedIn()}>
                  <Navigate href="/app" />
                </Show>

                <Column gap="xl">
                  <Logo />

                  <Column>
                    <b
                      style={{
                        "font-weight": 800,
                        "font-size": "1.4em",
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "center",
                      }}
                    >
                      <span>Your conversations, your way.</span>
                    </b>
                    <span style={{ "text-align": "center", opacity: "0.5" }}>
                      Connect with Upryzing.
                      {/* [TODO] Add translations for multiple languages */}
                    </span>
                  </Column>

                  <Column>
                    <a href="/login/auth">
                      <Column>
                        <Button>Log In</Button>
                      </Column>
                    </a>
                    <a href="/login/create">
                      <Column>
                        <Button variant="secondary">Sign Up</Button>
                      </Column>
                    </a>
                  </Column>
                </Column>
              </>
            }
          >
            <Match when={clientController.isError()}>
              <Switch fallback={"an unknown error occurred"}>
                <Match
                  when={
                    clientController.lifecycle.permanentError === "InvalidSession"
                  }
                >
                  <h1>You were logged out!</h1>
                </Match>
              </Switch>

              <Button
                variant="secondary"
                onPress={() =>
                  clientController.lifecycle.transition({
                    type: TransitionType.Dismiss,
                  })
                }
              >
                OK
              </Button>
            </Match>
          </Switch>
          <Column>
            <a href="/login/auth">
              <Column>
                <Button>Log In</Button>
              </Column>
            </a>
            <a href="/login/create">
              <Column>
                <Button variant="secondary">Sign Up</Button>
              </Column>
            </a>
          </Column>
        </Column>
    </>
      }
    >
  <Match when={clientController.isError()}>
    <Switch fallback={"an unknown error occurred"}>
      <Match
        when={
          clientController.lifecycle.permanentError === "InvalidSession"
        }
      >
        <h1>You were logged out!</h1>
      </Match>
    </Switch>

    <Button
      variant="secondary"
      onPress={() =>
        clientController.lifecycle.transition({
          type: TransitionType.Dismiss,
        })
      }
    >
      OK
    </Button>
  </Match>
    </Switch >
  );
}
