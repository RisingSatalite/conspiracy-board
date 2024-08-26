'use client'

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import ConspiracyBoard from './ConspiracyBoard';

const ConspiracyController = () => {
  const cyRef = useRef(null);

  const [graphType, setGraphType] = useState("circle")
  const possibleGraphTypes = ["cose", "grid", "concentric", "circle"]
  const handleGraphChange = (event) => {
    setGraphType(event.target.value);
  };

  const [elementsHolder, setElementsHolder] = useState([
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    { data: { id: 'c' } },
    { data: { id: 'd' } },
    { data: { id: 'e' } },
    { data: { id: 'f' } },
    { data: { id: 'g '} },
    { data: { id: 'ab', source: 'a', target: 'b' } },
    { data: { id: 'ac', source: 'a', target: 'c' } },
    { data: { id: 'ad', source: 'a', target: 'd' } },
    { data: { id: 'ae', source: 'a', target: 'e' } },
  ])

  return(
    <div>
        <div class="bg-slate-400">Controller</div>
        <select value={setGraphType} onChange={handleGraphChange}>
            <option value="" disabled>
            Choose an item
            </option>
            {possibleGraphTypes.map((item, index) => (
            <option key={index} value={item}>
                {item}
            </option>
            ))}
        </select>
        <ConspiracyBoard elementsHolder={elementsHolder} graphType={graphType}/>
    </div>
  )};

export default ConspiracyController;
