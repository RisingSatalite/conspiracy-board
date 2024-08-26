'use client'

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const ConspiracyBoard = ({elementsHolder, graphType}) => {
  const cyRef = useRef(null);

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
    <div id="cy" class="w-full h-[1000px]" className="w-full h-[1000px]"/>
  )};

export default ConspiracyBoard;
