import React, { Component } from "react";
import gameAPI from "../gameAPI";
import GamePath from "./components/GamePath";
import Traceable from "./components/Traceable";
import Spinner from "./components/Spinner";

require("../public/style.css");

class GameStart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      // gameLoaded: false,
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
          // gameLoaded: true,
          loading: false,
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
    if (!this.state.gameStarted) this.setState({ loading: true, gameStarted: true });
    else this.setState({ loading: true });

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
        this.setState({
          loading: false,
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
    let startingActor;
    let endingInfo;
    let endingActor;
    let currentTraceable;
    let gamePlay;

    if (!this.state.gameStarted) {
      if (this.state.loading) {
        startingActor = (
          <div className="traceable-large">
            <Spinner />
          </div>
        );
        endingActor = (
          <div className="traceable-large">
            <Spinner />
          </div>
        );
      } else {
        // *********************************************************
        // Game Starting View
        // *********************************************************
        startingInfo = (
          <div className="starting-info info-text">
            <h2>Starting with</h2>
            <h3>{this.state.currentTraceable.traceable.name}</h3>
          </div>
        );
        startingActor = (
          <GamePath
            isCurrent
            clickEvent={this.createPath}
            traceableType="Actor"
            traceableId={this.state.startingActor.id}
            name={this.state.startingActor.name}
            image={this.state.startingActor.image_url}
          />
        );
        endingInfo = (
          <div className="ending-info info-text">
            <h2>Find a path to</h2>
            <h3>{this.state.endingActor.name}</h3>
          </div>
        );
        endingActor = (
          <Traceable isCurrent name={this.state.endingActor.name} image={this.state.endingActor.image_url} />
        );
      }
    } else if (this.state.loading) {
      const pathCount = 8;

      currentTraceable = (
        <div className="traceable-large">
          <Spinner />
        </div>
      );
      endingActor = (
        <div className="traceable-large">
          <Spinner />
        </div>
      );
      gamePlay = (
        <div id="paths-container">
          {[...Array(pathCount)].map((element, index) => (
            <div className="possible-path traceable-small" key={index}>
              <Spinner />
            </div>
          ))}
        </div>
      );
    } else {
      // *********************************************************
      // Game In Progress View
      // *********************************************************
      currentTraceable = (
        <Traceable
          isCurrent
          name={this.state.currentTraceable.traceable.name}
          image={this.state.currentTraceable.traceable.image_url}
        />
      );
      endingActor = <Traceable isCurrent name={this.state.endingActor.name} image={this.state.endingActor.image_url} />;
      gamePlay = (
        <div id="paths-container">
          {this.state.possiblePaths.map(path => (
            <div className="possible-path" key={path.traceable.tmdb_id}>
              <GamePath
                clickEvent={this.createPath}
                traceableType={path.traceable_type}
                traceableId={path.traceable.id}
                name={path.traceable.name}
                image={path.traceable.image_url}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="game-container">
        <div className="current-path starting">
          {startingActor}
          {startingInfo}
          {currentTraceable}
        </div>
        {gamePlay}
        <div className="current-path ending">
          {endingInfo}
          {endingActor}
        </div>
      </div>
    );
  }
}

export default GameStart;
