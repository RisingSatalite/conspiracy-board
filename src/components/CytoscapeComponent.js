'use client'

import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = () => {
  const cyRef = useRef(null);

  useEffect(() => {
    cyRef.current = cytoscape({
      container: document.getElementById('cy'),
      elements: [
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'ab', source: 'a', target: 'b' } },
        { data: { id: 'c' } },
        { data: { id: 'abc', source: 'a', target: 'c' } },
      ],
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
        name: 'grid',
        rows: 1
      }
    });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  return <div id="cy" style={{ width: '100%', height: '1000px' }} />;
};

export default CytoscapeComponent;
