import { BiRegularX } from "solid-icons/bi";

import { Markdown } from "@revolt/markdown";
import { Button, Column, Row, Typography } from "@revolt/ui";

import { PropGenerator } from "../types";

/**
 * Modal to display channel information
 */
const ChannelInfo: PropGenerator<"channel_info"> = (props, onClose) => {
  return {
    title: (
      <Row align="center">
        <Column grow>
          <Typography variant="legacy-modal-title">{`#${props.channel.name}`}</Typography>
        </Column>
        <Button size="icon" variant="plain" onPress={onClose}>
          <BiRegularX size={36} />
        </Button>
      </Row>
    ),
    children: <Markdown content={props.channel.description!} />,
  };
};

export default ChannelInfo;
