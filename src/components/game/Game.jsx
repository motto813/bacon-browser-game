import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gameAPI from "../../gameAPI";
import PathSelection from "./PathSelection";
import GameResults from "./GameResults";
import PossiblePath from "./PossiblePath";
import formatTraceable from "../../helpers/GameHelper";
import Traceable from "./Traceable";

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
      startingTmdbId: this.props.startingTmdbId,
      endingTmdbId: this.props.endingTmdbId,
      showMovieHints: false,
      movieHints: [],
      pathsChosen: [],
      degreesCount: 0,
      gameOver: false,
      winner: false
    };

    this.newGame = this.newGame.bind(this);
    this.choosePath = this.choosePath.bind(this);
    this.endGame = this.endGame.bind(this);
    this.swapCurrentTraceables = this.swapCurrentTraceables.bind(this);
    this.toggleMovieHints = this.toggleMovieHints.bind(this);
  }

  componentDidMount() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      this.createDemoGame(this.props.startingTmdbId, this.props.endingTmdbId);
    } else {
      this.createGame();
    }
  }

  getMovieHints(actorId) {
    gameAPI
      .get(`/actors/${actorId}/known_for_movies`)
      .then(response => {
        this.setState({
          movieHints: response.data.map(movie => formatTraceable("Movie", movie))
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setNewGameState() {
    this.setState({
      initialPathChosen: false,
      showMovieHints: false,
      movieHints: [],
      pathsChosen: [],
      degreesCount: 0,
      gameOver: false,
      winner: false
    });
  }

  setGameStartingInfo(gameData) {
    this.setState({
      gameId: gameData.game_id,
      currentTraceable: formatTraceable(this.props.startingType, gameData.starting_actor),
      targetTraceable: formatTraceable(this.props.startingType, gameData.ending_actor),
      startingTmdbId: gameData.starting_actor.tmdb_id,
      endingTmdbId: gameData.ending_actor.tmdb_id
    });
  }

  setPossiblePaths(possiblePaths) {
    this.setState({ possiblePaths });
  }

  newGame() {
    this.setNewGameState();
    this.createGame();
  }

  newDemoGame(startingTmdbId, endingTmdbId) {
    this.setNewGameState();
    this.createDemoGame(startingTmdbId, endingTmdbId);
  }

  createGame() {
    gameAPI({
      method: "post",
      url: "/games"
    })
      .then(response => {
        this.setGameStartingInfo(response.data);
        this.getMovieHints(response.data.ending_actor.id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  createDemoGame(startingTmdbId, endingTmdbId) {
    gameAPI({
      method: "post",
      url: `/create_demo/${startingTmdbId}/${endingTmdbId}`
    })
      .then(response => {
        this.setGameStartingInfo(response.data);
        this.getMovieHints(response.data.ending_actor.id);
      })
      .catch(error => {
        console.log(error);
      });
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
  }

  swapCurrentTraceables() {
    this.setState(prevState => ({
      currentTraceable: prevState.targetTraceable,
      targetTraceable: prevState.currentTraceable,
      startingTmdbId: prevState.endingTmdbId,
      endingTmdbId: prevState.startingTmdbId
    }));
    this.newDemoGame(this.state.endingTmdbId, this.state.startingTmdbId);
  }

  toggleMovieHints() {
    this.setState(prevState => ({
      showMovieHints: !prevState.showMovieHints
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
    const swapPlayers = (
      <div className="modify-game new-players" onClick={this.swapCurrentTraceables}>
        <button>Swap Starters</button>
      </div>
    );
    const endGame = (
      <div className="modify-game end-game" onClick={this.endGame}>
        <button>Give Up</button>
      </div>
    );
    const movieHints = this.state.movieHints
      .slice(0, 2)
      .map(movie => <Traceable type={movie.type} name={movie.name} image={movie.image} />);

    if (this.state.gameOver) {
      return (
        <GameResults
          pathsChosen={this.state.pathsChosen}
          targetTraceable={this.state.targetTraceable}
          winner={this.state.winner}
          degreesCount={this.state.degreesCount}
          newGame={this.newGame}
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
            currentType={this.state.currentTraceable.type}
            possiblePaths={this.state.possiblePaths}
            defaultPathCount={this.props.maxPathCount}
            targetId={this.state.targetTraceable.id}
            choosePath={this.choosePath}
          />
        ) : null}
        <div className="current-traceable ending">
          {!this.state.initialPathChosen ? endingInfo : null}
          <PossiblePath isCurrent traceable={this.state.targetTraceable} pathEvent={this.toggleMovieHints} />
        </div>
        <div className="movie-hints-container">{this.state.showMovieHints ? movieHints : null}</div>
        <div className="modify-game how-to-play">
          <Link to="/">
            <button>Quit</button>
          </Link>
        </div>
        {!this.state.initialPathChosen ? swapPlayers : endGame}
      </div>
    );
  }
}

Game.propTypes = {
  startingType: PropTypes.string,
  startingTmdbId: PropTypes.number,
  endingTmdbId: PropTypes.number,
  maxPathCount: PropTypes.number
};

Game.defaultProps = {
  startingType: "Actor",
  // tmdbId 1245 = Scarlett Johannson
  startingTmdbId: 1245,
  // tmdbId 9273 = Amy Adams
  endingTmdbId: 9273,
  maxPathCount: 8
};

export default Game;
