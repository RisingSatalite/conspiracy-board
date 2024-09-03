'use client'

import React, { useState, useEffect } from 'react';
import ConspiracyBoard from './ConspiracyBoard';

const ConspiracyController = () => {
  const [graphType, setGraphType] = useState("circle");
  const possibleGraphTypes = ["cose", "grid", "concentric", "circle"];

  const handleGraphChange = (event) => {
    setGraphType(event.target.value);
  };

  const [nodeStyle, setStyle] = useState([
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
    {//Example style
      selector: 'node[id = "example"]',  // Targeting node with id 'example'
      style: {
        'background-image': 'url(https://example.com/image.png)',  // Replace with your image URL
        'background-fit': 'cover',
        'background-opacity': 1,
        'width': '50px',  // Adjust size if needed
        'height': '50px',
        'border-width': 2,
        'border-color': '#000',
      }
    }
  ])

  const addStyle = () => {
    document.getElementById('backgroundImageInput').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent the default form submission
    
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0]; // Get the selected file
    
      if (file) {
        const formData = new FormData();
        formData.append('file', file); // Append the file to FormData
    
        try {
          const response = await fetch('/upload', { // Replace '/upload' with your server endpoint
            method: 'POST',
            body: formData,
          });
    
          if (response.ok) {
            document.getElementById('status').textContent = 'File uploaded successfully!';
          } else {
            document.getElementById('status').textContent = 'File upload failed.';
          }
        } catch (error) {
          document.getElementById('status').textContent = 'Error: ' + error.message;
        }
      } else {
        document.getElementById('status').textContent = 'No file selected.';
      }
    });

    selector = `node[id = ${selectedElement}]`
    style = {
          'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...)',
          'background-fit': 'cover',
          'background-opacity': 0.5
            }
    const newStyle = selector 
    setStyle([...nodeStyle, newStyle])
  }

  const [elementsHolder, setElementsHolder] = useState([
    { data: { id: 'a' } },
    { data: { id: 'b' } },
    { data: { id: 'c' } },
    { data: { id: 'd' } },
    { data: { id: 'e' } },
    { data: { id: 'f' } },
    { data: { id: 'g' } },
  ]);
  const [selectedElement, setSelectedElement] = useState("")
  const setingSelectedElement = (event) => {
    setSelectedElement(event.target.value)
  };

  const [targetSelectedElement, setTargetSelectedElement] = useState("");

  const [elementsLinks, setElementLinks] = useState([
    { data: { id: 'ab', source: 'a', target: 'b' } },
    { data: { id: 'ac', source: 'a', target: 'c' } },
    { data: { id: 'ad', source: 'a', target: 'd' } },
    { data: { id: 'ae', source: 'a', target: 'e' } },
  ])

  const [allElements, setAllElements] = useState([...elementsHolder, ...elementsLinks])

  const addNewElementLink = () => {
    setElementLinks([...elementsLinks, { data: {id: selectedElement+targetSelectedElement, source: selectedElement, target: targetSelectedElement}}])
  }

  useEffect(() => {
    setAllElements([...elementsHolder, ...elementsLinks])
  }, [elementsHolder, elementsLinks]);

  const generateUniqueId = () => {
    let newNodeId;
    let isUnique = false;

    while (!isUnique) {
      newNodeId = `node${Math.floor(Math.random() * 100)}`;
      // Check if the generated ID already exists in the elementsHolder
      isUnique = !elementsHolder.some(node => node.data.id === newNodeId);
    }

    return newNodeId;
  };

  const deleteNode = (e) => {
    const removeID = selectedElement;
 
    console.log(removeID)
    setSelectedElement("")

    // Remove node from elementsHolder
    const updatedElements = elementsHolder.filter(element => element.data.id !== removeID);
  
    // Remove links associated with the node from elementsLinks
    let updatedLinks = elementsLinks.filter(item => item.data.target !== removeID && item.data.source !== removeID);
  
    // Update state
    setElementsHolder(updatedElements);
    setElementLinks(updatedLinks);
  };
  

  // Function to add a new node
  const addNode = () => {
    const newNodeId = generateUniqueId();
    const newNode = { data: { id: newNodeId } };
    setElementsHolder((prevElements) => [...prevElements, newNode]);
  };

  const idExists = (id) => {
    return elementsHolder.some(element => element.data.id === id);
  };

  // Function to handle changing the ID
  const handleIdChange = (e) => {
    const newId = e.target.value;

    // Prevent setting an empty string as an ID
    if (newId.trim() === "") {
      return;
    }

    if(idExists(newId)){
      return;//Do not chagne a name of a node to be the same as another node
    }
    
    setSelectedElement(newId);

    // Find the index of the selected element
    const updatedElements = elementsHolder.map(item => 
      item.data.id === selectedElement ? { ...item, data: { ...item.data, id: newId } } : item
    );

    var updatedLinks = elementsLinks.map(item =>
      item.data.source === selectedElement ? { ...item, data: { ...item.data, source: newId } } : item
    )
    updatedLinks = updatedLinks.map(item =>
      item.data.target === selectedElement ? { ...item, data: { ...item.data, target: newId } } : item
    )
    setElementsHolder(updatedElements);
    setElementLinks(updatedLinks)
  };

  return (
    <div>
      <span className="bg-slate-400">Controller</span>
      <select value={graphType} onChange={handleGraphChange}>
        <option value="" disabled>
          Choose an display layout
        </option>
        {possibleGraphTypes.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button className="bg-slate-400" onClick={addNode}>Add Node</button>
      <select value={selectedElement} onChange={setingSelectedElement}>
        <option value="" disabled>
          Select a node
        </option>
        {elementsHolder.map((item, index) => (
        <option key={index} value={item.data.id}>
            {item.data.id}
        </option>
        ))}
      </select>
      {selectedElement && (
        <div>
          <button className="bg-slate-400" onClick={deleteNode}>Delete Node</button>
          <input
            className="bg-stone-300"
            value={selectedElement}
            onChange={handleIdChange}
          />
          <select value={targetSelectedElement} onChange={(e) => setTargetSelectedElement(e.target.value)}>
            <option value="" disabled>
              Select a node
            </option>
            {elementsHolder.map((item, index) => (
            <option key={index} value={item.data.id}>
                {item.data.id}
            </option>
            ))}
          </select>
          <button onClick={addNewElementLink}>Link</button>
        </div>
      )}
      <input type="file" id="backgroundImageInput" name="file" />
      <button onClick={addStyle}>Set image background</button>
      <ConspiracyBoard elementsHolder={allElements} graphType={graphType} style={nodeStyle}/>
    </div>
  );
};

export default ConspiracyController;
