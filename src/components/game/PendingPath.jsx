import React from "react";
import PropTypes from "prop-types";
import PossiblePath from "./PossiblePath";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../../public/style.css");
}

const PendingPath = props => (
  <div className="current-traceable pending-path">
    <h4>{props.traceable.name}</h4>
    <div className="pending-container">
      <div className="clickable-path" onClick={props.cancelPath}>
        <button>Cancel</button>
      </div>
      <PossiblePath isCurrent traceable={props.traceable} targetId={props.targetId} />
      <div className="clickable-path" onClick={props.confirmPath}>
        <button>Confirm</button>
      </div>
    </div>
  </div>
);

PendingPath.propTypes = {
  traceable: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string
  }),
  targetId: PropTypes.number,
  cancelPath: PropTypes.func,
  confirmPath: PropTypes.func
};

PendingPath.defaultProps = {
  traceable: {
    type: "default",
    id: Math.random(),
    name: "",
    image: ""
  },
  targetId: Math.random(),
  cancelPath: function noop() {},
  confirmPath: function noop() {}
};

export default PendingPath;
