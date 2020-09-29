import { all, contains, curry, unique } from "./utils";

export const ONE_OF = "OO";
export const REQUIRES_ONE = "RO";
export const REQUIRES_ALL = "RA";
export const NOT_WITH = "NW";
export const INCLUDED_IN = "IN";
export const INCLUDE_ONE = "IO";

// GETTERS
//    rulesForOption :: (id, state) -> [Rule]
export const rulesForOption = (id, state) =>
  state.options[id].ruleIds.map(id => state.rules[id]);

//    optionsForRule :: (id, state) -> [Option]
export const optionsForRule = (id, state) =>
  state.rules[id].optionIds.map(id => state.options[id]);

// fills out the option with rules and basket status
//    decorateOption :: State -> Int -> Option
export const decorateOption = curry((state, id) => {
  return {
    ...state.options[id],
    rules: rulesForOption(id, state),
    isSelected: isSelected(id, state)
  };
});

//           getRules :: ([Int], state) -> [Rule]
export const getRules = (ids, state) => ids.map(id => state.rules[id]);

// fills out the rule with options
//    decorateRule :: State -> Int -> Option
export const decorateRule = curry((state, id) => ({
  ...state.rules[id],
  options: optionsForRule(id, state)
}));

//    relatedOptionIds :: (id, state) -> [Int]
export const relatedOptionIds = (id, state) =>
  unique(
    rulesForOption(id, state)
      .map(({ optionIds }) => optionIds)
      .flat()
  );

// isSelected :: (Int, State) -> Boolean
export const isSelected = (id, state) => contains(id, state.selectedOptionIds);

export const addVehicleOptionsToState = (vehicleData, state) => {
  state.options = {};
  state.rules = {};
  vehicleData.map(
    ({
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
        id: `${optionCode}`,
        price: basicPrice,
        isDefault: defaultOption,
        categoryCode,
        categoryDescription,
        description,
        ruleIds: unique(option.ruleIds.concat([`${ruleCode}`]))
      });

      state.options[optionCode] = newOption;

      const rule = state.rules[ruleCode] || { optionIds: [] };
      const newRule = Object.assign(rule, {
        id: `${ruleCode}`,
        type: ruleType,
        optionIds: rule.optionIds.concat([`${optionCode}`])
      });

      if (isPrimary) {
        newRule.primaryOptionId = `${optionCode}`;
      }

      state.rules[ruleCode] = newRule;

      return true;
    }
  );

  return state;
};

//           getAppliedRuleIds :: ([Int], State) => [Int]
export const getAppliedRuleIds = (selectedOptionIds, state) =>
  selectedOptionIds.length === 0
    ? []
    : unique(
        selectedOptionIds.reduce(
          (rules, id) => rules.concat(state.options[id].ruleIds),
          []
        )
      );

//           isSelectable :: [Rule] -> Boolean
export const isSelectable = appliedRules => {
  return all(
    appliedRules.map(rule => {
      switch (rule.type) {
        case ONE_OF:
          return false;
        case REQUIRES_ONE:
          return true; // TODO: sort this out so that one is defiintely selected
        case REQUIRES_ALL:
          return true; // TODO: include this by default
        case NOT_WITH:
          return false;
        case INCLUDED_IN:
          return true; // TODO: include this by default
        case INCLUDE_ONE:
          return true; // TODO: sort this out so that one is definitely selected
        default:
          return true;
      }
    })
  );
};

//    selectOption :: (id, state) -> State
export const selectOption = (optionId, state) => {
  let selectedOptionIds = state.selectedOptionIds.concat([optionId]);

  let appliedRuleIds = rulesForOption(optionId, state).map(rule => {
    if (rule.type === REQUIRES_ALL && rule.primaryOptionId === optionId) {
      selectedOptionIds = unique(selectedOptionIds.concat(rule.optionIds));
    }
  });

  return {
    ...state,
    selectedOptionIds,
    appliedRuleIds: getAppliedRuleIds(selectedOptionIds, state)
  };
};
