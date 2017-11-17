import React, { Component } from "react";
import PropTypes from "prop-types";
import PendingPath from "./PendingPath";
import PossiblePath from "./PossiblePath";
import Traceable from "./Traceable";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

class PathSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPaths: true,
      pathPending: false,
      pendingPath: {}
    };

    this.setPendingPath = this.setPendingPath.bind(this);
    this.handleCancelPathClick = this.handleCancelPathClick.bind(this);
    this.handleConfirmPathClick = this.handleConfirmPathClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.possiblePaths !== this.props.possiblePaths) {
      this.setState({ loadingPaths: false });
    }
  }

  setPendingPath(traceable) {
    this.setState({
      pathPending: true,
      pendingPath: this.props.possiblePaths.find(path => path.type === traceable.type && path.id === traceable.id)
    });
  }

  handleCancelPathClick() {
    this.setState({ pathPending: false });
  }

  handleConfirmPathClick() {
    this.setState({ loadingPaths: true, pathPending: false });
    this.props.choosePath(this.state.pendingPath);
  }

  render() {
    const { pathPending } = this.state;

    let paths;

    if (this.state.loadingPaths) {
      paths = [...Array(this.props.defaultPathCount)].map((element, index) => <Traceable key={index} />);
    } else {
      paths = this.props.possiblePaths.map(path => (
        <PossiblePath key={path.id} traceable={path} targetId={this.props.targetId} pathEvent={this.setPendingPath} />
      ));
    }

    const pendingPath = (
      <PendingPath
        traceable={this.state.pendingPath}
        targetId={this.props.targetId}
        cancelPath={this.handleCancelPathClick}
        confirmPath={this.handleConfirmPathClick}
      />
    );

    return <div className="paths-container">{pathPending ? pendingPath : paths}</div>;
  }
}

PathSelection.propTypes = {
  possiblePaths: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      image: PropTypes.string
    })
  ),
  defaultPathCount: PropTypes.number,
  targetId: PropTypes.number,
  choosePath: PropTypes.func
};

PathSelection.defaultProps = {
  possiblePaths: [
    {
      type: "default",
      id: Math.random(),
      name: "",
      image: ""
    }
  ],
  defaultPathCount: 8,
  targetId: Math.random(),
  choosePath: function noop() {}
};

export default PathSelection;
