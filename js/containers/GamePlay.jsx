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
    this.choosePath(this.props.startingTraceable.type, this.props.startingTraceable.id);
  }

  setCurrentPath(traceableType, traceableId) {
    this.setState({
      pathPending: true,
      currentPath: this.state.possiblePaths.find(path => path.type === traceableType && path.id === traceableId)
    });
  }

  choosePath(traceableType, traceableId) {
    this.props.addPathChosen(
      this.state.currentPath.type,
      this.state.currentPath.name,
      this.state.currentPath.image_url
    );

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
            currentTraceable: Object.assign(
              {},
              { type: response.data.current_traceable.traceable_type },
              response.data.current_traceable.traceable
            ),
            possiblePaths: response.data.possible_paths.map(path =>
              Object.assign({}, { type: path.traceable_type }, path.traceable)
            )
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
    this.choosePath(this.state.currentPath.type, this.state.currentPath.id);
  }

  render() {
    const { pathPending } = this.state;

    let paths;

    if (this.state.possiblePaths.length !== 0) {
      paths = this.state.possiblePaths.map(path => (
        <PossiblePath
          key={path.tmdb_id}
          type={path.type}
          id={path.id}
          name={path.name}
          image={path.image_url}
          targetId={this.state.targetTraceable.id}
          clickEvent={this.setCurrentPath}
        />
      ));
    } else {
      paths = [...Array(this.props.defaultPathCount)].map((element, index) => <Traceable key={index} />);
    }
    const currentPath = (
      <PendingPath
        type={this.state.currentPath.type}
        id={this.state.currentPath.id}
        name={this.state.currentPath.name}
        image={this.state.currentPath.image_url}
        targetId={this.state.targetTraceable.id}
        cancelPath={this.handleCancelPathClick}
        confirmPath={this.handleConfirmPathClick}
      />
    );

    return (
      <div className="game-container">
        <div className="current-traceable starting">
          <Traceable
            isCurrent
            type={this.state.currentTraceable.type}
            name={this.state.currentTraceable.name}
            image={this.state.currentTraceable.image_url}
          />
        </div>
        <div className="paths-container">{pathPending ? currentPath : paths}</div>
        <div className="current-traceable ending">
          <Traceable
            isCurrent
            type={this.state.targetTraceable.type}
            name={this.state.targetTraceable.name}
            image={this.state.targetTraceable.image_url}
          />
        </div>
      </div>
    );
  }
}

GamePlay.propTypes = {
  gameId: PropTypes.number,
  startingTraceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    image_url: PropTypes.string
  }),
  endingTraceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    image_url: PropTypes.string
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
