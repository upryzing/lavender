import { Component, JSXElement } from "solid-js";
import { styled } from "solid-styled-components";

interface LayerProps {
  position: "behind" | "front" | "middle";
  children: JSXElement;
  top?: number;
}

interface StackViewProps {
  children: JSXElement;
  size?: number;
}

const StackViewBase = styled("div")<{ size?: number }>`
  display: grid;
`;

const Layer = styled("div")<LayerProps>`
  z-index: ${(props) => ({ behind: -1, front: 1, middle: 0 }[props.position])};
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 1;
  grid-column: 1;
`;

/**
 * StackView is a component that allows for the rendering of multiple layers on top of each other.
 *
 * It exposes `StackView.Layer`
 */
const StackView: Component<StackViewProps> & {
  /**
   * A component that renders a layer within a StackView.
   *
   * @param props.depth - The z-index depth of the layer.
   * @param props.offset - An optional offset for the layer's position, specified as a tuple of [top, left] values in pixels.
   */
  Layer: Component<LayerProps>;
} = (props) => {
  return <StackViewBase size={props.size}>{props.children}</StackViewBase>;
};

StackView.Layer = Layer;

export default StackView;
