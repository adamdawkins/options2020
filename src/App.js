import React, { useReducer } from "react";
import classNames from "classnames";
import { VWGO20ME_5EDTA_6 } from "./data";
import "./App.css";

// UTILS

// Function utils
const curry = fn => {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

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

// passes each key in the object to a custom function to return the collection
//    decorateCollection :: (fn, {key: object}) -> [object]
const decorateCollection = (fn, object) => Object.keys(object).map(fn);

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

const relationshipTypes = {
  OO: {
    name: "One Of",
    description: "From the marked options, a maximum of one may be selected"
  },
  RO: {
    name: "Requires One Of",
    description:
      "If the primary option is chosen, it must be accompanied by at least one of the non-primary options in that rule"
  },
  RA: {
    name: "Requires All",
    description:
      "If the primary option is chosen, it is accompanied by all the non-primary options in that rule"
  },
  NW: {
    name: "Not With",
    description:
      "If the primary option is chosen, none of the other marked options may be chosen."
  },
  IN: {
    name: "Included In",
    description:
      "The marked options are included in the price of the primary option, which is a pack."
  },
  IO: {
    name: "Include One Of",
    description:
      "If the primary option is chosen, it must be accompanied by one of the non-primary options. The selected non-primary option will be included at 0 cost."
  }
};

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

// GETTERS
//    rulesForOption :: (id, state) -> [Rule]
const rulesForOption = (id, state) =>
  state.options[id].ruleIds.map(id => state.rules[id]);

//    optionsForRule :: (id, state) -> [Option]
const optionsForRule = (id, state) =>
  state.rules[id].optionIds.map(id => state.options[id]);

// fills out the option with rules
//    decorateOption :: State -> Int -> Option
const decorateOption = curry((state, id) => ({
  ...state.options[id],
  rules: rulesForOption(id, state)
}));

// fills out the rule with options
//    decorateRule :: State -> Int -> Option
const decorateRule = curry((state, id) => ({
  ...state.rules[id],
  options: optionsForRule(id, state)
}));

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
    case "DEBUG.VIEW_RULE":
      return {
        ...state,
        debug: { ...state.debug, view: { type: "rule", id: action.id } }
      };
    default:
      return state;
  }
};

// DEBUGGING HELPERS
const debug = {
  isRelated: (id, state) => {
    const viewedType = path(["debug", "view", "type"], state);
    const viewedId = path(["debug", "view", "id"], state);

    if (viewedType !== "option") {
      return false;
    }

    return contains(id, relatedOptionIds(viewedId, state));
  },
  isViewed: (id, state) => {
    const viewedType = path(["debug", "view", "type"], state);
    const viewedId = path(["debug", "view", "id"], state);

    return viewedType === "option" && viewedId === id;
  }
};

// VIEWS
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

export const DebugRuleView = ({ rule, dispatch }) => {
  const relationshipType = relationshipTypes[rule.type];
  return (
    <div>
      <h2>
        {rule.id}: {relationshipType.name}
      </h2>
      <p>{relationshipType.description}</p>
      <div>
        <h3>Options</h3>
        <ul>
          {rule.options.map(option => (
            <li key={option.id}>
              <a
                href="#"
                onClick={() =>
                  dispatch({ type: "DEBUG.VIEW_OPTION", id: option.id })
                }
              >
                {option.id}: {option.description}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const DebugOptionView = ({ option, relatedOptions, dispatch }) => {
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
              <a
                href="#"
                onClick={() =>
                  dispatch({ type: "DEBUG.VIEW_RULE", id: rule.id })
                }
              >
                {rule.id} ({rule.type})
              </a>
            </li>
          ))}
        </ul>
      </div>

      <h3>Related Options</h3>
      <ul>
        {relatedOptions.map(option => (
          <li key={option.key}>
            <a
              href="#"
              onClick={() =>
                dispatch({ type: "DEBUG.VIEW_OPTION", id: option.id })
              }
            >
              {option.id}: {option.description}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

function DebugSidebar({ state, dispatch }) {
  const debugView = path(["debug", "view"], state);

  if (!debugView) return null;

  if (debugView.type === "option") {
    return (
      <DebugOptionView
        option={decorateOption(state, state.debug.view.id)}
        relatedOptions={relatedOptionIds(state.debug.view.id, state).map(
          decorateOption(state)
        )}
        dispatch={dispatch}
      />
    );
  }
  if (debugView.type === "rule") {
    return (
      <DebugRuleView
        rule={decorateRule(state, state.debug.view.id)}
        dispatch={dispatch}
      />
    );
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, VWGO20ME_5EDTA_6, init);
  console.log(state);
  return (
    <div className="App">
      <div className="options">
        {decorateCollection(decorateOption(state), state.options).map(
          option => (
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
          )
        )}
      </div>
      <div className="sidebar">
        <DebugSidebar state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

export default App;
