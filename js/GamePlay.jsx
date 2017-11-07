import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import gameAPI from "../gameAPI";
import PossiblePath from "./components/PossiblePath";
import Traceable from "./components/Traceable";
import Spinner from "./components/Spinner";

require("../public/style.css");

class GamePlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 0,
      startingActor: {},
      endingActor: {},
      gameStarted: false,
      currentTraceable: {},
      possiblePaths: []
    };

    this.choosePath = this.choosePath.bind(this);
  }

  componentDidMount() {
    gameAPI({
      method: "post",
      url: "/games"
    })
      .then(response => {
        this.setState({
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

  choosePath(traceableType, traceableId) {
    if (!this.state.gameStarted) this.setState({ gameStarted: true });

    // IF the traceableType and ID match the endingActor
    //
    // ELSE

    // set the currentTraceable to the startingActor OR matching traceable in possible paths

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
    const pathCount = 8;

    let startingActor;
    let endingActor;
    let currentTraceable;
    let possiblePaths;

    if (!this.state.gameStarted) {
      if (this.state.startingActor.id) {
        // *********************************************************
        // Game Starting View
        // *********************************************************
        startingActor = (
          <PossiblePath
            isCurrent
            choosePath={this.choosePath}
            traceableType="Actor"
            traceableId={this.state.startingActor.id}
            endingId={this.state.endingActor.id}
            name={this.state.startingActor.name}
            image={this.state.startingActor.image_url}
          >
            <div className="starting-info info-text">
              <h2>Starting with</h2>
              <h3>{this.state.currentTraceable.traceable.name}</h3>
            </div>
          </PossiblePath>
        );
      } else {
        startingActor = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
      if (this.state.endingActor.id) {
        endingActor = (
          <Traceable isCurrent name={this.state.endingActor.name} image={this.state.endingActor.image_url}>
            <div className="ending-info info-text">
              <h2>Find a path to</h2>
              <h3>{this.state.endingActor.name}</h3>
            </div>
          </Traceable>
        );
      } else {
        endingActor = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
    } else {
      // *********************************************************
      // Game In Progress View
      // *********************************************************
      if (this.state.currentTraceable.traceable.id) {
        currentTraceable = (
          <Traceable
            isCurrent
            name={this.state.currentTraceable.traceable.name}
            image={this.state.currentTraceable.traceable.image_url}
          />
        );
      } else {
        currentTraceable = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
      if (this.state.endingActor.id) {
        endingActor = (
          <Traceable isCurrent name={this.state.endingActor.name} image={this.state.endingActor.image_url} />
        );
      } else {
        endingActor = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
      if (this.state.possiblePaths.length !== 0) {
        possiblePaths = this.state.possiblePaths.map(path => (
          <PossiblePath
            key={path.traceable.tmdb_id}
            choosePath={this.choosePath}
            traceableType={path.traceable_type}
            traceableId={path.traceable.id}
            endingId={this.state.endingActor.id}
            name={path.traceable.name}
            image={path.traceable.image_url}
          />
        ));
      } else {
        possiblePaths = [...Array(pathCount)].map((element, index) => (
          <PossiblePath key={index}>
            <Spinner />
          </PossiblePath>
        ));
      }
    }

    return (
      <Switch>
        <Route
          exact
          path="/games/:id/paths"
          component={() =>
            this.state.possiblePaths.map(path => <h3 key={path.traceable.tmdb_id}>{path.traceable.name}</h3>)}
        />
        <Route
          path="/games"
          component={() => (
            <div className="game-container">
              <div className="current-path starting">
                {startingActor}
                {currentTraceable}
              </div>
              <div className="paths-container">{possiblePaths}</div>
              <div className="current-path ending">{endingActor}</div>
            </div>
          )}
        />
      </Switch>
    );
  }
}

export default GamePlay;
