import { For, Match, Switch, createSignal } from "solid-js";

import { Trans } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { CategoryButton, Column, Dialog, DialogProps } from "@revolt/ui";
import type { DialogAction } from "@revolt/ui/components/design/Dialog";

import { Markdown } from "@revolt/markdown";
import { Symbol } from "@revolt/ui/components/utils/Symbol";
import { Modals } from "../types";

/**
 * Changelog element
 */
type Element =
  | string
  | {
      type: "image";
      src: string;
    };

/**
 * Changelog post
 */
export interface ChangelogPost {
  icon: string;
  date: Date;
  link: string;
  title: string;
  content: Element[];
}

const ChangelogPosts: ChangelogPost[] = [
  // {
  //   icon: "key",
  //   date: new Date("2022-06-12T20:39:16.674Z"),
  //   title: "Secure your account with 2FA",
  //   content: [
  //     "Two-factor authentication is now available to all users, you can now head over to settings to enable recovery codes and an authenticator app.",
  //     {
  //       type: "image",
  //       src: "https://autumn.revolt.chat/attachments/E21kwmuJGcASgkVLiSIW0wV3ggcaOWjW0TQF7cdFNY/image.png",
  //     },
  //     "Once enabled, you will be prompted on login.",
  //     {
  //       type: "image",
  //       src: "https://autumn.revolt.chat/attachments/LWRYoKR2tE1ggW_Lzm547P1pnrkNgmBaoCAfWvHE74/image.png",
  //     },
  //     "Other authentication methods coming later, stay tuned!",
  //   ],
  // },
  {
    icon: "voice_chat",
    date: new Date("2025-11-08T14:00:00.000Z"),
    link: "https://stoat.chat/updates/web-0013",
    title: "Stoat for Web: 0.0.13",
    content: [
      `This update brings a host of improvements to voice chats along with an improved messaging experience.

## Improved Voice Chats
A brand new user interface with picture-in-picture support to keep an eye on your voice chats while you multitask.`,
      {
        type: "image",
        src: "https://stoat.chat/content/changelog/web-0.0.13/pip.gif",
      },
      `You can now also see who is in a voice chat and who is speaking, making it easier to keep track of conversations.

## Improved Text Editor
The text editor has been revamped to provide a smoother and more intuitive messaging experience. We've taken and improved the experience from our old web app, featuring rich text preview while not intruding on what you're typing.`,
      {
        type: "image",
        src: "https://stoat.chat/content/changelog/web-0.0.13/text_editor.png",
      },
      `For an in-depth look at all the new features and improvements, check out our blog post by pressing read more!`,
    ],
  },
];

export const CHANGELOG_MODAL_CONST = {
  index: 0,
  until: new Date("2026-01-01T00:00:00.000Z"),
};

/**
 * Modal to display changelog
 */
export function ChangelogModal(
  props: DialogProps & Modals & { type: "changelog" },
) {
  const [log, setLog] = createSignal(props.initial);

  /**
   * Get the currently selected log
   * @returns Log
   */
  const currentLog = () =>
    typeof log() !== "undefined" ? ChangelogPosts[log()!] : undefined;

  const actions = () => {
    const actionList: DialogAction[] = [
      {
        text: <Trans>Read More</Trans>,
        onClick() {
          window.open(currentLog()?.link, "_blank");
        },
      },
      { text: <Trans>Close</Trans> },
    ];

    // if (currentLog()) {
    //   actionList.push({
    //     text: <Trans>View older updates</Trans>,
    //     onClick: () => {
    //       setLog(undefined);
    //       return false;
    //     },
    //   });
    // }

    return actionList;
  };

  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={
        <Switch fallback={<Trans>Changelog</Trans>}>
          <Match when={currentLog()}>{currentLog()!.title}</Match>
        </Switch>
      }
      actions={actions()}
    >
      <Switch
        fallback={
          <Column>
            <For each={ChangelogPosts}>
              {(entry, index) => {
                /**
                 * Handle changing post
                 */
                const onClick = () => setLog(index());

                return (
                  <CategoryButton
                    icon={<Symbol>{entry.icon}</Symbol>}
                    onClick={onClick}
                  >
                    {entry.title}
                  </CategoryButton>
                );
              }}
            </For>
          </Column>
        }
      >
        <Match when={currentLog()}>
          <RenderLog post={currentLog()!} />
        </Match>
      </Switch>
    </Dialog>
  );
}

/**
 * Render a single changelog post
 */
function RenderLog(props: { post: ChangelogPost }) {
  return (
    <Column>
      <For each={props.post.content}>
        {(entry) => (
          <Switch>
            <Match when={typeof entry === "string"}>
              <Markdown content={entry as string} />
            </Match>
            <Match when={typeof entry === "object" && entry.type === "image"}>
              <Image src={(entry as { src: string }).src} loading="lazy" />
            </Match>
          </Switch>
        )}
      </For>
    </Column>
  );
}

/**
 * Image wrapper
 */
const Image = styled("img", {
  base: {
    borderRadius: "var(--borderRadius-md)",
  },
});
