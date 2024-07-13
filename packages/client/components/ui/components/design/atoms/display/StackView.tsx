import { Component, JSXElement } from "solid-js";
import { styled } from "solid-styled-components";

interface LayerProps {
  depth: number;
  children: JSXElement;
  /** [top, left] */
  offset?: [number, number];
}

interface StackViewProps {
  children: JSXElement;
}

const StackViewBase = styled("div")`
  display: block;
  position: relative;
`;

const Layer: Component<LayerProps> = (props) => {
  return (
    <div
      class={`layer dpth-${props.depth}`}
      style={{
        "z-index": props.depth,
        position: "absolute",
        top: props.offset && `${props.offset[0]}px`,
        left: props.offset && `${props.offset[1]}px`,
      }}
    >
      {props.children}
    </div>
  );
};

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
  return <StackViewBase>{props.children}</StackViewBase>;
};

StackView.Layer = Layer;

export default StackView;
