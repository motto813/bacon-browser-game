import React, { Component } from "react";
import gameAPI from "../gameAPI";
import GameActor from "./components/GameActor";

class GameStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameLoaded: false,
      gameId: 0,
      startingActor: {},
      endingActor: {},
      gameStarted: false
    };

    this.handleStartGameClick = this.handleStartGameClick.bind(this);
  }

  componentDidMount() {
    gameAPI({
      method: "post",
      url: "/games"
    })
      .then(response => {
        this.setState({
          gameLoaded: true,
          gameId: response.data.game_id,
          startingActor: response.data.starting_actor,
          endingActor: response.data.ending_actor
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleStartGameClick() {
    this.setState({ gameStarted: true });
    gameAPI({
      method: "post",
      url: `/games/${this.state.gameId}/paths`,
      data: {
        path: {
          traceable_type: "Actor",
          traceable_id: this.state.startingActor.id
        }
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let startingActor;
    let endingActor;

    if (this.state.gameLoaded) {
      startingActor = (
        <GameActor
          clickHandler={this.handleStartGameClick}
          name={this.state.startingActor.name}
          image={this.state.startingActor.image_url}
        />
      );
    } else {
      startingActor = <p>Loading...</p>;
    }

    if (this.state.gameLoaded) {
      endingActor = <GameActor name={this.state.endingActor.name} image={this.state.endingActor.image_url} />;
    } else {
      endingActor = <p>Loading...</p>;
    }

    console.log(this.state.gameStarted);

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
