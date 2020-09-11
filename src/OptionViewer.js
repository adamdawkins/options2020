import React from "react";
import { Link, useParams } from "react-router-dom";

import { decorateCollection } from "./utils";
import { decorateOption } from "./helpers";
import debug from "./debug";

import DebugSidebar from "./DebugSidebar";
import Option from "./Option";

export default function OptionViewer({ state, dispatch }) {
  const { capcode } = useParams();
  dispatch({ type: "DEBUG.SELECT_VEHICLE", capcode });
  const numberOfOptions = Object.keys(state.options).length;
  const numberOfRules = Object.keys(state.rules).length;
  return (
    <div className="App">
      <div className="main">
        <div className="basket">
          <h1>
            <Link to="/">Cars</Link> > {capcode}
          </h1>
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
                debug={{
                  isRelated: debug.isRelated(option.id, state),
                  isViewed: debug.isViewed(option.id, state),
                  view: state.debug.view
                }}
              />
            )
          )}
        </div>
      </div>
      <div className="sidebar">
        <DebugSidebar state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
