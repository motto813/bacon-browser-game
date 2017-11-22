import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Traceable from "./Traceable";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

const GameResults = props => {
  const degrees = props.winner ? props.degreesCount : "?";
  const degreeSymbol = "\u00B0";

  const paths = props.pathsChosen.map((path, index) => (
    <Traceable key={index} type={path.type} name={path.name} image={path.image} />
  ));

  if (!props.winner) {
    const targetTraceable = (
      <Traceable
        key={Math.random()}
        type={props.targetTraceable.type}
        name={props.targetTraceable.name}
        image={props.targetTraceable.image}
      />
    );
    if (props.pathsChosen.slice(-1)[0].type === "Actor") {
      paths.push(<Traceable key={Math.random()} type="Movie" name="unknown" />);
    } else {
      paths.push(<Traceable key={Math.random()} type="Actor" name="unknown" />);
      paths.push(<Traceable key={Math.random()} type="Movie" name="unknown" />);
    }
    paths.push(targetTraceable);
  }

  return (
    <div className="results-container">
      <div className="synopsis">
        <div className="degrees-count">
          <h1>{`${degrees}${degreeSymbol}`}</h1>
        </div>
      </div>
      <div className="paths-chosen-container">{paths}</div>
      <Link to="/">
        <button className="restart-button">New Game</button>
      </Link>
    </div>
  );
};

GameResults.propTypes = {
  pathsChosen: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      name: PropTypes.string,
      image: PropTypes.string
    })
  ),
  targetTraceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string
  }),
  winner: PropTypes.bool,
  degreesCount: PropTypes.number
};

GameResults.defaultProps = {
  pathsChosen: [
    {
      type: "default",
      name: "",
      image: ""
    }
  ],
  targetTraceable: {
    type: "default",
    id: Math.random(),
    name: "",
    image: ""
  },
  winner: false,
  degreesCount: 0
};

export default GameResults;
