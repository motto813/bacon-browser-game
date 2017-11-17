import React from "react";
import { Link } from "react-router-dom";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../public/style.css");
}

const Landing = () => (
  <div className="landing-container">
    <h1 className="front-title">Cold Bacon</h1>
    <Link to="/game">
      <button className="start-button">Start</button>
    </Link>
  </div>
);

export default Landing;
