import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../gameAPI";
import GamePaths from "./containers/GamePaths";
import GameResults from "./containers/GameResults";
import PossiblePath from "./components/PossiblePath";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../public/style.css");
}

const formatTraceable = (type, traceable) =>
  Object.assign(
    {},
    {
      type,
      id: traceable.id,
      name: traceable.name,
      image: traceable.image_url
    }
  );

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: 0,
      gameStarted: false,
      currentTraceable: {},
      targetTraceable: {},
      possiblePaths: [],
      pathsChosen: [],
      degreesCount: 0,
      gameOver: false,
      winner: false
    };

    this.choosePath = this.choosePath.bind(this);
    this.swapCurrentTraceables = this.swapCurrentTraceables.bind(this);
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

  choosePath(traceable) {
    this.setState(prevState => ({
      gameStarted: true,
      currentTraceable: traceable,
      pathsChosen: prevState.pathsChosen.concat(traceable),
      degreesCount: traceable.type === "Movie" ? prevState.degreesCount + 1 : prevState.degreesCount
    }));
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
          this.endGame(true);
        } else {
          this.addPossiblePaths(
            response.data.possible_paths.map(path => formatTraceable(path.traceable_type, path.traceable))
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  endGame(asWinner) {
    this.setState({ gameOver: true, winner: asWinner });
  }

  addPossiblePaths(possiblePaths) {
    this.setState({ possiblePaths });
  }

  swapCurrentTraceables() {
    this.setState(prevState => ({
      currentTraceable: prevState.targetTraceable,
      targetTraceable: prevState.currentTraceable
    }));
  }

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
    const currentTraceable = (
      <PossiblePath
        isCurrent
        type={this.state.currentTraceable.type}
        id={this.state.currentTraceable.id}
        name={this.state.currentTraceable.name}
        image={this.state.currentTraceable.image}
        clickEvent={!this.state.gameStarted ? this.choosePath : undefined}
      />
    );
    const targetTraceable = (
      <PossiblePath
        isCurrent
        type={this.state.targetTraceable.type}
        id={this.state.targetTraceable.id}
        name={this.state.targetTraceable.name}
        image={this.state.targetTraceable.image}
        clickEvent={this.swapCurrentTraceables}
      />
    );
    const gamePaths = (
      <GamePaths
        possiblePaths={this.state.possiblePaths}
        targetId={this.state.targetTraceable.id}
        defaultPathCount={this.props.maxPathCount}
        choosePath={this.choosePath}
      />
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
          {!this.state.gameStarted ? startingInfo : null}
          {currentTraceable}
        </div>
        {this.state.gameStarted ? gamePaths : null}
        <div className="current-traceable ending">
          {!this.state.gameStarted ? endingInfo : null}
          {targetTraceable}
        </div>
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
