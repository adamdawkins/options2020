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

import { removeOption, selectOption } from "./actions";

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

//    reducer :: (State, Action) -> State
const reducer = (state, action) => {
  switch (action.type) {
    case "BASKET.ADD_OPTION":
      return selectOption(action.id, state);
    case "BASKET.REMOVE_OPTION":
      return removeOption(action.id, state);
    default:
      return state;
  }
};

// VIEWS

function App() {
  const [state, dispatch] = useReducer(reducer, data, init);
  console.log({ state });

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

  const rules = decorateCollection(decorateRule(state), state.rules);

  const options = sortBy(
    prop("categoryCode"),
    decorateCollection(decorateOption(state), state.options)
  );

  return (
    <div className="App">
      <div className="main">
        <div className="basket">
          <h1>AUA115CVT5HPTA 3</h1>
          <p className="summary">
            {numberOfAvailableOptions} of {numberOfOptions} options still
            available to select
          </p>
        </div>
        <h1>Exterior</h1>
        <div className="cards">
          {options
            .filter(({ categoryCode }) =>
              contains(categoryCode, [44, 45, 58, 74, 75, 88])
            )
            .map(option => (
              <Option
                key={option.id}
                {...option}
                dispatch={dispatch}
                appliedRuleIds={state.appliedRuleIds}
                state={state}
              />
            ))}
        </div>
        <hr style={{ margin: "20px 0" }} />
        <h1>Interior</h1>
        <div className="cards">
          {options
            .filter(({ categoryCode }) =>
              contains(categoryCode, [49, 61, 81, 82, 84])
            )
            .map(option => (
              <Option
                key={option.id}
                {...option}
                dispatch={dispatch}
                appliedRuleIds={state.appliedRuleIds}
                state={state}
              />
            ))}
        </div>
        <hr style={{ margin: "20px 0" }} />
        <h1>Packs</h1>
        <div className="cards">
          {options
            .filter(({ categoryCode }) => contains(categoryCode, [34]))
            .map(option => (
              <Option
                key={option.id}
                {...option}
                dispatch={dispatch}
                appliedRuleIds={state.appliedRuleIds}
                state={state}
              />
            ))}
        </div>
        <hr style={{ margin: "20px 0" }} />
        <h1>Extras</h1>
        <div className="cards">
          {options
            .filter(
              ({ categoryCode }) =>
                !contains(categoryCode, [
                  34,
                  44,
                  45,
                  58,
                  74,
                  75,
                  49,
                  61,
                  81,
                  82,
                  84,
                  88
                ])
            )
            .map(option => (
              <Option
                key={option.id}
                {...option}
                dispatch={dispatch}
                appliedRuleIds={state.appliedRuleIds}
                state={state}
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
