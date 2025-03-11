import {
  Accessor,
  createContext,
  createSignal,
  untrack,
  useContext,
} from "solid-js";

import { Motion, Presence } from "solid-motionone";
import { Rerun } from "@solid-primitives/keyed";

import { SettingsConfiguration, SettingsEntry } from ".";
import { SettingsContent } from "./_layout/Content";
import { SettingsSidebar } from "./_layout/Sidebar";

export interface SettingsProps {
  /**
   * Close settings
   */
  onClose?: () => void;

  /**
   * Settings context
   */
  context: never;
}

/**
 * Transition animation
 */
export type SettingsTransition = "normal" | "to-child" | "to-parent";

/**
 * Provide navigation to child components
 */
const SettingsNavigationContext = createContext<{
  page: Accessor<string | undefined>;
  navigate: (path: string | SettingsEntry) => void;
}>();

/**
 * Generic Settings component
 */
export function Settings(props: SettingsProps & SettingsConfiguration<never>) {
  const [page, setPage] = createSignal<undefined | string>();
  const [transition, setTransition] =
    createSignal<SettingsTransition>("normal");

  /**
   * Navigate to a certain page
   */
  function navigate(entry: string | SettingsEntry) {
    let id;
    if (typeof entry === "object") {
      if (entry.onClick) {
        entry.onClick();
      } else if (entry.href) {
        window.open(entry.href, "_blank");
      } else if (entry.id) {
        id = entry.id;
      }
    } else {
      id = entry;
    }

    if (!id) return;

    const current = page();
    if (current?.startsWith(id)) {
      setTransition("to-parent");
    } else if (current && id.startsWith(current)) {
      setTransition("to-child");
    } else {
      setTransition("normal");
    }

    setPage(id);
  }

  return (
    <SettingsNavigationContext.Provider
      value={{
        page,
        navigate,
      }}
    >
      <SettingsSidebar
        context={props.context}
        list={props.list}
        page={page}
        setPage={setPage}
      />
      <SettingsContent page={page} title={props.title} onClose={props.onClose}>
        <Presence exitBeforeEnter>
          <Rerun on={page}>
            <Motion.div
              style={
                untrack(transition) === "normal" ? {} : { visibility: "hidden" }
              }
              ref={(el) =>
                untrack(transition) !== "normal" &&
                setTimeout(() => (el.style.visibility = "visible"), 250)
              }
              initial={
                transition() === "normal"
                  ? { opacity: 0, y: 50 }
                  : transition() === "to-child"
                  ? {
                      x: "100vw",
                    }
                  : { x: "-100vw" }
              }
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={
                transition() === "normal"
                  ? undefined
                  : transition() === "to-child"
                  ? {
                      x: "-100vw",
                    }
                  : { x: "100vw" }
              }
              transition={{ duration: 0.2, easing: [0.17, 0.67, 0.58, 0.98] }}
            >
              {props.render({ page }, props.context)}
            </Motion.div>
          </Rerun>
        </Presence>
      </SettingsContent>
    </SettingsNavigationContext.Provider>
  );
}

/**
 * Use settings navigation context
 */
export const useSettingsNavigation = () =>
  useContext(SettingsNavigationContext)!;
