import React from "react";
import PropTypes from "prop-types";
import PossiblePath from "../components/PossiblePath";
import Traceable from "../components/Traceable";

const GameStart = props => {
  let startingName;
  let startingImage;
  let endingName;

  if (props.startingTraceable.id) {
    startingName = <h3>{props.startingTraceable.name}</h3>;
    startingImage = (
      <PossiblePath
        isCurrent
        clickEvent={props.startGame}
        traceableType={props.startingTraceable.type}
        traceableId={props.startingTraceable.id}
        targetId={props.endingTraceable.id}
        name={props.startingTraceable.name}
        image={props.startingTraceable.imageURL}
      />
    );
  } else {
    startingImage = <Traceable isCurrent />;
  }
  if (props.endingTraceable.id) {
    endingName = <h3>{props.endingTraceable.name}</h3>;
  }

  return (
    <div className="game-container">
      <div className="current-path starting">
        <div className="starting-info info-text">
          <h2>Starting with</h2>
          {startingName}
        </div>
        {startingImage}
      </div>
      <div className="current-path ending">
        <div className="ending-info info-text">
          <h2>Find a path to</h2>
          {endingName}
        </div>
        <Traceable isCurrent name={props.endingTraceable.name} image={props.endingTraceable.imageURL} />
      </div>
    </div>
  );
};

GameStart.propTypes = {
  startingTraceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  endingTraceable: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  startGame: PropTypes.func
};

GameStart.defaultProps = {
  startingTraceable: {},
  endingTraceable: {},
  startGame: function noop() {}
};

export default GameStart;
