import data from "./data";
import { unique, path, contains } from "./utils";
import { relatedOptionIds } from "./helpers";

// DEBUGGING HELPERS
export default {
  addVehicleOptionsToState: (capcode, state) => {
    state.options = {};
    state.rules = {};
    const vehicleData = data[capcode];
    vehicleData.map(
      ({
        id,
        capcode,
        name,
        introduced,
        discontinued,
        periodCode,
        periodEffectiveFrom,
        periodEffectiveTo,
        ruleCode,
        ruleType,
        optionCode,
        isPrimary,
        basicPrice,
        vat,
        defaultOption,
        description,
        nonSpecificCostOption,
        categoryCode,
        categoryDescription
      }) => {
        const option = state.options[optionCode] || { ruleIds: [] };
        const newOption = Object.assign(option, {
          id: optionCode,
          price: basicPrice,
          isDefault: defaultOption,
          description,
          ruleIds: unique(option.ruleIds.concat([ruleCode]))
        });

        state.options[optionCode] = newOption;

        const rule = state.rules[ruleCode] || { optionIds: [] };
        const newRule = Object.assign(rule, {
          id: ruleCode,
          type: ruleType,
          optionIds: rule.optionIds.concat([optionCode])
        });

        if (isPrimary) {
          newRule.primaryOptionId = optionCode;
        }

        state.rules[ruleCode] = newRule;

        return true;
      }
    );

    return state;
  },
  isRelated: (id, state) => {
    const viewedType = path(["debug", "view", "type"], state);
    const viewedId = path(["debug", "view", "id"], state);

    if (viewedType !== "option") {
      return false;
    }

    return contains(id, relatedOptionIds(viewedId, state));
  },
  isViewed: (id, state) => {
    const viewedType = path(["debug", "view", "type"], state);
    const viewedId = path(["debug", "view", "id"], state);

    return viewedType === "option" && viewedId === id;
  }
};
