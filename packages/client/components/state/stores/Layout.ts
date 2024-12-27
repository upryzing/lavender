import { paramsFromPathname } from "@revolt/routing";

import { State } from "..";

import { AbstractStore } from ".";

/**
 * Static section IDs
 */
export enum LAYOUT_SECTIONS {
  MEMBER_SIDEBAR = "MEMBER_SIDEBAR",
  MENTION_REPLY = "MENTION_REPLY",
  MATURE = "nsfw",
}

export interface TypeLayout {
  /**
   * The current section of the program we are in
   *
   * This can currently either be:
   * - home
   * - discover
   * - a server ID
   */
  activeInterface: "home" | "discover" | string;

  /**
   * Current path within an interface
   */
  activePath: Record<TypeLayout["activeInterface"], string>;

  /**
   * Open (or closed) sections of the UI
   *
   * Only the contrary is ever stored
   */
  openSections: Record<string, boolean>;
}

/**
 * Handles layout and navigation of the app.
 */
export class Layout extends AbstractStore<"layout", TypeLayout> {
  /**
   * Construct store
   * @param state State
   */
  constructor(state: State) {
    super(state, "layout");
  }

  /**
   * Hydrate external context
   */
  hydrate(): void {
    /** nothing needs to be done */
  }

  /**
   * Generate default values
   */
  default(): TypeLayout {
    return {
      activeInterface: "home",
      activePath: {
        home: "/",
        discover: "/discover/servers",
      },
      openSections: {},
    };
  }

  /**
   * Validate the given data to see if it is compliant and return a compliant object
   */
  clean(input: Partial<TypeLayout>): TypeLayout {
    const layout: TypeLayout = this.default();

    if (typeof input.activeInterface === "string") {
      layout.activeInterface = input.activeInterface;
    }

    if (typeof input.activePath === "object") {
      for (const interfaceId of Object.keys(input.activePath)) {
        if (typeof input.activePath[interfaceId] === "string") {
          layout.activePath[interfaceId] = input.activePath[interfaceId];
        }
      }
    }

    if (typeof input.openSections === "object") {
      for (const section of Object.keys(input.openSections)) {
        if (typeof input.openSections[section] === "boolean") {
          layout.openSections[section] = input.openSections[section];
        }
      }
    }

    return layout;
  }

  /**
   * Get the last active path in the app
   */
  getLastActivePath() {
    const section = this.get().activeInterface;
    return this.get().activePath[section] ?? "/";
  }

  /**
   * Set the last active path in the app
   */
  setLastActivePath(pathname: string) {
    const params = paramsFromPathname(pathname);
    const section = params.serverId ?? "home";
    this.set("activeInterface", section);
    this.set("activePath", section, pathname);
  }

  /**
   * Get state of a section
   * @param id Section ID
   * @param defaultValue Default state value
   * @returns Whether the section is open
   */
  getSectionState(id: string, defaultValue = false) {
    return this.get().openSections[id] ?? defaultValue;
  }

  /**
   * Set the state of a section
   * @param id Section ID
   * @param value New state value
   * @param defaultValue Default state value
   */
  setSectionState(id: string, value: boolean, defaultValue = false) {
    this.set("openSections", id, value === defaultValue ? undefined! : value);
  }

  /**
   * Toggle state of a section
   * @param id Section ID
   * @param defaultValue Default state value
   */
  toggleSectionState(id: string, defaultValue?: boolean) {
    this.setSectionState(
      id,
      !this.getSectionState(id, defaultValue),
      defaultValue
    );
  }
}
