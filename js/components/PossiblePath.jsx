import React, { Component } from "react";
import PropTypes from "prop-types";
import Traceable from "./Traceable";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../public/style.css");
}

class PossiblePath extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clickEvent(this.props.type, this.props.id);
  }

  render() {
    let pathClass;

    if (this.props.type === "Actor" && this.props.id === this.props.targetId) {
      pathClass = "possible-path winning-path";
    } else {
      pathClass = "possible-path";
    }

    return (
      <div className={pathClass} onClick={this.handleClick}>
        <Traceable
          isCurrent={this.props.isCurrent}
          type={this.props.type}
          name={this.props.name}
          image={this.props.image}
        >
          {this.props.children}
        </Traceable>
      </div>
    );
  }
}

PossiblePath.propTypes = {
  isCurrent: PropTypes.bool,
  type: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  targetId: PropTypes.number,
  clickEvent: PropTypes.func,
  children: PropTypes.node
};

PossiblePath.defaultProps = {
  isCurrent: false,
  type: "Actor",
  id: 0,
  name: "",
  image: "",
  targetId: 0,
  clickEvent: function noop() {},
  children: ""
};

export default PossiblePath;
