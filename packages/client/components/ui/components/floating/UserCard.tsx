import { JSX, createMemo } from "solid-js";
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { getController } from "@revolt/common";

import { Avatar, ColouredText, Row, Username } from "../design";

/**
 * Base element for the card
 */
const Base = styled("div", "Tooltip")`
  width: 400px;
  height: 400px;
  border-radius: ${(props) => props.theme!.borderRadius.lg};
  padding: ${(props) => props.theme!.gap.lg};

  /** FIXME: make these their own colours */
  background: ${(props) =>
    props.theme!.colours["component-context-menu-background"]};
  color: ${(props) =>
    props.theme!.colours["component-context-menu-foreground"]};

  box-shadow: 0 0 3px
    ${(props) => props.theme!.colours["component-context-menu-shadow"]};
`;

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives["floating"]["userCard"] & object
) {
  const roleIds = createMemo(
    () => new Set(props.member?.orderedRoles.map((role) => role.id))
  );

  // Disable it while it's being developed
  if (!getController("state").experiments.isEnabled("user_card")) return null;

  return (
    <Base>
      <Row style={{ "align-items": "center" }}>
        <Avatar src={props.user.animatedAvatarURL} size={58} />
        <div>
          <Show when={props.member}>
            <Username
              username={props.member!.nickname ?? props.user.username}
              colour={props.member!.roleColour!}
            />
            <br />
          </Show>
          {props.user.username}
        </div>
      </Row>
      <Show when={props.member}>
        <br />
        <br />
        <For each={props.member!.orderedRoles}>
          {(role) => (
            <div
              onClick={() =>
                props.member!.edit({
                  roles: [...roleIds()].filter((id) => id !== role.id),
                })
              }
            >
              <ColouredText
                colour={role.colour!}
                clip={role.colour?.includes("gradient")}
              >
                {role.name}
              </ColouredText>
            </div>
          )}
        </For>
        <br />
        <Row wrap>
          <For
            each={props.member?.server?.orderedRoles.filter(
              (role) => !roleIds().has(role.id)
            )}
          >
            {(role) => (
              <span
                onClick={() =>
                  props.member!.edit({
                    roles: [...roleIds(), role.id],
                  })
                }
              >
                <ColouredText
                  colour={role.colour!}
                  clip={role.colour?.includes("gradient")}
                >
                  {role.name}
                </ColouredText>
              </span>
            )}
          </For>
        </Row>
      </Show>
    </Base>
  );
}
