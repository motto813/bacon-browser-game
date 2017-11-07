import React, { Component } from "react";
import PropTypes from "prop-types";
import Traceable from "./Traceable";

require("../../public/style.css");

class PossiblePath extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.choosePath(this.props.traceableType, this.props.traceableId);
  }

  render() {
    let pathClass;

    if (this.props.traceableType === "Actor" && this.props.traceableId === this.props.endingId) {
      pathClass = "possible-path winning-path";
    } else {
      pathClass = "possible-path";
    }

    return (
      <div className={pathClass} onClick={this.handleClick}>
        <Traceable name={this.props.name} image={this.props.image} isCurrent={this.props.isCurrent}>
          {this.props.children}
        </Traceable>
      </div>
    );
  }
}

PossiblePath.propTypes = {
  traceableType: PropTypes.string,
  traceableId: PropTypes.number,
  endingId: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  isCurrent: PropTypes.bool,
  choosePath: PropTypes.func,
  children: PropTypes.node
};

PossiblePath.defaultProps = {
  traceableType: "Actor",
  traceableId: 0,
  endingId: 0,
  name: "",
  image: "",
  isCurrent: false,
  choosePath: function noop() {},
  children: ""
};

export default PossiblePath;