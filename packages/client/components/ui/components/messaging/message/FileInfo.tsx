import {
  BiRegularDownload,
  BiRegularHeadphone,
  BiRegularLinkExternal,
  BiSolidFile,
  BiSolidFileTxt,
  BiSolidImage,
  BiSolidVideo,
} from "solid-icons/bi";
import { Match, Show, Switch } from "solid-js";
import { styled } from "styled-system/jsx";

import { File, MessageEmbed } from "@upryzing/upryzing.js";

import { Typography } from "../../design/atoms/display/Typography";
import { Column, Row } from "../../design/layout";

import { humanFileSize } from "./Attachment";

/**
 * Base container
 */
const Base = styled(Row, {
  base: {
    color: "var(--colours-foreground)",
  },
});

/**
 * Link action
 */
const Action = styled("a", {
  base: {
    color: "var(--colours-foreground)",
    display: "grid",
    placeItems: "center",
  },
});

interface Props {
  /**
   * File information
   */
  file?: File;

  /**
   * Embed information
   */
  embed?: MessageEmbed;
}

/**
 * Information about a given attachment or embed
 */
export function FileInfo(props: Props) {
  return (
    <Base align>
      <Switch fallback={<BiSolidFile size={24} />}>
        <Match
          when={
            props.file?.metadata.type === "Image" ||
            props.embed?.type === "Image"
          }
        >
          <BiSolidImage size={24} />
        </Match>
        <Match
          when={
            props.file?.metadata.type === "Video" ||
            props.embed?.type === "Video"
          }
        >
          <BiSolidVideo size={24} />
        </Match>
        <Match when={props.file?.metadata.type === "Audio"}>
          <BiRegularHeadphone size={24} />
        </Match>
        <Match when={props.file?.metadata.type === "Text"}>
          <BiSolidFileTxt size={24} />
        </Match>
      </Switch>
      <Column grow>
        <span>{props.file?.filename}</span>
        <Show when={props.file?.size}>
          <Typography variant="small">
            {humanFileSize(props.file!.size!)}
          </Typography>
        </Show>
      </Column>
      <Show when={props.file?.url}>
        <Action href={props.file?.url} target="_blank" rel="noreferrer">
          <BiRegularLinkExternal size={24} />
        </Action>
      </Show>
      <Show when={props.file?.downloadURL}>
        <Action href={props.file?.downloadURL}>
          <BiRegularDownload size={24} />
        </Action>
      </Show>
    </Base>
  );
}
