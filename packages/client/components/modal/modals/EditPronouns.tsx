import { useTranslation } from "@revolt/i18n";

import { createFormModal } from "../form";
import { PropGenerator } from "../types";

const EditPronouns: PropGenerator<"edit_pronouns"> = (props) => {
  const t = useTranslation();

  /**
   * Apply new pronouns
   * @param newPronouns New pronouns to be sent to server. If omitted, clears server pronouns
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
      title: t("app.special.modals.account.change.pronouns"),
    },
    schema: {
      firstPronoun: "text",
      secondPronoun: "text",
      thirdPronoun: "text",
      fourthPronoun: "text",
    },
    data: {
      firstPronoun: {
        field: "First Pronouns",
        placeholder: "they/them...",
        maxLength: 15,
      },
      secondPronoun: {
        field: "Second Pronouns",
        placeholder: "they/them...",
        maxLength: 15,
      },
      thirdPronoun: {
        field: "Third Pronouns",
        placeholder: "they/them...",
        maxLength: 15,
      },
      fourthPronoun: {
        field: "Fourth Pronouns",
        placeholder: "they/them...",
        maxLength: 15,
      },
    },
    callback: ({
      firstPronoun,
      secondPronoun,
      thirdPronoun,
      fourthPronoun,
    }) => {
      const pronounInput = [
        firstPronoun,
        secondPronoun,
        thirdPronoun,
        fourthPronoun,
      ];
      var pronounsArray: string[] = [];

      for (var count in pronounInput) {
        var val = pronounInput[count];

        console.log(val);
        if (val.length > 0) pronounsArray.push(val);
      }

      console.log(pronounsArray);

      if (pronounsArray.length == 0) {
        return applyPronouns();
      }

      return applyPronouns(pronounsArray);
    },
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
