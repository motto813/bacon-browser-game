import React, { Component } from "react";
import gameAPI from "../gameAPI";
import GameActor from "./components/GameActor";

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
      startingActor = (
        <GameActor name={this.state.apiData.starting_actor.name} image={this.state.apiData.starting_actor.image_url} />
      );
    } else {
      startingActor = <p>Loading...</p>;
    }

    if (this.state.apiData.ending_actor) {
      endingActor = (
        <GameActor name={this.state.apiData.ending_actor.name} image={this.state.apiData.ending_actor.image_url} />
      );
    } else {
      endingActor = <p>Loading...</p>;
    }

    return (
      <div className="game-start">
        <div className="starting-actor">
          <h3>Starting with</h3>
          {startingActor}
        </div>
        <div className="ending-actor">
          <h3>Find a path to</h3>
          {endingActor}
        </div>
      </div>
    );
  }
}

export default GameStart;
