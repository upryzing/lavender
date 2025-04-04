import {
  BiLogos500px,
  BiLogosGithub,
  BiLogosHtml5,
  BiLogosMastodon,
  BiLogosTwitter,
} from "solid-icons/bi";
import { JSX } from "solid-js";

import { styled } from "styled-system/jsx";

import { useTranslation } from "@revolt/i18n";
import { Button, iconSize } from "@revolt/ui";

import MdDarkMode from "@material-design-icons/svg/filled/dark_mode.svg?component-solid";

import background from "./background.jpg";
import { FlowBase } from "./flows/Flow";

/**
 * Authentication page layout
 */
const Base = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    padding: "40px 35px",

    userSelect: "none",
    overflowY: "scroll",

    color: "white",
    background: "var(--colours-background)",
    // background: `var(--url)`,
    // backgroundPosition: "center",
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    mdDown: {
      padding: "30px 20px",
    },
  },
});

/**
 * Top and bottom navigation bars
 */
const Nav = styled("div", {
  base: {
    height: "32px",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",

    color: "white",
    textDecoration: "none",

    md: {
      color: "var(--colours-foreground)",
    },
  },
});

/**
 * Navigation items
 */
const NavItems = styled("div", {
  base: {
    gap: "10px",
    display: "flex",
    alignItems: "center",

    fontSize: "0.9em",
  },
  variants: {
    variant: {
      default: {},
      stack: {
        md: {
          flexDirection: "column",
        },
      },
      hide: {
        md: {
          display: "none",
        },
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Link with an icon inside
 */
const LinkWithIcon = styled("a", {
  base: { height: "24px" },
});

/**
 * Middot-like bullet
 */
const Bullet = styled("div", {
  base: {
    height: "5px",
    width: "5px",
    background: "grey",
    borderRadius: "50%",

    md: {
      display: "none",
    },
  },
});

/**
 * Revolt Wordmark
 */
const Logo = styled("img", {
  base: {
    height: "24px",
  },
});

let a = true;

/**
 * Authentication page
 */
export function AuthPage(props: { children: JSX.Element }) {
  const t = useTranslation();

  return (
    <Base style={{ "--url": `url('${background}')` }}>
      <Nav>
        <div />
        <Button
          size="icon"
          onPress={() => {
            a = !a;
            (window as any)._demo_setDarkMode(a);
          }}
        >
          <MdDarkMode {...iconSize("24px")} />
        </Button>
      </Nav>
      {/*<Nav>
        <Logo src={wideSvg} />
        <LocaleSelector />
      </Nav>*/}
      <FlowBase>{props.children}</FlowBase>
      <Nav>
        <NavItems variant="stack">
          <NavItems>
            <LinkWithIcon href="https://github.com/upryzing" target="_blank">
              <BiLogosGithub size={24} />
            </LinkWithIcon>
            <LinkWithIcon
              href="https://bsky.app/profile/upryzing.app"
              target="_blank"
            >
              <BiLogosTwitter size={24} />
              {
                // eslint-disable-next-line spellcheck/spell-checker
                /* No bsky icon in solid-icons */
              }
            </LinkWithIcon>
            <LinkWithIcon href="https://lea.pet/@upryzing" target="_blank">
              <BiLogosMastodon size={24} />
            </LinkWithIcon>
          </NavItems>
          <Bullet />
          <NavItems>
            <a href="https://revolt.chat/about" target="_blank">
              {t("general.about")}
            </a>
            <a href="https://revolt.chat/terms" target="_blank">
              {t("general.tos")}
            </a>
            <a href="https://revolt.chat/privacy" target="_blank">
              {t("general.privacy")}
            </a>
          </NavItems>
        </NavItems>
        <NavItems variant="hide">
          {t("general.image_by")} @fakurian
          <Bullet />
          <a href="https://unsplash.com/" target="_blank" rel="noreferrer">
            unsplash.com
          </a>
        </NavItems>
      </Nav>
    </Base>
  );
}
