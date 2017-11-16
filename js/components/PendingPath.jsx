import React from "react";
import PropTypes from "prop-types";
import PossiblePath from "./PossiblePath";

const PendingPath = props => (
  <div className="current-traceable pending-path">
    <h4>{props.name}</h4>
    <div className="current-clickables">
      <div className="cancel-path" onClick={props.cancelPath}>
        <button className="clickable-path">Cancel</button>
      </div>
      <PossiblePath
        isCurrent
        traceableType={props.type}
        traceableId={props.id}
        name={props.name}
        image={props.image}
        targetId={props.targetId}
      />
      <div className="confirm-path" onClick={props.confirmPath}>
        <button className="clickable-path">Confirm</button>
      </div>
    </div>
  </div>
);

PendingPath.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  targetId: PropTypes.number,
  cancelPath: PropTypes.func,
  confirmPath: PropTypes.func
};

PendingPath.defaultProps = {
  type: "Actor",
  id: 0,
  name: "",
  image: "",
  targetId: 10000000000,
  cancelPath: function noop() {},
  confirmPath: function noop() {}
};

export default PendingPath;
