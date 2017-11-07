import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GamePath from "./components/GamePath";
import Traceable from "./components/Traceable";

require("../public/style.css");

const PossiblePaths = props => {
  const paths = props.possiblePaths.map(path => {
    let currentPath;

    if (path.traceable_type === "Actor" && path.traceable.id === props.endingActorId) {
      currentPath = (
        <div className="possible-path winning-path" key={path.traceable.tmdb_id}>
          <Link to={`/games/${props.gameId}/paths`}>
            <Traceable name={path.traceable.name} image={path.traceable.image_url} />
          </Link>
        </div>
      );
    } else {
      currentPath = (
        <GamePath
          key={path.traceable.tmdb_id}
          clickEvent={props.createPath}
          traceableType={path.traceable_type}
          traceableId={path.traceable.id}
          name={path.traceable.name}
          image={path.traceable.image_url}
        />
      );
    }
    return currentPath;
  });

  return <div id="paths-container">{paths}</div>;
};

PossiblePaths.propTypes = {
  createPath: PropTypes.func,
  possiblePaths: PropTypes.arrayOf(PropTypes.object),
  gameId: PropTypes.number,
  endingActorId: PropTypes.number
};

PossiblePaths.defaultProps = {
  createPath: function noop() {},
  possiblePaths: [],
  gameId: 0,
  endingActorId: 0
};

export default PossiblePaths;
