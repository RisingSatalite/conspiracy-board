'use client'

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import avsdf from 'cytoscape-avsdf';
import klay from 'cytoscape-klay';
import cola from 'cytoscape-cola';

const ConspiracyBoard = (
  { elementsHolder, 
    graphType="circle",
    autoAlign=false,
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

  cytoscape.use(avsdf);
  cytoscape.use(klay);
  cytoscape.use(cola)

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

    // Add drag event listener for dynamic layout adjustment
    cyRef.current.on('dragfree', 'node', () => {
      if(autoAlign){
        cyRef.current.layout({ name: graphType, animate: 'end', fit: true }).run();
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [elementsHolder, graphType, style, autoAlign]);

  return <div id="cy" style={{ width: '100%', height: '1000px' }} />;
};

export default ConspiracyBoard;
