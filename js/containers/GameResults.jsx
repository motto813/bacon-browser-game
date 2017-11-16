import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Traceable from "../components/Traceable";

const GameResults = props => {
  const degrees = props.winner ? props.degreesCount : "?";
  const degreeSymbol = "\u00B0";

  const paths = props.pathsChosen.map(path => (
    <Traceable
      key={path.traceable.tmdb_id}
      type={path.traceableType}
      name={path.traceable.name}
      image={path.traceable.image_url}
    />
  ));

  return (
    <div className="results-container">
      <div className="synopsis">
        <div className="given-path starting">{props.startingTraceable.name}</div>
        <div className="degrees-count">
          <h1>{`${degrees}${degreeSymbol}`}</h1>
        </div>
        <div className="given-path ending">{props.endingTraceable.name}</div>
      </div>
      <div className="paths-chosen-container">{paths}</div>
      <Link to="/">
        <button className="restart-button">New Game</button>
      </Link>
    </div>
  );
};

GameResults.propTypes = {
  startingTraceable: PropTypes.shape({
    name: PropTypes.string
  }),
  endingTraceable: PropTypes.shape({
    name: PropTypes.string
  }),
  pathsChosen: PropTypes.arrayOf(PropTypes.object),
  winner: PropTypes.bool,
  degreesCount: PropTypes.number
};

GameResults.defaultProps = {
  startingTraceable: {},
  endingTraceable: {},
  pathsChosen: [
    {
      traceableType: "Actor",
      traceable: {}
    }
  ],
  winner: false,
  degreesCount: 0
};

export default GameResults;
