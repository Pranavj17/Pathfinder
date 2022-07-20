import React, { useRef, useState } from 'react';
import Node from './Node';

const getKey = (i, j) => {
  return `${i},${j}`;
};
const getEdges = (i, j, sizeRow, sizeCol) => {
  const neighbors = [
    // [-1, -1], 
    // [-1, 0],
    // [-1, 1], 
    // [0, -1], 
    // [0, 1], 
    // [1, -1], 
    // [1, 0], 
    // [1, 1]
    // [1, 1],
    // [1, 0],
    // [1, -1],
    // [0, -1],
    // [0, 1],
    // [-1, 1],
    // [-1, 0],
    // [-1, -1],
    [1,0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];
  const grid = [];
  neighbors.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (newI >= 0 && newI < sizeRow && newJ >= 0 && newJ < sizeCol) {
        grid.push(`${newI},${newJ}`);
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
  const [startNode, setStartNode] = useState('0,0');
  const [finishNode, setFinishNode] = useState('24,24');
  const [wall, setWall] = useState(false);
  const [wallIds, setWallIds] = useState([]);
  // ["1,2","2,1","3,3","4,3","5,1","7,2","7,4","5,5","3,5","2,5","2,7","5,7","1,4","1,5","0,6","4,4"]
  const [cond, setCond] = useState(false);
  const row = 25;
  const col = 25;
  const nodes = [];
  for (let i =0; i< row; i++) {
    nodes[i] = [];
    for (let j=0; j<col; j++) {
      nodes[i].push({
        key: `${i},${j}`
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

  const findDistance = (current, endNode) => {
    const [x, y] = current.split(',');
    const [x1, y1] = endNode.split(',');
    const a = Number(x1) - Number(x);
    const b = Number(y1) - Number(y);
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
      console.log([...visited]);
      const lastValue = [...visited.values()].pop();
      visited.delete(lastValue)
      console.log('aa', [...visited]);
      return customMethod(lastValue, visited, count + 1);
    }, count * 10);
  }

  const aStar = (start, visited = new Set(), closedSet = new Set(), count = 0, i = 0) => {
    // console.log('start', start, 'adjacent', adjacentNodes.get(start), 'closeSet', closedSet, 'visted', visited);
    const neighborNodes = (adjacentNodes.get(start) || []).reduce((a, v) => {
      if (!closedSet.has(v) && !wallIds.includes(v)) {
        a.push({
          key: v,
          distance: findDistance(v, finishNode)
        });
      }
      return a;
    }, []).sort((a, b) => a.distance - b.distance);
    setTimeout(() => {
        for (const node of neighborNodes) {
        const element = document.getElementById(`${node.key}`);
          if (![startNode, finishNode].includes(node.key)) {
            element.style.backgroundColor = 'yellow';
          }
        if (node.key === finishNode) {
          return;
        }
        if (!visited.has(node.key)) {
          visited.add(node.key);
          return aStar(node.key, visited, closedSet, count + 1, i,);
        }
      }
      // console.log('detection', [...visited], 'i', i);
      const Visit = [...visited.values()];
      const lastValue = Visit.pop();
      const lastSecondValue = Visit.pop();
      console.log('aa', [...visited], start, 'last', lastValue);
      console.log('neighborNodes', neighborNodes);
      visited.delete(lastValue);
      closedSet.add(lastValue);
      console.log('closeSet', [...closedSet]);
      const ele = document.getElementById(`${lastValue}`);
      if (![startNode, finishNode].includes(ele)) {
        ele.style = {};
      }
      return aStar(lastSecondValue, visited, closedSet, count, i + 1, true);
    }, 0.1 * count);
  };

  let actionStart = false;
  const ids = [...wallIds];
  const handleIds = (id) => {
    if (ids.indexOf(id) === -1 && ![startNode, finishNode].includes(id)) {
      ids.push(id);
    }
  }
  const mouseDown = (e) => {
    if (!wall) {
      actionStart = true;
    }
    console.log('down', actionStart);
    if (e.target.id) {
      handleIds(e.target.id);
    }
  };
  const mouseMove = (e) => {
    if (actionStart) {
      console.log(actionStart);
      if (e.target.id) {
        handleIds(e.target.id);
      }
    }
  };
  const mouseUp = (e) => {
    if (actionStart) {
      actionStart = false;
      console.log('ids', ids);
      setWallIds([...(wallIds || []), ...ids]);
    }
  };
  
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
                <div
                  onMouseDown={mouseDown}
                  onMouseOver={mouseMove}
                  onMouseUp={mouseUp}
                  role="presentation"
                  onClick={() => {
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
      <button type="button" onClick={() => {
        const allElements = document.querySelectorAll('[data-box]');
        [...allElements].forEach((ele) => {
          if (![startNode, finishNode].includes(ele.id)) {
            ele.style = {};
          }
        });
        aStar(startNode)
      }}>
        aStar
      </button>
    </>
  )
};

export default PathFinderVisualizer;