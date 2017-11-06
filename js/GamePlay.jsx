import React, { Component } from "react";
import gameAPI from "../gameAPI";
import GamePath from "./components/GamePath";

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
        console.log();
        this.setState({
          gameLoaded: true,
          gameId: response.data.game_id,
          startingActor: response.data.starting_actor,
          endingActor: response.data.ending_actor,
          currentTraceable: {
            traceable_type: "Actor",
            traceable: response.data.starting_actor
          }
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
    let startingInfo;
    let endingInfo;
    let currentTraceable;
    let endingActor;
    let gamePlay;

    if (this.state.gameLoaded) {
      currentTraceable = (
        <div className="starting-actor">
          <GamePath
            clickEvent={this.createPath}
            traceableType={this.state.currentTraceable.traceable_type}
            traceableId={this.state.currentTraceable.traceable.id}
            name={this.state.currentTraceable.traceable.name}
            image={this.state.currentTraceable.traceable.image_url}
          />
        </div>
      );
      endingActor = (
        <div className="ending-actor">
          <GamePath name={this.state.endingActor.name} image={this.state.endingActor.image_url} />
        </div>
      );
      if (!this.state.gameStarted) {
        startingInfo = (
          <div className="starting-info">
            <h3>Starting with</h3>
            <h4>{this.state.currentTraceable.traceable.name}</h4>
          </div>
        );
        endingInfo = (
          <div className="ending-info">
            <h3>Find a path to</h3>
            <h4>{this.state.endingActor.name}</h4>
          </div>
        );
      } else {
        gamePlay = (
          <table id="possible-paths">
            <tbody>
              <tr>
                {this.state.possiblePaths.map(path => (
                  <td key={path.traceable.tmdb_id}>
                    <GamePath
                      clickEvent={this.createPath}
                      traceableType={path.traceable_type}
                      traceableId={path.traceable.id}
                      name={path.traceable.name}
                      image={path.traceable.image_url}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }
    } else {
      currentTraceable = <p>Loading...</p>;
      endingActor = <p>Loading...</p>;
    }

    console.log(this.state.currentTraceable);
    console.log(this.state.startingActor);

    return (
      <div className="game-container">
        {startingInfo}
        {currentTraceable}
        {gamePlay}
        {endingInfo}
        {endingActor}
      </div>
    );
  }
}

export default GameStart;
