import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

import {
  AriaRadioGroupProps,
  AriaRadioProps,
  createRadio,
  createRadioGroup,
} from "@solid-aria/radio";
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

    paddingY: 2,

    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "var(--transitions-fast) all",
    borderY: "1px solid var(--colours-component-segbtn-outline)",
    borderRight: "1px solid var(--colours-component-segbtn-outline)",

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
    "& input": {
      display: "none",
    },
    "&[data-selected=true]": {
      backgroundColor: "var(--colours-component-segbtn-background-selected)",
    },
  },
});

/**
 * Material 3 Segmented Button
 * @param props
 * @returns
 */
export function SegmentedButtonGroup(
  props: Omit<
    Parameters<typeof segmentedButtonContainer>[0] &
      AriaRadioGroupProps &
      JSX.DirectiveAttributes,
    "onClick"
  >,
) {
  const [style, rest] = splitProps(props, []);

  const { RadioGroupProvider, groupProps } = createRadioGroup(rest);

  return (
    <div {...groupProps} class={segmentedButtonContainer(style)}>
      <RadioGroupProvider>{rest.children}</RadioGroupProvider>
    </div>
  );
}
/**
 * Segmented Button Option
 * @returns
 */
export function SegmentedButton(
  props: Omit<
    Parameters<typeof segmentedButtonOption>[0] &
      AriaRadioProps &
      JSX.DirectiveAttributes,
    "onClick"
  >,
) {
  let ref: HTMLInputElement | undefined;

  const { inputProps, state } = createRadio(props, () => ref);

  // eslint-disable-next-line spellcheck/spell-checker
  // eslint-disable-next-line require-jsdoc
  const isSelected = () => state.selectedValue() === props.value;

  return (
    <label
      class={segmentedButtonOption()}
      data-selected={isSelected()}
      use:ripple
    >
      <input {...inputProps} ref={ref} />
      {props.children}
    </label>
  );
}
