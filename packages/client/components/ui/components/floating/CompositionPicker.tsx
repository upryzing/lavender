import { useFloating } from "solid-floating-ui";
import { For, JSX, Ref, Show, createEffect, createSignal, on } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { styled } from "styled-system/jsx";

import { scrollable } from "../../directives";
import { Column, Input } from "../design";

/**
 * Base element
 */
const Base = styled(Column, {
  base: {
    width: "400px",
    height: "400px",
    paddingInlineEnd: "5px",
  },
});

/**
 * Container element for the picker
 */
const Container = styled("div", {
  base: {
    flexGrow: 1,
    display: "flex",
    height: "400px",
    flexDirection: "column",
    color: "white",
    backgroundColor: "black",
    borderRadius: "var(--borderRadius-md)",
  },
});

const GifList = styled("div", {
  base: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gridTemplateRows: "masonry",
    overflowY: "scroll",
  },
});

interface Props {
  /**
   * User card trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: Ref<any>;
    onClickGif: () => void;
    onClickEmoji: () => void;
  }) => JSX.Element;

  /**
   * Send a message
   */
  sendGIFMessage: (content: string) => void;
}

type GifBoxFile = {
  _id: string;
  fileName: string;
  originalFileName: string;
  extension: string;
  bucket: string;
  mimeType: string;
  uploadDate: string;
  author: string;
  size: number;
  sha512: string;
};

type Gif = {
  author: {
    _id: string;
    displayName: string;
    username: string;
    description: string;
    verified: boolean;
    avatar: GifBoxFile;
  };
  tags: string[];
  title: string;
  _id: string;
  slug: string;
  file: GifBoxFile;
  createdAt: string;
  views: number;
};

/**
 * CompositionPicker component
 *
 * Provides an emoji and GIF picker
 */
export function CompositionPicker(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(false);

  const position = useFloating(anchor, floating, {
    placement: "top-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const [data, setData] = createSignal<Gif[]>([]);

  let fetched = false;

  createEffect(
    on(
      () => show(),
      (show) => {
        if (show && !fetched) {
          fetch("https://api.gifbox.me/post/popular")
            .then((x) => x.json())
            .then(setData);

          fetched = true;
        }
      }
    )
  );

  /**
   * Execute search query
   * @param query Query
   */
  function search(query: string) {
    fetch(
      `https://api.gifbox.me/post/search?query=${encodeURIComponent(
        query
      )}&limit=25`
    )
      .then((x) => x.json())
      .then((x) => x.hits)
      .then(setData);
  }

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClickGif: () => setShow(!show()),
        onClickEmoji: () => setShow(!show()),
      })}
      <Portal mount={document.getElementById("floating")!}>
        <Presence>
          <Show when={show()}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
            >
              <Base
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                }}
                role="tooltip"
              >
                <Container>
                  <Input
                    placeholder="search for gifs :)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        search(e.currentTarget.value);
                      }
                    }}
                  />
                  <GifList>
                    <For each={data()}>
                      {(entry) => (
                        <div>
                          <a
                            onClick={() =>
                              props.sendGIFMessage(
                                `https://gifbox.me/view/${entry._id}-${entry.slug}`
                              )
                            }
                          >
                            <img
                              style={{ width: "100%" }}
                              src={`https://api.gifbox.me/file/${entry.file.bucket}/${entry.file.fileName}`}
                            />
                          </a>
                        </div>
                      )}
                    </For>
                  </GifList>
                </Container>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
