import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div className="start-page">
    <h1>Cold Bacon</h1>
    <h3>
      <Link to="/games">Start Game</Link>
    </h3>
  </div>
);

export default Landing;
