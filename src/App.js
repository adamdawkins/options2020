import React, { useReducer } from "react";
import { VWGO20ME_5EDTA_6 } from "./data";
import "./App.css";

// UTILS

//    without :: (x, [x]) -> [x]
const without = (item, list) => list.filter(x => x !== item);

//    contains :: (x, [x]) -> Boolean
const contains = (item, list) => list.indexOf(item) > -1;

//    unique :: [x] -> [x]
const unique = list => [...new Set(list)];

// DATA HANDLERS & SETUP

//    init :: [OptionRow] => State
const init = data => {
  const state = {
    options: {},
    rules: {},
    selectedOptions: [],
    appliedRules: []
  };

  data.map(
    ([
      ruleCode,
      ruleType,
      optionCode,
      isPrimary,
      basicPrice,
      vat,
      defaultOption,
      description
    ]) => {
      const option = state.options[optionCode] || { ruleIds: [] };
      const newOption = Object.assign(option, {
        id: optionCode,
        price: basicPrice,
        isDefault: defaultOption,
        description: description,
        ruleIds: option.ruleIds.concat([ruleCode])
      });

      state.options[optionCode] = newOption;

      const rule = state.rules[ruleCode] || { optionIds: [] };
      const newRule = Object.assign(rule, {
        id: ruleCode,
        type: ruleType,
        optionIds: rule.optionIds.concat([optionCode])
      });

      state.rules[ruleCode] = newRule;

      return true;
    }
  );

  return state;
};

// STATE

//    selectOption :: (id, state) -> State
const selectOption = (id, state) => ({
  ...state,
  selectedOptions: state.selectedOptions.concat([id]),
  appliedRules: unique(state.appliedRules.concat(state.options[id].ruleIds))
});

//    deselectOption :: (id, state) -> State
const deselectOption = (id, state) => {
  return {
    ...state,
    selectedOptions: without(id, state.selectedOptions),
    appliedRules: getAppliedRules(state)
  };
};

//    getAppliedRules :: State => [Int]
const getAppliedRules = state =>
  state.selectedOptions.length === 0
    ? []
    : unique(
        state.selectedOptions.reduce(
          (rules, id) => rules.concat(state.options[id].ruleIds),
          []
        )
      );

//    reducer :: (State, Action) -> State
const reducer = (state, action) => {
  console.log("REDUCER CALLED");
  switch (action.type) {
    case "TOGGLE_OPTION":
      return contains(action.id, state.selectedOptions)
        ? deselectOption(action.id, state)
        : selectOption(action.id, state);
  }
};

function Option({
  id,
  price,
  isDefault,
  description,
  ruleIds,
  isSelected,
  onClick
}) {
  return (
    <div onClick={onClick} className={`option ${isSelected ? "selected" : ""}`}>
      {id}: {description}
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, VWGO20ME_5EDTA_6, init);
  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar__options">
          <h3>Selected Options</h3>
          {state.selectedOptions.map(id => (
            <Option key={id} {...state.options[id]} />
          ))}
        </div>
        <div className="sidebar__rules">
          <h3>Applied Rules</h3>
          {state.appliedRules.map(id => (
            <li key={id}>
              {id}: {state.rules[id].type}
            </li>
          ))}
        </div>
      </div>
      <div className="options">
        {Object.keys(state.options).map(id => (
          <Option
            key={id}
            {...state.options[id]}
            isSelected={contains(id, state.selectedOptions)}
            onClick={() => dispatch({ type: "TOGGLE_OPTION", id })}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
