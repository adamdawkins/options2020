import { contains, unique, without } from "./utils";
import {
  INCLUDED_IN,
  REQUIRES_ONE,
  REQUIRES_ALL,
  rulesForOption,
  getAppliedRuleIds
} from "./helpers";

//           selectOption :: (id, state) -> State
export const selectOption = (optionId, state) => {
  let selectedOptionIds = state.selectedOptionIds.concat([optionId]);

  rulesForOption(optionId, state).map(rule => {
    if (
      contains(rule.type, [INCLUDED_IN, REQUIRES_ALL]) &&
      rule.primaryOptionId === optionId
    ) {
      selectedOptionIds = unique(selectedOptionIds.concat(rule.optionIds));
      rule.optionIds.map(otherOptionId => {
        rulesForOption(otherOptionId, state).map(otherRule => {
          if (
            contains(otherRule.type, [INCLUDED_IN, REQUIRES_ALL]) &&
            otherRule.primaryOptionId === otherOptionId
          ) {
            selectedOptionIds = unique(
              selectedOptionIds.concat(otherRule.optionIds)
            );
          }
        });
      });
    }
  });

  return {
    ...state,
    selectedOptionIds,
    appliedRuleIds: getAppliedRuleIds(selectedOptionIds, state)
  };
};

//           removeOption :: (id, state) -> State
export const removeOption = (id, state) => {
  const option = state.options[id];
  let selectedOptionIds = without(id, state.selectedOptionIds);

  rulesForOption(id, state).map(rule => {
    if (rule.type === REQUIRES_ALL) {
      selectedOptionIds = without(rule.primaryOptionId, selectedOptionIds);
    }

    if (rule.type === REQUIRES_ONE) {
      const otherSelectedOptions = without(
        id,
        rule.optionIds
      ).filter(optionId => contains(optionId, selectedOptionIds));
      if (
        otherSelectedOptions.length === 1 &&
        otherSelectedOptions[0] === rule.primaryOptionId
      ) {
        selectedOptionIds = without(rule.primaryOptionId, selectedOptionIds);
      }
    }

    if (rule.type === INCLUDED_IN && rule.primaryOptionId === id) {
      selectedOptionIds = without(rule.optionIds, selectedOptionIds);
    }
  });

  return {
    ...state,
    selectedOptionIds,
    appliedRuleIds: getAppliedRuleIds(selectedOptionIds, state)
  };
};
