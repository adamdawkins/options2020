import React from "react";
import classNames from "classnames";

export default function Option({
  id,
  price,
  isDefault,
  description,
  isSelected,
  rules,
  debug,
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
            className={classNames("card-label", { selected: false })}
            title={rule.id}
            onClick={event => {
              event.stopPropagation();
              dispatch({ type: "DEBUG.VIEW_RULE", id: rule.id });
            }}
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
