import React, { useState } from "react";
import './node.css';

const Node = (props) => {
  const {
    nodeKey,
    startNode,
    finishNode,
    wallIds = [],
  } = props;
  const handleStyle = () => {
    let style='';
    if (startNode === nodeKey) {
      style = 'startNode'
    } else if (finishNode === nodeKey) {
      style = 'finishNode'
    } else if (wallIds.some((d) => d == nodeKey)) {
      style = 'wall';
    } else {
      style = '';
    }
    return style;
  };
  return (
    <div data-box={nodeKey} id={nodeKey} key={nodeKey} className={`${handleStyle()} text-center cursor-pointer h-100 w-100`}>
      {startNode === nodeKey && 'S'}
      {finishNode === nodeKey && 'E'}
    </div>
  );
};

export default Node;