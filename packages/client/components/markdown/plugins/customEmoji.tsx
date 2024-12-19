import { Match, Switch, createSignal, onMount } from "solid-js";

import { Handler } from "mdast-util-to-hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

import { useClient } from "@revolt/client";
import { Avatar, Column, Row, styled } from "@revolt/ui";

import { CustomEmoji, Emoji, RE_CUSTOM_EMOJI } from "../emoji";

/**
 * Render a custom emoji
 *
 * This will also display a tooltip and fallback to text if the emoji doesn't exist.
 */
export function RenderCustomEmoji(props: { id: string }) {
  const [exists, setExists] = createSignal(true);

  const client = useClient();

  /**
   * Resolve emoji
   */
  const emoji = () => client()!.emojis.get(props.id);

  /**
   * Resolve server
   */
  const server = () =>
    client()!.servers.get(
      (emoji()!.parent as { type: "Server"; id: string }).id
    )!;

  return (
    <Switch fallback={<span>{`:${emoji()?.name ?? props.id}:`}</span>}>
      <Match when={exists()}>
        <TooltipTrigger
          // @ts-expect-error this is a hack; replace with plain element & panda-css
          use:floating={{
            tooltip: {
              placement: "top",
              content: () => (
                <Row align gap="lg">
                  <span style={{ "--emoji-size": "3em" }}>
                    <Emoji emoji={props.id} />
                  </span>
                  <Switch
                    fallback={
                      <>
                        Unknown emote
                        <FetchEmote id={props.id} />
                      </>
                    }
                  >
                    <Match when={emoji()?.parent.type === "Server"}>
                      <Column align>
                        <span>{`:${emoji()!.name}:`}</span>
                        <Switch fallback="Private Server">
                          <Match when={server()}>
                            <Row align>
                              <Avatar
                                size={14}
                                src={server().animatedIconURL}
                              />
                              {server().name}
                            </Row>
                          </Match>
                        </Switch>
                      </Column>
                    </Match>
                  </Switch>
                </Row>
              ),
              aria:
                emoji()?.parent.type === "Server"
                  ? `:${emoji()!.name}: from ${
                      server()?.name ?? "Private Server"
                    }`
                  : "Unknown emote",
            },
          }}
        >
          <CustomEmoji id={props.id} onError={() => setExists(false)} />
        </TooltipTrigger>
      </Match>
    </Switch>
  );
}

/**
 * Container for trigger
 */
const TooltipTrigger = styled.div`
  display: inline-block;
`;

/**
 * Helper to fetch unknown emotes
 */
function FetchEmote(props: { id: string }) {
  const client = useClient();
  onMount(() => client().emojis.fetch(props.id));
  return null;
}

export const remarkCustomEmoji: Plugin = () => (tree) => {
  visit(
    tree,
    "text",
    (
      node: { type: "text"; value: string },
      idx,
      parent: { children: any[] }
    ) => {
      let elements = node.value.split(RE_CUSTOM_EMOJI);
      if (elements.length === 1) return; // no matches

      // Generate initial node
      const newNodes: (
        | { type: "text"; value: string }
        | {
            type: "customEmoji";
            id: string;
          }
      )[] = [
        {
          type: "text",
          value: elements.shift()!,
        },
      ];

      // Process all timestamps
      for (let i = 0; i < elements.length / 2; i++) {
        // Insert components
        newNodes.push({
          type: "customEmoji",
          id: elements[i * 2],
        });

        newNodes.push({
          type: "text",
          value: elements[i * 2 + 1],
        });
      }

      parent.children.splice(idx, 1, ...newNodes);
      return idx + newNodes.length;
    }
  );
};

export const customEmojiHandler: Handler = (h, node) => {
  return {
    type: "element" as const,
    tagName: "customEmoji",
    children: [],
    properties: {
      id: node.id,
    },
  };
};
