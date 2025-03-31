import { Show } from "solid-js";

import dayjs from "dayjs";
import { User } from "@upryzing/upryzing.js";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Avatar, Button, CategoryButtonGroup, iconSize } from "@revolt/ui";

import MdCakeFill from "@material-design-icons/svg/filled/cake.svg?component-solid";
import MdEdit from "@material-design-icons/svg/outlined/edit.svg?component-solid";

const banner = cva({
    base: {
        background: "var(--colours-settings-background)"
    }
})

export function UserSummary(props: {
  user: User;
  showBadges?: boolean;
  bannerUrl?: string;
  onEdit?: () => void;
}) {

  return (
    <CategoryButtonGroup>
      <AccountBox style={banner()}>
        <ProfileDetails>
          <Avatar src={props.user.animatedAvatarURL} size={58} />
          <Username>
            <span>{props.user.displayName}</span>
            <span>
              {props.user.username}#{props.user.discriminator}
            </span>
          </Username>
          <Show when={props.onEdit}>
            <Button size="fab" onPress={props.onEdit}>
              <MdEdit />
            </Button>
          </Show>
        </ProfileDetails>
        <Show when={props.showBadges}>
          <BottomBar>
            <DummyPadding />
            {/* <ProfileBadges>
              <MdDraw {...iconSize(20)} />
              <MdDraw {...iconSize(20)} />
              <MdDraw {...iconSize(20)} />
            </ProfileBadges> */}
            <ProfileBadges>
              <span
                use:floating={{
                  tooltip: {
                    placement: "top",
                    content: dayjs(props.user.createdAt).format(
                      "[Account created] Do MMMM YYYY [at] HH:mm"
                    ),
                  },
                }}
              >
                {/* TODO)) Change colour to something more... appropriate... */}
                <MdCakeFill fill="var(--colours-settings-foreground)" {...iconSize(18)} />
              </span>
            </ProfileBadges>
          </BottomBar>
        </Show>
      </AccountBox>
    </CategoryButtonGroup>
  );
}

const AccountBox = styled("div", {
  base: {
    display: "flex",
    padding: "var(--gap-lg)",
    flexDirection: "column",

    backgroundSize: "cover",
    backgroundPosition: "center",
  },
});

const ProfileDetails = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-lg)",
    alignItems: "center",
  },
});

const Username = styled("div", {
  base: {
    flexGrow: 1,

    display: "flex",
    flexDirection: "column",

    // Display Name
    "& :nth-child(1)": {
      fontSize: "18px",
      fontWeight: 600,
    },

    // Username#Discrim
    "& :nth-child(2)": {
      fontSize: "14px",
      fontWeight: 400,
    },
  },
});

const BottomBar = styled("div", {
  base: {
    display: "flex",
  },
});

const DummyPadding = styled("div", {
  base: {
    flexShrink: 0,
    // Matches with avatar size
    width: "58px",
    // Matches with ProfileDetails
    marginInlineEnd: "var(--gap-lg)",
  },
});

const ProfileBadges = styled("div", {
  base: {
    display: "flex",
    gap: "var(--gap-sm)",
    width: "fit-content",
    padding: "var(--gap-sm) var(--gap-sm)",
    borderRadius: "var(--borderRadius-md)",

    background: "var(--colours-settings-background)",
  },
});
