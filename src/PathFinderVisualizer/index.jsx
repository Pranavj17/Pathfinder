import React, { useState } from 'react';
import Node from './Node';

const getKey = (i, j) => {
  return `${i}${j}`;
};
const getEdges = (i, j, sizeRow, sizeCol) => {
  const neighbors = [
    // [-1, -1], 
    [-1, 0],
    // [-1, 1], 
    [0, -1], 
    [0, 1], 
    // [1, -1], 
    [1, 0], 
    // [1, 1]
    // [1, 1],
    // [1, 0],
    // [1, -1],
    // [0, -1],
    // [0, 1],
    // [-1, 1],
    // [-1, 0],
    // [-1, -1],
  ];
  const grid = [];
  neighbors.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (newI >= 0 && newI < sizeRow && newJ >= 0 && newJ < sizeCol) {
        grid.push(`${newI}${newJ}`);
      }
  });
  return grid;
}

const findQuadrant = (finishNode, start) => {
  const [x, y] = [finishNode[0], finishNode[1]];
  const [i, j] = [start[0], start[1]];
  let region = '';
  let nodes = [[i, j]];
    if (x > i && y > j) {
      region = "lies in First quadrant";
      nodes = [[1,1], [1, 0], [0, 1]];
    } else if (x < i && y > j) {
      region = "lies in Second quadrant";
      nodes = [[-1, 1], [-1, 0], [0, -1]];
    } else if (x < i && y < j) {
      region = "lies in Third quadrant";
      nodes = [-1, -1, [0, -1], [-1, 0]];
    } else if (x > i && y < j) {
      region = "lies in Fourth quadrant";
      nodes = [[1, -1], [1, 0], [0, -1]];
    } else if (x == i && y > j) {
      region = "lies at positive y axis";
      nodes = [[0, 1]];
    } else if (x == i && y < j) {
      region = "lies at negative y axis";
      nodes = [[0, -1]];
    } else if (y == j && x < i) {
      region = "lies at negative x axis";
      nodes = [[-1, 0]];
    } else if (y == j && x > i) {
      region = "lies at positive x axis";
      nodes = [[1, 0]];
    } else {
      region = "lies at origin";
      nodes = [[0, 0]];
    }
    return [nodes, region];
}
const PathFinderVisualizer = () => {
  const [startNode, setStartNode] = useState('00');
  const [finishNode, setFinishNode] = useState('99');
  const [wall, setWall] = useState(false);
  const [wallIds, setWallIds] = useState([])
  const [cond, setCond] = useState(false);
  const row = 10;
  const col = 10;
  const nodes = [];
  for (let i =0; i< row; i++) {
    nodes[i] = [];
    for (let j=0; j<col; j++) {
      nodes[i].push({
        key: `${i}${j}`
      });
    }
  }
  const adjacentNodes = new Map();
  for (let i=0; i<row; i++) {
    for (let j=0; j< col; j++) {
      const key = getKey(i, j);
      adjacentNodes.set(key, []);
      adjacentNodes.get(key).push(...getEdges(i, j, row, col));
    }
  }
  console.log(adjacentNodes);
  const dfs = (start, visited = new Set()) => {
    visited.add(start);
    const element = document.getElementById(`${start}`);
    if (![startNode, finishNode].includes(start)) {
      element.style.backgroundColor = 'yellow';
    }
    const neighborNodes = adjacentNodes.get(start);
    for (const node of neighborNodes) {
      if (node === finishNode) {
        console.log('found', visited);
        console.log('aaa', adjacentNodes);
        return;
      }
      if (!visited.has(node)) {
        return dfs(node, visited);
      }
    }
  };

  const bfs = () => {
    const queue = [startNode];
    const visited = new Set();
    while(queue.length > 0){
      const name = queue.shift();
      const neighborNodes = adjacentNodes.get(name);
      for (const node of neighborNodes ) {
        if (node === finishNode) {
          console.log('found', visited);
          console.log('aaa', adjacentNodes);
          return;
        }
        if (!visited.has(node)) {
          visited.add(node);
          queue.push(node);
          const element = document.getElementById(`${node}`);
          if (![startNode, finishNode].includes(node)) {
            element.style.backgroundColor = 'yellow';
          }
        }
      }
    }
  };

  // const customMethod = (start, visited, count) => {
  //   const [nodes, region] = findQuadrant(finishNode, start);
  //   let node = '';
  //   for (const [i, j] of nodes) {
  //     const requiredNode = `${+start[0] + i}${+start[1] + j}`;
  //     const neighborNode = adjacentNodes.get(start).find((d) => { return d == requiredNode; });
  //     if (!visited.has(neighborNode)) {
  //       visited.add(neighborNode);
  //       node = neighborNode;
  //       break;
  //     }
  //   }
  //   console.log('node', node);
  //   const element = document.getElementById(`${start}`);
  //   if (![startNode, finishNode].includes(start)) {
  //     element.style.backgroundColor = 'yellow';
  //   }
  //   if (node === finishNode) {
  //     console.log('Found', visited);
  //     return;
  //   }
    
  //   setTimeout(() => {
  //     return customMethod(node, visited, count + 1);
  //   }, count * 15)
  // }

  const findDistance = (current, endNode) => {
    const [x, y] = [current[0], current[1]];
    const [x1, y1] = [endNode[0], endNode[1]];
    const a = x - x1;
    const b = y - y1;
    const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return +c.toFixed(2);
  };
  const customMethod = (start, visited, count) => {
    visited.add(start);
    const neighborNodes = adjacentNodes.get(start);
    const element = document.getElementById(`${start}`);
    if (![startNode, finishNode].includes(start)) {
      element.style.backgroundColor = 'yellow';
    }
    let requiredNodes = [];
    for (const node of neighborNodes) {
      requiredNodes.push({
        key: node,
        distance: findDistance(node, finishNode)
      });
    }
    requiredNodes.sort((a, b) => a.distance - b.distance);
    setTimeout(() => {
      for (const node of requiredNodes) {
        if (node.key === finishNode) {
          console.log('found', visited);
          return;
        }
        if (!visited.has(node.key)) {
          return customMethod(node.key, visited, count + 1);
        }
      }
    }, count * 15);
  }

  return (
    <>
      <input id="toggle" type="checkbox" value="toggle" onChange={() => setWall(true)} />
      <label htmlFor='toggle'>Toggle</label>
      {nodes.map((row, index) => {
        const rowKey = `${row}-${index}`;
        return (
          <div key={rowKey} className='row'>
            {row.map(({ key }) => {
              return (
                <div role="presentation" onClick={() => {
                  if (!wall) {
                    if (!cond) {
                      setStartNode(key);
                    } else {
                      setFinishNode(key);
                    }
                    setCond(!cond);
                  } else {
                    if (wallIds.indexOf(key) === -1) {
                      setWallIds([...(wallIds || []), key]);
                    } else {
                      setWallIds(wallIds.filter(d => d !== key));
                    }
                  }
                }}
                key={key}
                className='box'>
                  <Node
                    key={key}
                    nodeKey={key}
                    startNode={startNode}
                    finishNode={finishNode}
                    wallIds={wallIds || []}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <button type="button" onClick={() => {
        const allElements = document.querySelectorAll('[data-box]');
        [...allElements].forEach((ele) => {
          if (![startNode, finishNode].includes(ele.id)) {
            ele.style = {};
          }
        });
        bfs();
      }}>
        bfs
      </button>
      <button type="button" onClick={() => {
        const allElements = document.querySelectorAll('[data-box]');
        [...allElements].forEach((ele) => {
          if (![startNode, finishNode].includes(ele.id)) {
            ele.style = {};
          }
        });
        dfs(startNode);
      }}>
        dfs
      </button>
      <button type="button" onClick={() => {
        const allElements = document.querySelectorAll('[data-box]');
        [...allElements].forEach((ele) => {
          if (![startNode, finishNode].includes(ele.id)) {
            ele.style = {};
          }
        });
        const visited = new Set([...wallIds]);
        customMethod(startNode, visited, 0)
      }}>
        customMethod
      </button>
    </>
  )
};

export default PathFinderVisualizer;