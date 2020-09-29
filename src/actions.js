import { unique } from "./utils";
import { rulesForOption, REQUIRES_ALL, getAppliedRuleIds } from "./helpers";

export const selectOption = (optionId, state) => {
  let selectedOptionIds = state.selectedOptionIds.concat([optionId]);

  rulesForOption(optionId, state).map(rule => {
    if (rule.type === REQUIRES_ALL && rule.primaryOptionId === optionId) {
      selectedOptionIds = unique(selectedOptionIds.concat(rule.optionIds));
      rule.optionIds.map(otherOptionId => {
        rulesForOption(otherOptionId, state).map(otherRule => {
          if (
            otherRule.type === REQUIRES_ALL &&
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
