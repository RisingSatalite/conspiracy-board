'use client'

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import ConspiracyBoard from './ConspiracyBoard';

const ConspiracyController = () => {
  const cyRef = useRef(null);

  const [graphType, setGraphType] = useState("grid")

  const [elementsHolder, setElementsHolder] = useState([
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    { data: { id: 'c' } },
    { data: { id: 'd' } },
    { data: { id: 'e' } },
    { data: { id: 'f' } },
    { data: { id: 'ab', source: 'a', target: 'b' } },
    { data: { id: 'ac', source: 'a', target: 'c' } },
    { data: { id: 'ad', source: 'a', target: 'd' } },
    { data: { id: 'ae', source: 'a', target: 'e' } },
  ])

  useEffect(() => {
    cyRef.current = cytoscape({
      container: document.getElementById('cy'),
      elements: elementsHolder,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: graphType,
        rows: 1
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  return(
    <div>
        <div>Controller</div>
        <ConspiracyBoard/>
    </div>
  )};

export default ConspiracyController;
