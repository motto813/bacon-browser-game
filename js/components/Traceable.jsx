import React from "react";
import PropTypes from "prop-types";

require("../../public/style.css");

const Traceable = props => {
  let imageSize;

  if (props.isCurrent) imageSize = "large";
  else imageSize = "small";

  return (
    <div className={`traceable traceable-${imageSize} traceable-${props.type.toLowerCase()}`}>
      <img src={`https://image.tmdb.org/t/p/w185/${props.image}`} alt={`${props.name}`} />
    </div>
  );
};

Traceable.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
  isCurrent: PropTypes.bool
};

Traceable.defaultProps = {
  name: "",
  type: "Actor",
  image: "",
  isCurrent: false
};

export default Traceable;
