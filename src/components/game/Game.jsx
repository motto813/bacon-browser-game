import React, { Component } from "react";
import PropTypes from "prop-types";
import gameAPI from "../../gameAPI";
import PathSelection from "./PathSelection";
import GameResults from "./GameResults";
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
    this.handleFirstPathClick = this.handleFirstPathClick.bind(this);
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
      currentTraceable: {},
      targetTraceable: {},
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

  handleFirstPathClick() {
    this.choosePath(this.state.currentTraceable);
  }

  render() {
    const startingInfo = (
      <div className="starting-info info-text">
        <h2>Starting with</h2>
        <h4>{this.state.currentTraceable.name}</h4>
      </div>
    );
    const playFirstPath = (
      <div className="play-first-path" onClick={this.state.currentTraceable.name ? this.handleFirstPathClick : null}>
        <button>
          {this.state.currentTraceable.name
            ? `Look in ${this.state.currentTraceable.name.substring(
                0,
                this.state.currentTraceable.name.indexOf(" ")
              )}'s Movies`
            : "Loading..."}
        </button>
      </div>
    );
    const endingInfo = (
      <div className="starting-info info-text">
        <h2>Find a path to</h2>
        <h4>{this.state.targetTraceable.name}</h4>
      </div>
    );
    const movieHints = this.state.movieHints
      .slice(0, 2)
      .map(movie => <Traceable key={movie.id} type={movie.type} name={movie.name} image={movie.image} />);
    const showHints = (
      <div
        className="modify-game how-to-play"
        onClick={this.state.currentTraceable.name ? this.toggleMovieHints : null}
      >
        <button>Hint</button>
      </div>
    );
    const swapPlayers = (
      <div
        className="modify-game new-players"
        onClick={this.state.currentTraceable.name ? this.swapCurrentTraceables : null}
      >
        <button>Swap</button>
      </div>
    );
    const endGame = (
      <div className="modify-game end-game" onClick={this.endGame}>
        <button>Give Up</button>
      </div>
    );

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
          <Traceable
            isCurrent
            type={this.state.currentTraceable.type}
            name={this.state.currentTraceable.name}
            image={this.state.currentTraceable.image}
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
        ) : (
          playFirstPath
        )}
        <div className="current-traceable ending">
          {!this.state.initialPathChosen ? endingInfo : null}
          <Traceable
            isCurrent
            type={this.state.targetTraceable.type}
            name={this.state.targetTraceable.name}
            image={this.state.targetTraceable.image}
          />
        </div>
        <div className="movie-hints-container">{this.state.showMovieHints ? movieHints : null}</div>
        {showHints}
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
