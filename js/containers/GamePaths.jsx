import React, { Component } from "react";
import PropTypes from "prop-types";
import PendingPath from "../components/PendingPath";
import PossiblePath from "../components/PossiblePath";
import Traceable from "../components/Traceable";

class GamePlay extends Component {
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

  setCurrentPath(traceable) {
    this.setState({
      pathPending: true,
      currentPath: this.props.possiblePaths.find(path => path.type === traceable.type && path.id === traceable.id)
    });
  }

  handleCancelPathClick() {
    this.setState({ pathPending: false });
  }

  handleConfirmPathClick() {
    this.setState({ pathPending: false });
    this.props.choosePath(this.state.currentPath);
  }

  render() {
    const { pathPending } = this.state;

    let paths;

    if (this.props.possiblePaths.length !== 0) {
      paths = this.props.possiblePaths.map(path => (
        <PossiblePath
          key={path.id}
          type={path.type}
          id={path.id}
          name={path.name}
          image={path.image}
          targetId={this.state.targetId}
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
        image={this.state.currentPath.image}
        targetId={this.props.targetId}
        cancelPath={this.handleCancelPathClick}
        confirmPath={this.handleConfirmPathClick}
      />
    );

    return <div className="paths-container">{pathPending ? currentPath : paths}</div>;
  }
}

GamePlay.propTypes = {
  possiblePaths: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      image: PropTypes.string
    })
  ),
  targetId: PropTypes.number,
  defaultPathCount: PropTypes.number,
  choosePath: PropTypes.func
};

GamePlay.defaultProps = {
  defaultPathCount: 8,
  possiblePaths: [{}],
  targetId: Math.random(),
  choosePath: function noop() {}
};

export default GamePlay;
