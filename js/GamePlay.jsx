import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../gameAPI";
import GameStart from "./containers/GameStart";
import GamePaths from "./containers/GamePaths";
import GameResults from "./containers/GameResults";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../public/style.css");
}

const gameModes = {
  start: "start",
  listPaths: "listPaths",
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
        if (response.data.game_is_finished) {
          this.setState(prevState => ({
            mode: gameModes.results,
            pathsChosen: prevState.pathsChosen.concat({
              traceableType: "Actor",
              traceable: this.state.endingActor
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
          defaultPathCount={this.props.maxPathCount}
          choosePath={this.choosePath}
        />
      );
    } else if (this.state.mode === gameModes.results) {
      return (
        <GameResults
          startingTraceable={{ name: this.state.startingActor.name }}
          endingTraceable={{ name: this.state.endingActor.name }}
          pathsChosen={this.state.pathsChosen}
          winner={this.state.winner}
          degreesCount={this.state.degreesCount}
        />
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

GamePlay.propTypes = {
  maxPathCount: PropTypes.number
};

GamePlay.defaultProps = {
  maxPathCount: 8
};

export default GamePlay;
