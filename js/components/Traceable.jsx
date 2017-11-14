import React from "react";
import PropTypes from "prop-types";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../public/style.css");
}

const Traceable = props => {
  let image;
  let imageSize;

  if (props.image) image = <img src={`https://image.tmdb.org/t/p/w185/${props.image}`} alt={`${props.name}`} />;

  if (props.isCurrent) imageSize = "large";
  else imageSize = "small";

  return (
    <div className={`traceable traceable-${imageSize} traceable-${props.type.toLowerCase()}`}>
      {props.children}
      {image}
    </div>
  );
};

Traceable.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  isCurrent: PropTypes.bool,
  children: PropTypes.node
};

Traceable.defaultProps = {
  name: "",
  type: "Actor",
  image: "",
  isCurrent: false,
  children: ""
};

export default Traceable;
