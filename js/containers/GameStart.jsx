import React from "react";
import PropTypes from "prop-types";
import PossiblePath from "../components/PossiblePath";
import Traceable from "../components/Traceable";
// import Spinner from "../components/Spinner";

const GameStart = props => {
  let startingName;
  let startingImage;
  let endingName;

  if (props.startingActor.id) {
    startingName = <h3>{props.startingActor.name}</h3>;
    startingImage = (
      <PossiblePath
        isCurrent
        clickEvent={props.choosePath}
        traceableType={props.startingActor.type}
        traceableId={props.startingActor.id}
        targetId={props.endingActor.id}
        name={props.startingActor.name}
        image={props.startingActor.imageURL}
      />
    );
  } else {
    startingImage = <Traceable isCurrent />;
  }
  if (props.endingActor.id) {
    endingName = <h3>{props.endingActor.name}</h3>;
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
        <Traceable isCurrent name={props.endingActor.name} image={props.endingActor.imageURL} />
      </div>
    </div>
  );
};

GameStart.propTypes = {
  startingActor: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  endingActor: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  choosePath: PropTypes.func
};

GameStart.defaultProps = {
  startingActor: {},
  endingActor: {},
  choosePath: function noop() {}
};

export default GameStart;
