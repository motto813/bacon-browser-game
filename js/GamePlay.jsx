import React, { Component } from "react";
import { Link } from "react-router-dom";
import gameAPI from "../gameAPI";
import GameStart from "./containers/GameStart";
import GamePaths from "./containers/GamePaths";
import PossiblePath from "./components/PossiblePath";
import Traceable from "./components/Traceable";
import Spinner from "./components/Spinner";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../public/style.css");
}

const gameModes = {
  start: "start",
  listPaths: "listPaths",
  pathPending: "pathPending",
  winningPathPresent: "winningPathPresent",
  results: "results"
};

class GamePlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 0,
      mode: gameModes.start,
      startingActor: {},
      endingActor: {},
      currentTraceable: {},
      currentPath: {},
      possiblePaths: [],
      pathsChosen: [],
      degreesCount: 0,
      winner: false
    };

    this.choosePath = this.choosePath.bind(this);
  }

  componentDidMount() {
    let gameURL;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      gameURL = "/create_demo/1245/9273";
    } else {
      gameURL = "/games";
    }
    gameAPI({
      method: "post",
      url: gameURL
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
    if (this.state.mode !== gameModes.listPaths) this.setState({ mode: gameModes.listPaths });

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
        if (response.data.game_is_finished) {
          this.setState(prevState => ({
            mode: gameModes.results,
            pathsChosen: prevState.pathsChosen.concat({
              traceableType: this.state.currentPath.traceable_type,
              traceable: this.state.currentPath.traceable
            }),
            winner: true
          }));
        } else {
          this.setState(prevState => ({
            currentTraceable: response.data.current_traceable,
            possiblePaths: response.data.possible_paths,
            pathsChosen: prevState.pathsChosen.concat({
              traceableType: response.data.current_traceable.traceable_type,
              traceable: response.data.current_traceable.traceable
            }),
            degreesCount: traceableType === "Movie" ? prevState.degreesCount + 1 : prevState.degreesCount
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.state.mode === gameModes.start) {
      return (
        <GameStart
          startingTraceable={{
            type: "Actor",
            id: this.state.startingActor.id,
            name: this.state.startingActor.name,
            imageURL: this.state.startingActor.image_url
          }}
          endingTraceable={{
            id: this.state.endingActor.id,
            name: this.state.endingActor.name,
            imageURL: this.state.endingActor.image_url
          }}
          choosePath={this.choosePath}
        />
      );
    } else if (this.state.mode === gameModes.listPaths) {
      return (
        <GamePaths
          currentTraceable={{
            type: this.state.currentTraceable.traceable_type,
            name: this.state.currentTraceable.traceable.name,
            imageURL: this.state.currentTraceable.traceable.image_url
          }}
          targetTraceable={{
            id: this.state.endingActor.id,
            name: this.state.endingActor.name,
            imageURL: this.state.endingActor.image_url
          }}
          possiblePaths={this.state.possiblePaths}
          choosePath={this.choosePath}
        />
      );
    } else if (this.state.mode === gameModes.results) {
      // *********************************************************
      // Results View
      // *********************************************************
      let startingActor;
      let endingActor;
      let pathsChosen;

      if (this.state.startingActor.id) {
        startingActor = <h3>{this.state.startingActor.name}</h3>;
      } else {
        startingActor = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
      if (this.state.endingActor.id) {
        endingActor = <h3>{this.state.endingActor.name}</h3>;
      } else {
        endingActor = (
          <Traceable isCurrent>
            <Spinner />
          </Traceable>
        );
      }
      if (this.state.pathsChosen.length !== 0) {
        pathsChosen = this.state.pathsChosen.map(path => (
          <Traceable
            key={path.traceable.tmdb_id}
            type={path.traceableType}
            name={path.traceable.name}
            image={path.traceable.image_url}
          />
        ));
      } else {
        pathsChosen = [...Array(this.state.pathsChosen.length)].map((element, index) => (
          <PossiblePath key={index}>
            <Spinner />
          </PossiblePath>
        ));
      }
      const degrees = this.state.winner ? this.state.degreesCount : "?";
      const degreeSymbol = "\u00B0";
      return (
        <div className="results-container">
          <div className="synopsis">
            <div className="given-path starting">{startingActor}</div>
            <div className="degrees-count">
              <h1>{`${degrees}${degreeSymbol}`}</h1>
            </div>
            <div className="given-path ending">{endingActor}</div>
          </div>
          <div className="paths-chosen-container">{pathsChosen}</div>
          <Link to="/">
            <button className="restart-button">New Game</button>
          </Link>
        </div>
      );
    }

    return (
      <div className="game-container">
        <div className="current-path starting">Uh</div>
        <div className="current-path ending">Oh</div>
      </div>
    );
  }
}

export default GamePlay;
