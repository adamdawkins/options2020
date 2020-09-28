import React from "react";
import classNames from "classnames";

import { contains } from "./utils";

export default function Option({
  id,
  price,
  isDefault,
  description,
  isSelected,
  appliedRuleIds,
  rules,
  dispatch
}) {
  return (
    <div
      className={classNames("card", {
        selected: isSelected
      })}
    >
      <div className="card__labels">
        {rules.map(rule => (
          <span
            key={rule.id}
            className={classNames("card-label", {
              selected: contains(rule.id, appliedRuleIds)
            })}
            title={rule.id}
          >
            {rule.type}
          </span>
        ))}
      </div>
      <span className="card__title">
        {id}: {description}
      </span>
      <div className="card__actions">
        <button
          className="button primary"
          onClick={() => dispatch({ type: "BASKET.ADD_OPTION", id })}
        >
          Add
        </button>
      </div>
    </div>
  );
}
