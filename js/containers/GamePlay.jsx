import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../../gameAPI";
import PendingPath from "../components/PendingPath";
import PossiblePath from "../components/PossiblePath";
import Traceable from "../components/Traceable";

class GamePlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathPending: false,
      currentTraceable: this.props.startingTraceable,
      targetTraceable: this.props.endingTraceable,
      possiblePaths: [],
      currentPath: this.props.startingTraceable
    };

    this.choosePath = this.choosePath.bind(this);
    this.setCurrentPath = this.setCurrentPath.bind(this);
    this.handleCancelPathClick = this.handleCancelPathClick.bind(this);
    this.handleConfirmPathClick = this.handleConfirmPathClick.bind(this);
  }

  componentDidMount() {
    this.choosePath(this.props.startingTraceable.traceableType, this.props.startingTraceable.traceable.id);
  }

  setCurrentPath(traceableType, traceableId) {
    this.setState({
      pathPending: true,
      currentPath: this.state.possiblePaths.find(
        path => path.traceableType === traceableType && path.traceable.id === traceableId
      )
    });
  }

  choosePath(traceableType, traceableId) {
    this.props.addPathChosen(this.state.currentPath.traceableType, this.state.currentPath.traceable);

    gameAPI({
      method: "post",
      url: `/games/${this.props.gameId}/paths`,
      data: {
        path: {
          traceable_type: traceableType,
          traceable_id: traceableId
        }
      }
    })
      .then(response => {
        console.log(response.data);
        if (response.data.game_is_finished) {
          this.props.endGame({ winner: true });
        } else {
          this.setState({
            pathPending: false,
            currentTraceable: {
              traceableType: response.data.current_traceable.traceable_type,
              traceable: response.data.current_traceable.traceable
            },
            possiblePaths: response.data.possible_paths.map(path => ({
              traceableType: path.traceable_type,
              traceable: path.traceable
            }))
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleCancelPathClick() {
    this.setState({ pathPending: false });
  }

  handleConfirmPathClick() {
    this.choosePath(this.state.currentPath.traceableType, this.state.currentPath.traceable.id);
  }

  render() {
    const { pathPending } = this.state;

    let paths;
    let currentPath;

    if (this.state.possiblePaths.length !== 0) {
      paths = this.state.possiblePaths.map(path => (
        <PossiblePath
          key={path.traceable.tmdb_id}
          clickEvent={this.setCurrentPath}
          traceableType={path.traceableType}
          traceableId={path.traceable.id}
          name={path.traceable.name}
          image={path.traceable.image_url}
          targetId={this.state.targetTraceable.traceable.id}
        />
      ));
    } else {
      paths = [...Array(this.props.defaultPathCount)].map((element, index) => <Traceable key={index} />);
    }
    if (this.state.currentPath.traceable) {
      currentPath = (
        <PendingPath
          type={this.state.currentPath.traceableType}
          id={this.state.currentPath.traceable.id}
          name={this.state.currentPath.traceable.name}
          image={this.state.currentPath.traceable.image_url}
          targetId={this.state.targetTraceable.traceable.id}
          cancelPath={this.handleCancelPathClick}
          confirmPath={this.handleConfirmPathClick}
        />
      );
    } else {
      currentPath = <Traceable isCurrent />;
    }

    return (
      <div className="game-container">
        <div className="current-path starting">
          <Traceable
            isCurrent
            type={this.state.currentTraceable.traceableType}
            name={this.state.currentTraceable.traceable.name}
            image={this.state.currentTraceable.traceable.image_url}
          />
        </div>
        <div className="paths-container">{pathPending ? currentPath : paths}</div>
        <div className="current-path ending">
          <Traceable
            isCurrent
            type={this.state.targetTraceable.traceableType}
            name={this.state.targetTraceable.traceable.name}
            image={this.state.targetTraceable.traceable.image_url}
          />
        </div>
      </div>
    );
  }
}

GamePlay.propTypes = {
  gameId: PropTypes.number,
  startingTraceable: PropTypes.shape({
    traceableType: PropTypes.string,
    traceable: PropTypes.object
  }),
  endingTraceable: PropTypes.shape({
    traceableType: PropTypes.string,
    traceable: PropTypes.object
  }),
  defaultPathCount: PropTypes.number,
  addPathChosen: PropTypes.func,
  endGame: PropTypes.func
};

GamePlay.defaultProps = {
  gameId: 0,
  startingTraceable: {},
  endingTraceable: {},
  defaultPathCount: 8,
  addPathChosen: function noop() {},
  endGame: function noop() {}
};

export default GamePlay;
