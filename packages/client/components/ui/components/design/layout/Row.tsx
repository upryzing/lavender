import { styled } from "styled-system/jsx";

/**
 * Generic Flex Row
 */
export const Row = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexGrow: "initial",
    flexWrap: "initial",
    gap: "var(--gap-md)",
    alignItems: "initial",
    justifyContent: "initial",
  },
  variants: {
    grow: {
      true: {
        flexGrow: 1,
      },
    },
    wrap: {
      true: {
        flexWrap: "wrap",
      },
    },
    align: {
      true: {
        alignItems: "center",
      },
      stretch: {
        alignItems: "stretch",
      },
    },
    justify: {
      true: {
        justifyContent: "center",
      },
      stretch: {
        justifyContent: "stretch",
      },
    },
    gap: {
      xs: { gap: "var(--gap-xs)" },
      sm: { gap: "var(--gap-sm)" },
      md: { gap: "var(--gap-md)" },
      lg: { gap: "var(--gap-lg)" },
      xl: { gap: "var(--gap-xl)" },
    },
  },
});
