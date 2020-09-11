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
