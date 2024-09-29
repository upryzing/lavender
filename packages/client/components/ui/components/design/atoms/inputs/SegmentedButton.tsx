import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import {
  AriaButtonProps,
  AriaToggleButtonProps,
  createButton,
  createToggleButton,
} from "@solid-aria/button";
import { cva } from "styled-system/css/cva";

const segmentedButtonContainer = cva({
  base: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "start",

    fontWeight: 500,
    fontFamily: "inherit",

    cursor: "pointer",
    borderRadius: "var(--borderRadius-xxl)",
    transition: "var(--transitions-fast) all",

    // "&:hover": {
    //   filter: "brightness(1.2)",
    // },

    "&:disabled": {
      cursor: "not-allowed",
    },
  },
});

const segmentedButtonOption = cva({
  base: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    width: "auto",

    padding: 2,

    fontWeight: 500,
    fontFamily: "inherit",
    backgroundColor: "var(--colours-component-btn-background-secondary)",

    cursor: "pointer",
    transition: "var(--transitions-fast) all",
    borderY: "1px solid var(--colours-component-segbtn-outline)",
    borderRight: "1px solid var(--colours-component-segbtn-outline)",

    // "&:hover": {
    //   filter: "brightness(1.2)",
    // },

    "&:first-child": {
      borderLeftRadius: "var(--borderRadius-xxl)",
      borderLeft: "1px solid var(--colours-component-segbtn-outline)",
    },

    "&:last-child": {
      borderRightRadius: "var(--borderRadius-xxl)",
    },

    "&:disabled": {
      cursor: "not-allowed",
    },
    "&[aria-pressed='true']": {
      backgroundColor: "var(--colours-component-segbtn-background-primary)",
    },
  },
});

/**
 * Material 3 Segmented Button
 * @param props
 * @returns
 */
export function SegmentedButton(
  props: Omit<
    Parameters<typeof segmentedButtonContainer>[0] & {
      children: JSX.Element;
    } & JSX.DirectiveAttributes,
    "onClick"
  >
) {
  const [style, rest] = splitProps(props, []);

  return (
    <form {...rest} class={segmentedButtonContainer(style)}>
      {rest.children}
    </form>
  );
}
/**
 * Segmented Button Option
 * @returns
 */
export function Option(
  props: Omit<
    Parameters<typeof segmentedButtonOption>[0] &
      AriaToggleButtonProps &
      JSX.DirectiveAttributes,
    "onClick"
  >
) {
  const [style, rest] = splitProps(props, []);
  let ref: HTMLButtonElement | undefined;

  const { buttonProps, state } = createToggleButton(rest, () => ref);
  return (
    <button
      {...buttonProps}
      ref={ref}
      class={segmentedButtonOption()}
      use:ripple
      // @codegen directives props=rest include=floating
    >
      {rest.children}
    </button>
  );
}
