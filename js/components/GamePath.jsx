import React, { Component } from "react";
import PropTypes from "prop-types";

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
      <div className="game-actor" onClick={this.handleClick}>
        <img src={`https://image.tmdb.org/t/p/w185/${this.props.image}`} alt={`${this.props.name}`} height="100" />
      </div>
    );
  }
}

GamePath.propTypes = {
  traceableType: PropTypes.string,
  traceableId: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  clickEvent: PropTypes.func
};

GamePath.defaultProps = {
  traceableType: "Actor",
  traceableId: 0,
  name: "",
  image: "",
  clickEvent: function noop() {}
};

export default GamePath;
