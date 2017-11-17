import React, { Component } from "react";
import PropTypes from "prop-types";
import Traceable from "./Traceable";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

class PossiblePath extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.pathEvent(this.props.traceable);
  }

  render() {
    let pathClass;

    if (this.props.traceable.type === "Actor" && this.props.traceable.id === this.props.targetId) {
      pathClass = "possible-path winning-path";
    } else {
      pathClass = "possible-path";
    }

    return (
      <div className={pathClass} onClick={this.handleClick}>
        <Traceable
          isCurrent={this.props.isCurrent}
          type={this.props.traceable.type}
          name={this.props.traceable.name}
          image={this.props.traceable.image}
        />
      </div>
    );
  }
}

PossiblePath.propTypes = {
  isCurrent: PropTypes.bool,
  traceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string
  }),
  targetId: PropTypes.number,
  pathEvent: PropTypes.func
};

PossiblePath.defaultProps = {
  isCurrent: false,
  traceable: {
    type: "default",
    id: Math.random(),
    name: "",
    image: ""
  },
  targetId: Math.random(),
  pathEvent: function noop() {}
};

export default PossiblePath;
