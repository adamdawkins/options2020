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
        selected: isSelected,
        viewed: debug.isViewed,
        related: debug.isRelated
      })}
    >
      <div className="card__labels">
        {rules.map(rule => (
          <span
            key={rule.id}
            className={classNames("card-label", {
              selected: debug.view.id === rule.id
            })}
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
        {isSelected ? (
          <button
            className="warning"
            onClick={() => dispatch({ type: "BASKET.REMOVE_OPTION", id })}
          >
            Remove Option
          </button>
        ) : (
          <button
            className="primary"
            onClick={() => dispatch({ type: "BASKET.ADD_OPTION", id })}
          >
            Add Option
          </button>
        )}
        <button
          className="view-button"
          onClick={() => dispatch({ type: "DEBUG.VIEW_OPTION", id })}
        >
          View
        </button>
      </div>
    </div>
  );
}
