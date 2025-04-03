import { createSignal } from "solid-js";
import { QRCodeSVG } from "solid-qr-code";

import { styled } from "styled-system/jsx";

import { useTranslation } from "@revolt/i18n";
import { Column, Input, Text, TextField } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Wrapper element for the raw TOTP code
 */
const Code = styled("code", {
  base: {
    userSelect: "all",
  },
});

/**
 * Wrapper element for the QR code
 */
const Qr = styled("div", {
  base: {
    borderRadius: "4px",
    background: "white",
    width: "140px",
    height: "140px",
    display: "grid",
    placeItems: "center",
  },
});

/**
 * Modal to display QR code and secret key for MFA and accept the correct code
 */
const MFAEnableTOTP: PropGenerator<"mfa_enable_totp"> = (props) => {
  const t = useTranslation();
  const [value, setValue] = createSignal("");

  /**
   * Generate OTP URI
   */
  const uri = () =>
    `otpauth://totp/Revolt:${props.identifier}?secret=${props.secret}&issuer=Revolt`;

  return {
    title: t("app.special.modals.mfa.enable_totp"),
    description: t("app.special.modals.mfa.prompt_totp"),
    actions: [
      {
        palette: "primary",
        children: t("app.special.modals.actions.continue"),
        onClick: () => {
          props.callback(value().trim().replace(/\s/g, ""));
          return true;
        },
        confirmation: true,
      },
      {
        palette: "plain",
        children: t("app.special.modals.actions.cancel"),
        onClick: () => {
          props.callback();
          return true;
        },
      },
    ],
    nonDismissable: true,
    children: (
      <>
        <Column align>
          <Qr>
            <QRCodeSVG
              value={uri()}
              backgroundColor="white"
              foregroundColor="black"
              level="medium"
              height={140}
              width={140}
              backgroundAlpha={1}
              foregroundAlpha={1}
            />
          </Qr>
          <Code>{props.secret}</Code>
        </Column>

        <TextField
          value={value()}
          label={t("app.special.modals.mfa.enter_code")}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </>
    ),
  };
};

export default MFAEnableTOTP;
