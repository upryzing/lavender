import {
  BiRegularAlignLeft,
  BiRegularLeftArrowAlt,
  BiRegularMinus,
  BiRegularPlus,
  BiRegularRightArrowAlt,
  BiRegularX,
  BiSolidImage,
  BiSolidInfoCircle,
  BiSolidKey,
  BiSolidPurchaseTag,
  BiSolidShieldX,
  BiSolidXCircle,
} from "solid-icons/bi";
import { Match, Switch } from "solid-js";

import { SystemMessage } from "@upryzing/upryzing.js";
import { styled } from "styled-system/jsx";

import { Time } from "../../design";
import { formatTime } from "../../design/atoms/display/Time";
import { Tooltip } from "../../floating";

/**
 * System Message Icon
 */
export function SystemMessageIcon(props: {
  createdAt: Date;
  isServer: boolean;
  systemMessage: SystemMessage;
}) {
  return (
    <Base type={props.systemMessage.type}>
      <Tooltip
        content={() => <Time format="relative" value={props.createdAt} />}
        aria={formatTime({ format: "relative", value: props.createdAt })}
        placement="top"
      >
        <Switch fallback={<BiSolidInfoCircle size={16} />}>
          <Match when={props.systemMessage.type === "user_added"}>
            <BiRegularPlus size={16} />
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && !props.isServer}
          >
            <BiRegularMinus size={16} />
          </Match>
          <Match when={props.systemMessage.type === "user_remove"}>
            <BiRegularX size={16} />
          </Match>
          <Match when={props.systemMessage.type === "user_kicked"}>
            <BiSolidXCircle size={16} />
          </Match>
          <Match when={props.systemMessage.type === "user_banned"}>
            <BiSolidShieldX size={16} />
          </Match>
          <Match when={props.systemMessage.type === "user_joined"}>
            <BiRegularRightArrowAlt size={16} />
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && props.isServer}
          >
            <BiRegularLeftArrowAlt size={16} />
          </Match>
          <Match when={props.systemMessage.type === "channel_renamed"}>
            <BiSolidPurchaseTag size={16} />
          </Match>
          <Match
            when={props.systemMessage.type === "channel_description_changed"}
          >
            <BiRegularAlignLeft size={16} />
          </Match>
          <Match when={props.systemMessage.type === "channel_icon_changed"}>
            <BiSolidImage size={16} />
          </Match>
          <Match
            when={props.systemMessage.type === "channel_ownership_changed"}
          >
            <BiSolidKey size={16} />
          </Match>
        </Switch>
      </Tooltip>
    </Base>
  );
}

const success = new Set<SystemMessage["type"]>(["user_added", "user_joined"]);

const warning = new Set<SystemMessage["type"]>(["channel_ownership_changed"]);

const danger = new Set<SystemMessage["type"]>([
  "user_left",
  "user_kicked",
  "user_banned",
]);

const Base = styled("div", {
  base: {
    width: "62px",
    display: "grid",
    placeItems: "center",
  },
  variants: {
    type: {
      user_added: {
        color: "var(--customColours-success-color)",
      },
      user_joined: {
        color: "var(--customColours-success-color)",
      },
      channel_ownership_changed: {
        color: "var(--customColours-warning-color)",
      },
      user_left: {
        color: "var(--customColours-error-color)",
      },
      user_kicked: {
        color: "var(--customColours-error-color)",
      },
      user_banned: {
        color: "var(--customColours-error-color)",
      },
      default: {
        color: "var(--colours-foreground)",
      },
    },
  },
  defaultVariants: {
    type: "default",
  },
});
