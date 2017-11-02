import React, { Component } from "react";
import gameAPI from "../gameAPI";

class GameStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiData: {}
    };
  }

  componentDidMount() {
    gameAPI({
      method: "post",
      url: "/games"
    })
      .then(response => {
        console.log(response.data);
        this.setState({ apiData: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let startingActor;
    let endingActor;

    if (this.state.apiData.starting_actor) {
      startingActor = <p>{this.state.apiData.starting_actor.name}</p>;
    } else {
      startingActor = <p>Loading...</p>;
    }

    if (this.state.apiData.ending_actor) {
      endingActor = <p>{this.state.apiData.ending_actor.name}</p>;
    } else {
      endingActor = <p>Loading...</p>;
    }

    return (
      <div className="game-start">
        <h1>Game Start Page</h1>
        <h3>Starting with</h3>
        {startingActor}
        <h3>Find a path to</h3>
        {endingActor}
      </div>
    );
  }
}

export default GameStart;
