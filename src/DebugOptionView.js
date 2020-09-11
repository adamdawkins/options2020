import React from "react";

export default function DebugOptionView({ option, relatedOptions, dispatch }) {
  return (
    <div>
      <h2>
        <div className="id">{option.id}</div>
        {option.description}
        <p className="summary">£{(option.price / 36).toFixed(2)} p/m</p>
      </h2>
      {option.isSelected ? (
        <button>Remove Option</button>
      ) : (
        <button>Select Option</button>
      )}
      <div style={{ marginTop: "4em" }}>
        <h3>Rules</h3>
        {option.rules.map(rule => (
          <div
            className="card"
            key={rule.id}
            onClick={() => dispatch({ type: "DEBUG.VIEW_RULE", id: rule.id })}
          >
            <div className="card__title">
              {rule.id} ({rule.type})
            </div>
          </div>
        ))}
      </div>

      <h3>Related Options</h3>
      {relatedOptions
        .filter(relatedOption => relatedOption.id !== option.id)
        .map(relatedOption => (
          <div
            className="card"
            key={relatedOption.id}
            onClick={() =>
              dispatch({ type: "DEBUG.VIEW_OPTION", id: relatedOption.id })
            }
          >
            <span className="card__title">
              {relatedOption.id}: {relatedOption.description}
            </span>
          </div>
        ))}
    </div>
  );
}
