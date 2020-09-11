import React from "react";
import { Link } from "react-router-dom";

export default function Home({ cars }) {
  return (
    <div style={{ padding: "2em" }}>
      <h1>
        Pick a car, any car<span style={{ opacity: 0.1 }}>d</span>
      </h1>
      <div className="cards">
        {cars.map(capcode => (
          <Link to={`/${capcode}`}>
            <div className="card" key={capcode}>
              <div className="card__title">{capcode}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
