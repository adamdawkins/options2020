import React, { useReducer } from "react";
import classNames from "classnames";
import { VWGO20ME_5EDTA_6 } from "./data";
import "./App.css";

// UTILS

// List Utils

//    contains :: (x, [x]) -> Boolean
const contains = (item, list) => list.indexOf(item) > -1;

//    unique :: [x] -> [x]
const unique = list => [...new Set(list)];

//    without :: (x, [x]) -> [x]
const without = (item, list) => list.filter(x => x !== item);

// Object Utils

//    collection :: {key: object} -> [object]
const collection = obj => Object.keys(obj).map(key => obj[key]);

//    safely return the property at a nested object path
//    e.g. path(["a", "b", "c"], { a: { b: { c: "foo" } } }) => "foo"
//    path :: ([String], object]) -> Any?
const path = (props, object) => {
  let currentProp = object;
  let index = 0;

  for (; index < props.length; ) {
    if (currentProp == null) {
      return;
    }

    currentProp = currentProp[props[index]];
    index += 1;
  }

  return currentProp;
};

// DATA HANDLERS & SETUP

//    init :: [OptionRow] => State
const init = data => {
  const state = {
    options: {},
    rules: {},
    selectedOptions: [],
    appliedRules: [],
    debug: {}
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

// DEBUGGING HELPERS
const debug = {
  isRelated: (id, state) =>
    state.debug.view &&
    contains(id, relatedOptionIds(state.debug.view.id, state)),
  isViewed: (id, state) => path(["debug", "view", "id"], state) === id
};

// GETTERS
//    rulesForOption :: (id, state) -> [Rule]
const rulesForOption = (id, state) =>
  state.options[id].ruleIds.map(id => state.rules[id]);

//    optionsForRule :: (id, state) -> [Option]
const optionsForRule = (id, state) =>
  state.rules[id].optionIds.map(id => state.options[id]);

// fills out the option with rules: [Rule]
//    buildOption :: (id, state) -> Option
const buildOption = (id, state) => ({
  ...state.options[id],
  rules: rulesForOption(id, state)
});

//    relatedOptionIds :: (id, state) -> [Int]
const relatedOptionIds = (id, state) =>
  unique(
    rulesForOption(id, state)
      .map(({ optionIds }) => optionIds)
      .flat()
  );

// ACTIONS

//    selectOption :: (id, state) -> State
const selectOption = (id, state) => {
  const selectedOptions = state.selectedOptions.concat([id]);
  return {
    ...state,
    selectedOptions,
    appliedRules: getAppliedRules(selectedOptions, state)
  };
};

//    deselectOption :: (id, state) -> State
const deselectOption = (id, state) => {
  const selectedOptions = without(id, state.selectedOptions);
  return {
    ...state,
    selectedOptions,
    appliedRules: getAppliedRules(selectedOptions, state)
  };
};

//    getAppliedRules :: ([Int], State) => [Int]
const getAppliedRules = (selectedOptions, state) =>
  selectedOptions.length === 0
    ? []
    : unique(
        selectedOptions.reduce(
          (rules, id) => rules.concat(state.options[id].ruleIds),
          []
        )
      );

//    reducer :: (State, Action) -> State
const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_OPTION":
      return contains(action.id, state.selectedOptions)
        ? deselectOption(action.id, state)
        : selectOption(action.id, state);
    case "DEBUG.VIEW_OPTION":
      return {
        ...state,
        debug: { ...state.debug, view: { type: "option", id: action.id } }
      };
  }
};

function Option({
  id,
  price,
  isDefault,
  description,
  ruleIds,
  isSelected,
  onClick,
  debug
}) {
  return (
    <div
      onClick={onClick}
      className={classNames("option", {
        selected: isSelected,
        viewed: debug.isViewed,
        related: debug.isRelated
      })}
    >
      {id}: {description}
    </div>
  );
}

export const DebugView = ({ option }) => {
  return (
    <div>
      <h2>
        {option.id}: {option.description}
      </h2>
      <div>
        <h3>Rules</h3>
        <ul>
          {option.rules.map(rule => (
            <li key={rule.id}>
              {rule.id} ({rule.type})
            </li>
          ))}
        </ul>
      </div>

      <h3>Related Options</h3>
    </div>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, VWGO20ME_5EDTA_6, init);
  console.log(state);
  return (
    <div className="App">
      <div className="options">
        {collection(state.options).map(option => (
          <Option
            key={option.id}
            onClick={() =>
              dispatch({ type: "DEBUG.VIEW_OPTION", id: option.id })
            }
            {...option}
            debug={{
              isRelated: debug.isRelated(option.id, state),
              isViewed: debug.isViewed(option.id, state)
            }}
          />
        ))}
      </div>
      <div className="sidebar">
        {state.debug.view && (
          <DebugView option={buildOption(state.debug.view.id, state)} />
        )}
      </div>
    </div>
  );
}

export default App;
