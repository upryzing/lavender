import { For } from "solid-js";

import { useTranslation } from "@revolt/i18n";
import { Avatar, Column } from "@revolt/ui";
import {
  SegmentedButton,
  SegmentedButtonGroup,
} from "@revolt/ui/components/design/atoms/inputs/SegmentedButton";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

/**
 * Parse time input
 * FIXME PLEASE REMOVE WHEN A DATE PICKER IS MADE!!!!!!!!!!
 * @param input
 */
function parseTimeInput(input: string): number | null {
  if (!/([0-9]{1,3}[smhdwy])+/g.test(input)) return null;

  const pieces = input.match(/([0-9]{1,3}[smhdwy])/g) ?? [];
  let res = 0;

  // Being able to specify the same letter multiple times
  // (e.g. 1s1s) and having their values stack is a feature
  for (const piece of pieces) {
    const [num, letter] = [
      Number(piece.slice(0, piece.length - 1)),
      piece.slice(piece.length - 1),
    ];
    let multiplier = 0;

    switch (letter) {
      case "s":
        multiplier = 1000;
        break;
      case "m":
        multiplier = 1000 * 60;
        break;
      case "h":
        multiplier = 1000 * 60 * 60;
        break;
      case "d":
        multiplier = 1000 * 60 * 60 * 24;
        break;
      case "w":
        multiplier = 1000 * 60 * 60 * 24 * 7;
        break;
      case "y":
        multiplier = 1000 * 60 * 60 * 24 * 365;
        break;
    }

    res += num * multiplier;
  }

  return res;
}

const presetTimeouts = [
  {
    amount: "1m",
    tKey: "app.special.modals.timeout.timeout_preset_1",
  },
  {
    amount: "5m",
    tKey: "app.special.modals.timeout.timeout_preset_2",
  },
  {
    amount: "10m",
    tKey: "app.special.modals.timeout.timeout_preset_3",
  },
  {
    amount: "1h",
    tKey: "app.special.modals.timeout.timeout_preset_4",
  },
  {
    amount: "1d",
    tKey: "app.special.modals.timeout.timeout_preset_5",
  },
  {
    amount: "1w",
    tKey: "app.special.modals.timeout.timeout_preset_6",
  },
  // TODO
  // {
  //   amount: "custom",
  //   tKey: "app.special.modals.timeout.timeout_preset_custom",
  // },
];

/**
 * Modal to timeout server member
 */
const TimeoutMember: PropGenerator<"timeout_member"> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: t("app.context_menu.timeout_member"),
    },
    schema: {
      member: "custom",
      amount: "radio",
    },
    data: {
      member: {
        element: (
          <Column align="center">
            <Avatar src={props.member.user?.animatedAvatarURL} size={64} />
            {t("app.special.modals.prompt.confirm_timeout", {
              name: props.member.user?.username as string,
            })}
          </Column>
        ),
      },
      amount: {
        choices: presetTimeouts.map((preset) => {
          return {
            name: t(preset.tKey),
            value: preset.amount,
          };
        }),
      },
    },
    callback: async ({ amount }) => {
      const duration = parseTimeInput(amount ?? "");
      if (!duration) return;
      await props.member.edit({
        timeout: new Date(Date.now() + duration).toISOString(),
      });
    },
    submit: {
      variant: "error",
      children: t("app.special.modals.actions.timeout"),
    },
  });
};

export default TimeoutMember;
