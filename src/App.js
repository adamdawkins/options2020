import React, { useReducer } from "react";
// import classNames from "classnames";

import "./App.css";

import data from "./data";

import {
  // contains,
  // curry,
  decorateCollection,
  // path,
  unique,
  without
} from "./utils";

import "./App.css";

import {
  addVehicleOptionsToState,
  decorateOption,
  getAppliedRuleIds
  // decorateRule,
  // relatedOptionIds
} from "./helpers";

import Basket from "./Basket";
import Option from "./Option";

// const ONE_OF = "OO";
// const REQUIRES_ONE = "RO";
// const REQUIRES_ALL = "RA";
// const NOT_WITH = "NW";
// const INCLUDED_IN = "IN";
// const INCLUDE_ONE = "IO";

//    init :: [OptionRow] => State
const init = data => {
  const state = {
    options: {},
    rules: {},
    selectedOptionIds: [],
    appliedRuleIds: []
  };

  return addVehicleOptionsToState(data, state);
};

// ACTIONS

//    selectOption :: (id, state) -> State
const selectOption = (id, state) => {
  const selectedOptionIds = state.selectedOptionIds.concat([id]);
  return {
    ...state,
    selectedOptionIds,
    appliedRuleIds: getAppliedRuleIds(selectedOptionIds, state)
  };
};

//    deselectOption :: (id, state) -> State
const deselectOption = (id, state) => {
  const selectedOptions = without(id, state.selectedOptions);
  return {
    ...state,
    selectedOptions,
    appliedRuleIds: getAppliedRuleIds(selectedOptions, state)
  };
};

//    reducer :: (State, Action) -> State
const reducer = (state, action) => {
  switch (action.type) {
    case "BASKET.ADD_OPTION":
      return selectOption(action.id, state);
    case "BASKET.REMOVE_OPTION":
      return deselectOption(action.id, state);
    default:
      return state;
  }
};

// VIEWS

function App() {
  const [state, dispatch] = useReducer(reducer, data, init);

  console.log(state);

  const numberOfOptions = Object.keys(state.options).length;
  const numberOfRules = Object.keys(state.rules).length;

  return (
    <div className="App">
      <div className="main">
        <div className="basket">
          <h1>AUA115CVT5HPTA 2</h1>
          <p className="summary">
            {numberOfOptions} options, {numberOfRules} rules (Complexity:{" "}
            {Math.round(
              (numberOfOptions / numberOfRules) *
                (numberOfOptions + numberOfRules)
            )}
            )
          </p>
        </div>
        <div className="cards">
          {decorateCollection(decorateOption(state), state.options).map(
            option => (
              <Option
                key={option.id}
                {...option}
                dispatch={dispatch}
                appliedRuleIds={state.appliedRuleIds}
              />
            )
          )}
        </div>
      </div>
      <div className="sidebar">
        <Basket dispatch={dispatch} state={state} />
      </div>
    </div>
  );
}

export default App;
