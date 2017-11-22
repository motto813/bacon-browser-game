import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../../gameAPI";
import PathSelection from "./PathSelection";
import GameResults from "./GameResults";
import PossiblePath from "./PossiblePath";
import formatTraceable from "../../helpers/GameHelper";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 0,
      initialPathChosen: false,
      currentTraceable: {},
      targetTraceable: {},
      pathsChosen: [],
      degreesCount: 0,
      gameOver: false,
      winner: false
    };

    this.choosePath = this.choosePath.bind(this);
    this.endGame = this.endGame.bind(this);
    // this.swapCurrentTraceables = this.swapCurrentTraceables.bind(this);
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
          currentTraceable: formatTraceable(this.props.startingType, response.data.starting_actor),
          targetTraceable: formatTraceable(this.props.startingType, response.data.ending_actor)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setPossiblePaths(possiblePaths) {
    this.setState({ possiblePaths });
  }

  choosePath(traceable) {
    this.setState(prevState => ({
      initialPathChosen: true,
      currentTraceable: traceable,
      pathsChosen: prevState.pathsChosen.concat(traceable),
      degreesCount: traceable.type === "Movie" ? prevState.degreesCount + 1 : prevState.degreesCount
    }));
    this.attemptPath(traceable);
  }

  attemptPath(traceable) {
    gameAPI({
      method: "post",
      url: `/games/${this.state.gameId}/paths`,
      data: {
        path: {
          traceable_type: traceable.type,
          traceable_id: traceable.id
        }
      }
    })
      .then(response => {
        if (response.data.game_is_finished) {
          this.setState({ winner: true });
          this.endGame();
        } else {
          this.setPossiblePaths(
            response.data.possible_paths.map(path => formatTraceable(path.traceable_type, path.traceable))
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  endGame() {
    this.setState({ gameOver: true });
    if (!this.state.winner) {
      this.setState(prevState => ({
        pathsChosen: prevState.pathsChosen.concat(prevState.targetTraceable)
      }));
      // IF the last path chosen isn't a Movie, THEN add a question mark Movie before the target traceable
    }
  }

  // swapCurrentTraceables() {
  //   this.setState(prevState => ({
  //     currentTraceable: prevState.targetTraceable,
  //     targetTraceable: prevState.currentTraceable
  //   }));
  // }

  render() {
    const startingInfo = (
      <div className="starting-info info-text">
        <h2>Starting with</h2>
        <h3>{this.state.currentTraceable.name}</h3>
      </div>
    );
    const endingInfo = (
      <div className="starting-info info-text">
        <h2>Find a path to</h2>
        <h3>{this.state.targetTraceable.name}</h3>
      </div>
    );
    const newPlayers = (
      <div className="new-players modify-game" onClick={this.newPlayers}>
        <button>New Players</button>
      </div>
    );
    const endGame = (
      <div className="end-game modify-game" onClick={this.endGame}>
        <button>Give Up</button>
      </div>
    );

    if (this.state.gameOver) {
      return (
        <GameResults
          pathsChosen={this.state.pathsChosen}
          winner={this.state.winner}
          degreesCount={this.state.degreesCount}
        />
      );
    }

    return (
      <div className="game-container">
        <div className="current-traceable starting">
          {!this.state.initialPathChosen ? startingInfo : null}
          <PossiblePath
            isCurrent
            traceable={this.state.currentTraceable}
            pathEvent={!this.state.initialPathChosen ? this.choosePath : undefined}
          />
        </div>
        {this.state.initialPathChosen ? (
          <PathSelection
            possiblePaths={this.state.possiblePaths}
            defaultPathCount={this.props.maxPathCount}
            targetId={this.state.targetTraceable.id}
            choosePath={this.choosePath}
          />
        ) : null}
        <div className="current-traceable ending">
          {!this.state.initialPathChosen ? endingInfo : null}
          <PossiblePath isCurrent traceable={this.state.targetTraceable} />
        </div>
        <div className="modify-game how-to-play">
          <button>How to Play</button>
        </div>
        {!this.state.initialPathChosen ? newPlayers : endGame}
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
