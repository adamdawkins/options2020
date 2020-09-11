import React, { useReducer } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import classNames from "classnames";

import data from "./data";
import {
  contains,
  curry,
  decorateCollection,
  path,
  unique,
  without
} from "./utils";
import { relatedOptionIds, decorateOption, decorateRule } from "./helpers";
import debug from "./debug";

import OptionViewer from "./OptionViewer";
import Home from "./Home";

import "./App.css";

const ONE_OF = "OO";
const REQUIRES_ONE = "RO";
const REQUIRES_ALL = "RA";
const NOT_WITH = "NW";
const INCLUDED_IN = "IN";
const INCLUDE_ONE = "IO";

//    init :: [OptionRow] => State
const init = data => {
  const state = {
    options: {},
    rules: {},
    selectedOptions: [],
    appliedRules: [],
    debug: { view: { id: null, type: null } },
    cars: Object.keys(data)
  };

  return state;
};

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
    case "DEBUG.VIEW_RULE":
      return {
        ...state,
        debug: { ...state.debug, view: { type: "rule", id: action.id } }
      };
    case "DEBUG.SELECT_VEHICLE":
      return debug.addVehicleOptionsToState(action.capcode, state);
    default:
      return state;
  }
};

// VIEWS

function App() {
  const [state, dispatch] = useReducer(reducer, data, init);

  console.log(state);

  return (
    <Router>
      <Switch>
        <Route path="/:capcode">
          <OptionViewer state={state} dispatch={dispatch} />
        </Route>
        <Route path="/">
          <Home cars={state.cars} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
