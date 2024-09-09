'use client'

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
import klay from 'cytoscape-klay';
 
const ConspiracyBoard = (
  { elementsHolder, 
    graphType="circle", 
    style=[
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      label: 'data(id)',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
    },
  },
] }) => {
  const cyRef = useRef(null);

  cytoscape.use( avsdf );
  cytoscape.use( klay );

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    cyRef.current = cytoscape({
      container: document.getElementById('cy'),
      elements: elementsHolder,
      style: style,
      layout: {
        name: graphType,
        rows: 5,
      },
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [elementsHolder, graphType, style]);

  return <div id="cy" style={{ width: '100%', height: '1000px' }} />;
};

export default ConspiracyBoard;
