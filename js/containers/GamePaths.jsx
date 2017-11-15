import React, { Component } from "react";
import PropTypes from "prop-types";
import PossiblePath from "../components/PossiblePath";
import Traceable from "../components/Traceable";

class GamePaths extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathPending: false,
      currentPath: {}
    };

    this.setCurrentPath = this.setCurrentPath.bind(this);
    this.handleCancelPathClick = this.handleCancelPathClick.bind(this);
    this.handleConfirmPathClick = this.handleConfirmPathClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.possiblePaths !== nextProps.possiblePaths) {
      this.cancelPendingPath();
    }
  }

  setCurrentPath(traceableType, traceableId) {
    this.setState({
      pathPending: true,
      currentPath: this.props.possiblePaths.find(
        path => path.traceable_type === traceableType && path.traceable.id === traceableId
      )
    });
  }

  handleCancelPathClick() {
    this.cancelPendingPath();
  }

  handleConfirmPathClick() {
    this.props.choosePath(this.state.currentPath.traceable_type, this.state.currentPath.traceable.id);
  }

  cancelPendingPath() {
    this.setState({ pathPending: false });
  }

  render() {
    let paths;
    let currentPath;

    if (!this.state.pathPending) {
      paths = this.props.possiblePaths.map((path, index) => {
        if (path.traceable.id) {
          return (
            <PossiblePath
              key={path.traceable.tmdb_id}
              clickEvent={this.setCurrentPath}
              traceableType={path.traceable_type}
              traceableId={path.traceable.id}
              name={path.traceable.name}
              image={path.traceable.image_url}
              targetId={this.props.targetTraceable.id}
            />
          );
        }
        return <PossiblePath key={index} />;
      });
    } else if (this.state.currentPath.traceable) {
      currentPath = (
        <div className="current-path middle">
          <h4>{this.state.currentPath.traceable.name}</h4>
          <div className="current-clickables">
            <div className="cancel-path" onClick={this.handleCancelPathClick}>
              <button>Cancel</button>
            </div>
            <PossiblePath
              isCurrent
              traceableType={this.state.currentPath.traceable_type}
              traceableId={this.state.currentPath.traceable.id}
              name={this.state.currentPath.traceable.name}
              image={this.state.currentPath.traceable.image_url}
              targetId={this.props.targetTraceable.id}
            />
            <div className="confirm-path" onClick={this.handleConfirmPathClick}>
              <button>Confirm</button>
            </div>
          </div>
        </div>
      );
    } else {
      currentPath = <Traceable isCurrent />;
    }

    return (
      <div className="game-container">
        <div className="current-path starting">
          <Traceable
            isCurrent
            name={this.props.currentTraceable.name}
            type={this.props.currentTraceable.type}
            image={this.props.currentTraceable.imageURL}
          />
        </div>
        <div className="paths-container">{paths}</div>
        {currentPath}
        <div className="current-path ending">
          <Traceable isCurrent name={this.props.targetTraceable.name} image={this.props.targetTraceable.imageURL} />
        </div>
      </div>
    );
  }
}

GamePaths.propTypes = {
  currentTraceable: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  targetTraceable: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    imageURL: PropTypes.string
  }),
  possiblePaths: PropTypes.arrayOf(PropTypes.object),
  choosePath: PropTypes.func
};

GamePaths.defaultProps = {
  currentTraceable: {},
  targetTraceable: {},
  possiblePaths: Array(8).map(() => ({
    traceableType: "Actor",
    traceable: {}
  })),
  choosePath: function noop() {}
};

export default GamePaths;
