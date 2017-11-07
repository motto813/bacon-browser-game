import React, { Component } from "react";
import PropTypes from "prop-types";
import Traceable from "./Traceable";

require("../../public/style.css");

class GamePath extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clickEvent(this.props.traceableType, this.props.traceableId);
  }

  render() {
    return (
      <div className="possible-path" onClick={this.handleClick}>
        {this.props.children}
        <Traceable name={this.props.name} image={this.props.image} isCurrent={this.props.isCurrent} />
      </div>
    );
  }
}

GamePath.propTypes = {
  traceableType: PropTypes.string,
  traceableId: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  isCurrent: PropTypes.bool,
  clickEvent: PropTypes.func,
  children: PropTypes.node
};

GamePath.defaultProps = {
  traceableType: "Actor",
  traceableId: 0,
  name: "",
  image: "",
  isCurrent: false,
  clickEvent: function noop() {},
  children: ""
};

export default GamePath;
