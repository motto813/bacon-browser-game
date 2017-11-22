import React from "react";
import PropTypes from "prop-types";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

const Traceable = props => {
  const imageSize = props.isCurrent ? "large" : "small";

  const portraitPlaceholder = "/public/img/portrait-placeholder.png";
  const genericPoster = "/public/img/generic-poster.jpg";

  let image;

  if (props.image) image = <img src={`https://image.tmdb.org/t/p/w185/${props.image}`} alt={`${props.name}`} />;
  else
    image = (
      <img
        className={props.name === "loading" ? "loading-traceable" : null}
        src={props.type !== "Movie" ? portraitPlaceholder : genericPoster}
        alt={`${props.type}-placeholder`}
      />
    );

  return <div className={`traceable traceable-${imageSize} traceable-${props.type.toLowerCase()}`}>{image}</div>;
};

Traceable.propTypes = {
  isCurrent: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string
};

Traceable.defaultProps = {
  isCurrent: false,
  type: "default",
  name: "loading",
  image: ""
};

export default Traceable;
