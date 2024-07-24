import { JSXElement, Show, createEffect, createSignal, on } from "solid-js";
import { styled } from "solid-styled-components";

import { Initials } from "./Initials";
import StackView from "./StackView";

export type Props = {
  /**
   * Avatar size
   */
  size?: number;

  /**
   * Avatar shape
   */
  shape?: "circle" | "rounded-square";

  /**
   * Image source
   */
  src?: string;

  /**
   * Fallback if no source
   */
  fallback?: string | JSXElement;

  /**
   * If this avatar falls back, use primary contrasting colours
   */
  primaryContrast?: boolean;

  /**
   * Punch a hole through the avatar
   */
  holepunch?:
    | "bottom-right"
    | "top-right"
    | "right"
    | "overlap"
    | "overlap-subtle"
    | "none"
    | false;

  /**
   * Specify overlay component
   */
  overlay?: JSXElement;

  /**
   * Whether this icon is interactive
   */
  interactive?: boolean;

  /**
   * TODO: Serverside implementation
   *
   * tuple
   * [bottom layer, top layer]
   */
  decoration?: [string?, string?];
};

/**
 * Avatar image
 */
const Image = styled("img")<Pick<Props, "shape">>`
  width: 100%;
  height: 100%;
  object-fit: cover;

  border-radius: ${(props) =>
    props.shape === "rounded-square"
      ? props.theme!.borderRadius.md
      : props.theme!.borderRadius.full};
`;

/**
 * Text fallback container
 */
const FallbackBase = styled("div")<Pick<Props, "shape" | "primaryContrast">>`
  width: 100%;
  height: 100%;

  border-radius: ${(props) =>
    props.shape === "rounded-square"
      ? props.theme!.borderRadius.md
      : props.theme!.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  font-size: 0.75rem;
  color: ${(props) =>
    props.theme!.colours[
      `component-avatar-fallback${
        props.primaryContrast ? "-contrast" : ""
      }-foreground`
    ]};
  background: ${(props) =>
    props.theme!.colours[
      `component-avatar-fallback${
        props.primaryContrast ? "-contrast" : ""
      }-background`
    ]};
`;

/**
 * Avatar parent container
 */
const ParentBase = styled("svg", "Avatar")<Pick<Props, "interactive">>`
  flex-shrink: 0;
  user-select: none;
  cursor: ${(props) => (props.interactive ? "cursor" : "inherit")};

  foreignObject {
    transition: ${(props) => props.theme!.transitions.fast} filter;
  }
`;

const AvatarContainer = styled.div<Pick<Props, "size">>`
  position: relative;
  width: ${(props) => (props.size ?? 0) + 20}px;
  border-radius: ${(props) => props.theme!.borderRadius.full};
`;

/**
 * Generic Avatar component
 *
 * Partially inspired by Adw.Avatar API, we allow users to specify a fallback component (usually just text) to display in case the URL is invalid.
 */
export function Avatar(props: Props) {
  const [url, setUrl] = createSignal(props.src);

  // Clear the source URL on change before applying new to avoid
  // the stale image remaining on screen and hence causing weird
  // visual issues in virtual containers.
  createEffect(
    on(
      () => props.src,
      (src) => {
        if (url() !== src) {
          setUrl("");
          setTimeout(() => setUrl(src));
        }
      },
      { defer: true }
    )
  );

  return (
    <AvatarContainer size={props.size}>
      <Show when={props.decoration?.[0]}>
        <img
          loading="lazy"
          src={props.decoration?.[0]}
          style={{
            position: "absolute",
            display: "block",
            top: "-5px",
            left: "-10px",
            "pointer-events": "none",
          }}
        />
      </Show>
      <ParentBase
        width={props.size}
        height={props.size}
        viewBox="0 0 32 32"
        interactive={props.interactive}
        style={{
          position: "absolute",
          "margin-top": "5px",
        }}
      >
        <foreignObject
          x="0"
          y="0"
          width="32"
          height="32"
          // @ts-expect-error Solid.js typing issue
          mask={
            props.holepunch ? `url(#holepunch-${props.holepunch})` : undefined
          }
        >
          {url() && <Image src={url()} draggable={false} shape={props.shape} />}
          {!url() && (
            <FallbackBase
              use:ripple
              shape={props.shape}
              primaryContrast={props.primaryContrast}
            >
              {typeof props.fallback === "string" ? (
                <Initials input={props.fallback} maxLength={2} />
              ) : (
                props.fallback
              )}
            </FallbackBase>
          )}
        </foreignObject>
        {props.overlay}
      </ParentBase>
      <Show when={props.decoration?.[1]}>
        <img
          loading="lazy"
          src={props.decoration?.[1]}
          style={{
            position: "absolute",
            display: "block",
            top: "-5px",
            left: "-10px",
            "pointer-events": "none",
          }}
        />
      </Show>
    </AvatarContainer>
  );
}
