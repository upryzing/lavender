import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

const EditPronouns: PropGenerator<"edit_pronouns"> = (props) => {
  const t = useTranslation();

  /**
   * Apply new display name
   * @param newPronouns Display name
   */
  async function applyPronouns(newPronouns?: string[]) {
    if (newPronouns && newPronouns.length > 0) {
      await props.user.edit({ pronouns: newPronouns });
    } else {
      await props.user.edit({
        remove: ["Pronouns"],
      });
    }
  }

  return createFormModal({
    modalProps: {
      title: t("app.special.modals.account.change.display_name"),
    },
    schema: {
      // TODO: list it up
      pronouns: "text",
    },
    data: {
      pronouns: {
        field: "Pronouns",
        placeholder: "they/them...",
      },
    },
    callback: ({ pronouns }) => applyPronouns([pronouns]),
    submit: {
      children: t("app.special.modals.actions.update"),
    },
    actions: [
      {
        type: "button",
        variant: "plain",
        children: "Clear",
        /**
         * Clear display name
         */
        async onClick() {
          await applyPronouns();
          return true;
        },
      },
    ],
  });
};

export default EditPronouns;
