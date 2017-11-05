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
      gameStarted: false,
      currentTraceable: {},
      possiblePaths: []
    };

    this.createPath = this.createPath.bind(this);
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

  createPath(traceableType, traceableId) {
    if (!this.state.gameStarted) this.setState({ gameStarted: true });
    gameAPI({
      method: "post",
      url: `/games/${this.state.gameId}/paths`,
      data: {
        path: {
          traceable_type: traceableType,
          traceable_id: traceableId
        }
      }
    })
      .then(response => {
        console.log(response.data);
        this.setState({
          currentTraceable: response.data.current_traceable,
          possiblePaths: response.data.possible_paths
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let startingActor;
    let endingActor;
    let gamePlay;

    if (this.state.gameLoaded) {
      startingActor = (
        <div className="starting-actor">
          <h3>Starting with</h3>
          <GameActor
            clickEvent={this.createPath}
            actorId={this.state.startingActor.id}
            name={this.state.startingActor.name}
            image={this.state.startingActor.image_url}
          />
        </div>
      );
      endingActor = (
        <div className="ending-actor">
          <h3>Find a path to</h3>
          <GameActor name={this.state.endingActor.name} image={this.state.endingActor.image_url} />
        </div>
      );
    } else {
      startingActor = <p>Loading...</p>;
      endingActor = <p>Loading...</p>;
    }

    if (this.state.gameStarted) {
      gamePlay = (
        <ul>{this.state.possiblePaths.map(path => <li key={path.traceable.tmdb_id}>{path.traceable.name}</li>)}</ul>
      );
    }

    console.log(this.state.currentTraceable);

    return (
      <div className="game-container">
        {startingActor}
        {gamePlay}
        {endingActor}
      </div>
    );
  }
}

export default GameStart;
