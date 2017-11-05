import React, { Component } from "react";
import PropTypes from "prop-types";

class GameActor extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.clickEvent("Actor", this.props.actorId);
  }

  render() {
    return (
      <div className="game-actor" onClick={this.handleClick}>
        <img src={`https://image.tmdb.org/t/p/w185/${this.props.image}`} alt={`${this.props.name}`} height="100" />
      </div>
    );
  }
}

GameActor.propTypes = {
  actorId: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  clickEvent: PropTypes.func
};

GameActor.defaultProps = {
  actorId: 0,
  name: "",
  image: "",
  clickEvent: function noop() {}
};

export default GameActor;
