import React, { useReducer } from "react";
// import classNames from "classnames";

import "./App.css";

import data from "./data";

import {
  contains,
  decorateCollection,
  prop,
  sortBy,
  unique,
  without
} from "./utils";

import "./App.css";

import {
  addVehicleOptionsToState,
  decorateOption,
  decorateRule,
  getAppliedRuleIds,
  isSelectable,
  isSelected,
  rulesForOption,
  REQUIRES_ALL
  // relatedOptionIds
} from "./helpers";

import { selectOption } from "./actions";

import Basket from "./Basket";
import Option from "./Option";

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

//    deselectOption :: (id, state) -> State
const deselectOption = (id, state) => {
  const selectedOptionIds = without(id, state.selectedOptionIds);
  return {
    ...state,
    selectedOptionIds,
    appliedRuleIds: getAppliedRuleIds(selectedOptionIds, state)
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

  const numberOfOptions = Object.keys(state.options).length;
  const numberOfAvailableOptions = decorateCollection(
    decorateOption(state),
    state.options
  )
    .map(({ ruleIds }) =>
      isSelectable(
        ruleIds
          .filter(id => contains(id, state.appliedRuleIds))
          .map(decorateRule(state))
      )
    )
    .filter(x => x === true).length;

  const numberOfRules = Object.keys(state.rules).length;

  const options = sortBy(
    prop("categoryCode"),
    decorateCollection(decorateOption(state), state.options)
  );

  return (
    <div className="App">
      <div className="main">
        <div className="basket">
          <h1>AUA115CVT5HPTA 2</h1>
          <p className="summary">
            {numberOfAvailableOptions} of {numberOfOptions} options still
            available to select
          </p>
        </div>
        <div className="cards">
          {options.map(option => (
            <Option
              key={option.id}
              {...option}
              dispatch={dispatch}
              appliedRuleIds={state.appliedRuleIds}
            />
          ))}
        </div>
      </div>
      <div className="sidebar">
        <Basket dispatch={dispatch} state={state} />
      </div>
    </div>
  );
}

export default App;
