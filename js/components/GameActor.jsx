import React from "react";
import PropTypes from "prop-types";

const GameActor = props => (
  <div className="game-actor" onClick={props.clickHandler}>
    <h3>{props.name}</h3>
    <img src={`https://image.tmdb.org/t/p/w185/${props.image}`} alt={`${props.name}`} height="100" />
  </div>
);

GameActor.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  clickHandler: PropTypes.func
};

GameActor.defaultProps = {
  name: "",
  image: "",
  clickHandler: function noop() {}
};

export default GameActor;