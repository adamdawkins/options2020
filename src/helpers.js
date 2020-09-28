import { curry, unique, contains } from "./utils";

// GETTERS
//    rulesForOption :: (id, state) -> [Rule]
export const rulesForOption = (id, state) =>
  state.options[id].ruleIds.map(id => state.rules[id]);

//    optionsForRule :: (id, state) -> [Option]
export const optionsForRule = (id, state) =>
  state.rules[id].optionIds.map(id => state.options[id]);

// fills out the option with rules and basket status
//    decorateOption :: State -> Int -> Option
export const decorateOption = curry((state, id) => ({
  ...state.options[id],
  rules: rulesForOption(id, state),
  isSelected: isSelected(id, state)
}));

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
export const isSelected = (id, state) => contains(id, state.selectedOptions);

export const addVehicleOptionsToState = (vehicleData, state) => {
  state.options = {};
  state.rules = {};
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
};
