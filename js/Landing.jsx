import React from "react";
import { Link } from "react-router-dom";

const Landing = () => (
  <div className="landing-container">
    <h1 className="front-title">Cold Bacon</h1>
    <Link to="/games">
      <button className="start-button">Start</button>
    </Link>
  </div>
);

export default Landing;
