import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../gameAPI";
import GameStart from "./containers/GameStart";
import GamePlay from "./containers/GamePlay";
import GameResults from "./containers/GameResults";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../public/style.css");
}

const gameModes = {
  gameStart: "gameStart",
  gamePlay: "gamePlay",
  gameOver: "gameOver"
};

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 0,
      mode: gameModes.gameStart,
      startingTraceable: {
        traceableType: this.props.startingType,
        traceable: {}
      },
      endingTraceable: {
        traceableType: this.props.startingType,
        traceable: {}
      },
      pathsChosen: [],
      degreesCount: 0,
      winner: false
    };

    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.addPathChosen = this.addPathChosen.bind(this);
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
          startingTraceable: {
            traceableType: "Actor",
            traceable: response.data.starting_actor
          },
          endingTraceable: {
            traceableType: "Actor",
            traceable: response.data.ending_actor
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  startGame() {
    this.setState({
      mode: gameModes.gamePlay // ,
      // startingTraceable: {
      //   traceableType,
      //   traceable:
      //     traceableId === prevState.startingTraceable.traceable.id
      //       ? prevState.startingTraceable.traceable
      //       : prevState.endingTraceable.traceable
      // },
      // endingTraceable: {
      //   traceableType,
      //   traceable:
      //     traceableId !== prevState.startingTraceable.traceable.id
      //       ? prevState.endingTraceable.traceable
      //       : prevState.startingTraceable.traceable
      // }
    });
  }

  addPathChosen(traceableType, traceable) {
    this.setState(prevState => ({
      pathsChosen: prevState.pathsChosen.concat({ traceableType, traceable }),
      degreesCount: traceableType === "Movie" ? prevState.degreesCount + 1 : prevState.degreesCount
    }));
  }

  endGame(details) {
    this.setState({ mode: gameModes.gameOver, winner: details.winner });
  }

  render() {
    if (this.state.mode === gameModes.gameStart) {
      return (
        <GameStart
          startingTraceable={{
            type: this.state.startingTraceable.traceableType,
            id: this.state.startingTraceable.traceable.id,
            name: this.state.startingTraceable.traceable.name,
            imageURL: this.state.startingTraceable.traceable.image_url
          }}
          endingTraceable={{
            type: this.state.endingTraceable.traceableType,
            id: this.state.endingTraceable.traceable.id,
            name: this.state.endingTraceable.traceable.name,
            imageURL: this.state.endingTraceable.traceable.image_url
          }}
          startGame={this.startGame}
        />
      );
    } else if (this.state.mode === gameModes.gamePlay) {
      return (
        <GamePlay
          gameId={this.state.gameId}
          startingTraceable={{
            traceableType: this.state.startingTraceable.traceableType,
            traceable: {
              id: this.state.startingTraceable.traceable.id,
              name: this.state.startingTraceable.traceable.name,
              image_url: this.state.startingTraceable.traceable.image_url
            }
          }}
          endingTraceable={{
            traceableType: this.state.endingTraceable.traceableType,
            traceable: {
              id: this.state.endingTraceable.traceable.id,
              name: this.state.endingTraceable.traceable.name,
              image_url: this.state.endingTraceable.traceable.image_url
            }
          }}
          defaultPathCount={this.props.maxPathCount}
          addPathChosen={this.addPathChosen}
          endGame={this.endGame}
        />
      );
    } else if (this.state.mode === gameModes.gameOver) {
      return (
        <GameResults
          startingTraceable={{ name: this.state.startingTraceable.name }}
          endingTraceable={{ name: this.state.endingTraceable.name }}
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

Game.propTypes = {
  startingType: PropTypes.string,
  maxPathCount: PropTypes.number
};

Game.defaultProps = {
  startingType: "Actor",
  maxPathCount: 8
};

export default Game;
