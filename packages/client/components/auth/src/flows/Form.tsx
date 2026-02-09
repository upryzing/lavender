import HCaptcha, { HCaptchaFunctions } from "solid-hcaptcha";
import { For, JSX, Match, Show, Switch, createSignal } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";

import { useError } from "@revolt/i18n";
import { Checkbox2, Column, Text, TextField } from "@revolt/ui";

/**
 * Available field types
 */
type Field =
  | "email"
  | "password"
  | "new-password"
  | "log-out"
  | "username"
  | "invite";

/**
 * Properties to apply to fields
 */
const useFieldConfiguration = () => {
  const { t } = useLingui();

  return {
    email: {
      type: "email" as const,
      name: () => t`Email`,
      placeholder: () => t`Please enter your email.`,
    },
    password: {
      minLength: 8,
      type: "password" as const,
      name: () => t`Password`,
      placeholder: () => t`Enter your current password.`,
    },
    "new-password": {
      minLength: 8,
      type: "password" as const,
      autocomplete: "new-password",
      name: () => t`New Password`,
      placeholder: () => t`Enter a new password.`,
    },
    "log-out": {
      name: () => t`Log out of all other sessions`,
    },
    username: {
      minLength: 2,
      type: "text" as const,
      autocomplete: "none",
      name: () => t`Username`,
      placeholder: () => t`Enter your preferred username.`,
    },
    invite: {
      minLength: 8,
      type: "text",
      name: () => t("login.invite"),
      placeholder: () => t("login.enter.invite"),
    },
  };
};

interface FieldProps {
  /**
   * Fields to gather
   */
  fields: Field[];
}

/**
 * Render a bunch of fields with preset values
 */
export function Fields(props: FieldProps) {
  const fieldConfiguration = useFieldConfiguration();
  const [failedValidation, setFailedValidation] = createSignal(false);

  const inviteCodeNeeded: boolean | undefined =
    clientController.lifecycle.client.configuration?.features.invite_only;

  /**
   * If an input element notifies us it was invalid, enable live input validation.
   */
  function onInvalid() {
    setFailedValidation(true);
  }

  return (
    <For each={props.fields}>
      {(field) => (
        <Show when={field != "invite" || inviteCodeNeeded}>
          <Switch
            fallback={
              <>
                <Text variant="label">
                  {fieldConfiguration[field].name()}
                </Text>
                <TextField
                  required
                  {...fieldConfiguration[field]}
                  name={field}
                  label={fieldConfiguration[field].name()}
                  placeholder={fieldConfiguration[field].placeholder()}
                />
              </>
            }
          >
            <Match when={field == "log-out"}>
              <label class={labelRow()}>
                <Checkbox2 name="log-out">
                  {fieldConfiguration["log-out"].name()}
                </Checkbox2>
              </label>
            </Match>
          </Switch>
        </Show>
      )}
    </For>
  );
}

interface Props {
  /**
   * Form children
   */
  children: JSX.Element;

  /**
   * Whether to include captcha token
   */
  captcha?: string;

  /**
   * Submission handler
   */
  onSubmit: (data: FormData) => Promise<void> | void;
}

/**
 * Small wrapper for HTML form
 */
export function Form(props: Props) {
  const [error, setError] = createSignal();
  const err = useError();
  let hcaptcha: HCaptchaFunctions | undefined;

  /**
   * Handle submission
   * @param event Form Event
   */
  async function onSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    if (props.captcha) {
      if (!hcaptcha) return alert("hCaptcha not loaded!");
      const response = await hcaptcha.execute();
      formData.set("captcha", response!.response);
    }

    try {
      await props.onSubmit(formData);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Column gap="lg">
        {props.children}
        <Show when={error()}>
          <Text class="label" size="small">
            {err(error())}
          </Text>
        </Show>
      </Column>
      <Show when={props.captcha}>
        <HCaptcha
          sitekey={props.captcha!}
          onLoad={(instance) => (hcaptcha = instance)}
          size="invisible"
        />
      </Show>
    </form>
  );
}
