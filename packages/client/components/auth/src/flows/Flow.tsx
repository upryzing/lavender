import { JSX, Show } from "solid-js";

import { defineKeyframes } from "@pandacss/dev";
import { styled } from "styled-system/jsx";

import { Column, Row, Text, Typography } from "@revolt/ui";

import envelope from "./envelope.svg";
import wave from "./wave.svg";

/**
 * Container for authentication page flows
 */
export const FlowBase = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-lg)",
    flexGrow: 0,
    background: "var(--colours-messaging-message-box-background)",
    color: "var(--colours-messaging-message-box-foreground)",
    width: "360px",
    maxWidth: "360px",
    maxHeight: "600px",
    padding: "45px 40px",
    borderRadius: "32px",
    marginTop: "20px",
    marginBottom: "20px",
    justifySelf: "center",
    marginInline: "auto",

  /* background-color: rgba(36, 36, 36, 0.75);
   backdrop-filter: blur(20px); */
  /* // border: 2px solid rgba(128, 128, 128, 0.15); */

  gap: ${(props) => props.theme!.gap.lg};

  max-width: 360px;
  max-height: 600px;
  /* padding: 30px 25px; */
  padding: 45px 40px;
  border-radius: 32px;

  margin-top: 20px;
  margin-bottom: 20px;
  /* // box-shadow: 0 2px 10px rgb(0 0 0 / 20%); */

  justify-self: center;
  margin-inline: auto;

  a,
  a:link,
  a:visited,
  a:active {
    text-decoration: none;
    color: var(--colours-link);
  }
`;

/**
 * Wave animation
 * TODO: I don't think this is how you use it
 */
const WaveAnimation = defineKeyframes({
  fadeIn: {
    "0%": { transform: "rotate(0)" },
    "10%": { transform: "rotate(14deg)" },
    "20%": { transform: "rotate(-8deg)" },
    "30%": { transform: "rotate(14deg)" },
    "40%": { transform: "rotate(-4deg)" },
    "50%": { transform: "rotate(10deg)" },
    "60%": { transform: "rotate(0)" },
    "100%": { transform: "rotate(0)" },
  },
});

/**
 * Envelope animation
 * TODO: I don't think this is how you use it
 */
const EnvelopeAnimation = defineKeyframes({
  fadeIn: {
    "0%": {
      opacity: 0,
      transform: "translateY(-24px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(-4px)",
    },
  },
});

/**
 * Wave emoji
 */
const Wave = styled("img", {
  base: {
    height: "1.8em",
    animationDuration: "2.5s",
    animationIterationCount: 1,
    animationName: WaveAnimation,
  },
});

/**
 * Mail emoji
 */
const Mail = styled("img", {
  base: {
    height: "1.8em",
    transform: "translateY(-4px)",
    animationDuration: "0.5s",
    animationIterationCount: 1,
    animationTimingFunction: "ease",
    animationName: EnvelopeAnimation,
  },
});

/**
 * Common flow title component
 */
export function FlowTitle(props: {
  children: JSX.Element;
  subtitle?: JSX.Element;
  emoji?: "wave" | "mail";
}) {
  return (
    <Column>
      <Row align gap="sm">
        <Show when={props.emoji === "wave"}>
          <Wave src={wave} />
        </Show>
        <Show when={props.emoji === "mail"}>
          <Mail src={envelope} />
        </Show>
        <Text class="title" size="large">
          {props.children}
        </Text>
      </Row>
      <Show when={props.subtitle}>
        <Text class="title">{props.subtitle}</Text>
      </Show>
    </Column>
  );
}
