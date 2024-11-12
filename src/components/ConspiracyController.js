'use client'

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ConspiracyBoard from './ConspiracyBoard';

//Export libraries
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const ConspiracyController = () => {
  const [graphType, setGraphType] = useState("circle");
  const possibleGraphTypes = ["cose", "grid", "concentric", "circle", "avsdf", "klay", "cola"];

  const [imageHolder, setImageHolder] = useState(null)

  const [autoAlignState, setAutoAlignState] = useState(false)

  const reverseAlignState = () => {
    if(autoAlignState){
      setAutoAlignState(false)
    }else{
      setAutoAlignState(true)
    }
  }

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
      selector: 'node[id = "__example"]',  // Targeting node with id '__example'
      style: {
        'background-image': 'url(https://example.com/image.png)',  // Replace with your image URL
        'background-fit': 'cover',
        'background-opacity': 1,
        'width': '60x',  // Adjust size if needed
        'height': '6px',
        'border-width': 2,
        'border-color': '#000',
      }
    }
  ])

  const addStyle = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    const fileInput = document.getElementById('backgroundImageInput');
    const file = fileInput.files[0]; // Get the selected file
  
    if (file && selectedElement) { // Ensure a file and node are selected
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64String = reader.result;
  
        const newStyle = {
          selector: `node[id = "${selectedElement}"]`,
          style: {
            'background-image': `url(${base64String})`,
            'background-fit': 'cover',
            'background-opacity': 1,
            'width': '50px',  // Adjust size if needed
            'height': '50px',
            'border-width': 2,
            'border-color': '#000',
          }
        };
        console.log(newStyle);
  
        let usedBefore = false;
  
        const styleIDChange = nodeStyle.map(item => {
          if (item.selector === `node[id = "${selectedElement}"]`) {
            usedBefore = true;
            // Merge the existing style with the new style
            return {
              ...item,
              style: {
                ...item.style, // Keep existing styles
                ...newStyle.style, // Override with the new styles
              }
            };
          }
          return item; // Don't forget to return the item in other cases
        });
  
        // If the style was used before, update the styles
        if (usedBefore) {
          setStyle(styleIDChange);
        } else {
          // Else add the new style to the list
          setStyle((prevStyles) => [...prevStyles, newStyle]);
        }
      };
  
      reader.readAsDataURL(file); // Convert the file to a base64 string
    } else {
      alert('No file selected or no node selected.');
    }
  };

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

  const removeElementLink = () => {
    const isRemoveTarget = (arrow) => {
      return !((arrow.data.source == selectedElement && arrow.data.target == targetSelectedElement) || (arrow.data.source == targetSelectedElement && arrow.data.target == selectedElement));
    }
    const removeLink = elementsLinks.filter(isRemoveTarget)
    setElementLinks(removeLink)
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

    const styleIDchange = nodeStyle.map(item =>
      item.selector === `node[id = "${selectedElement}"]`
        ? { ...item, selector: `node[id = "${newId}"]` } // Replace with the new ID
        : item
    );
    setStyle(styleIDchange)
  };

  const uploadData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const content = e.target.result;
      try{
        const data = JSON.parse(content)
        setElementsHolder(data.nodes)
        setElementLinks(data.arrows)
        setStyle(data.style)
      } catch (error) {
        console.error('Error parsing imported data:', error);
        alert('An error occurred while reading the data: ' + error);
      }
    };

    reader.readAsText(file);
  }

  const downloadData = () => {
    //Node Diagram View NDV format
    const nodeInformation = {nodes: elementsHolder, arrows: elementsLinks, style: nodeStyle};
    const jsonObj = JSON.stringify(nodeInformation)
    downloadFile("node diagram.ndv", jsonObj)
  }

  const downloadFile = (filename, content) => {
    const element = document.createElement('a');//I assume completely pointless
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Create element and then use it to download file?
    element.click();
  };

  const exportImage = () => {
    domtoimage.toBlob(document.getElementById("cy"))
    .then(function (blob) {
        var FileSaver = require('file-saver');
        FileSaver.saveAs(blob, 'conspiracy.png');
    });
  }

  const exportSVG = () => {
    const node = document.getElementById("cy");

    domtoimage.toSvg(node)
    .then((dataUrl) => {
      // Remove the `data:image/svg+xml;charset=utf-8,` prefix
      const svgContent = dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, '');
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(svgBlob, 'conspiracy.svg');
    })
    .catch((error) => {
      console.error('Error converting HTML to SVG:', error);
    });
  }

  return (
    <div>
      <input
        type="file"
        accept=".ndv"
        onChange={uploadData}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <button onClick={() => document.getElementById('fileInput').click()}>Upload data</button>
      <button onClick={downloadData}>Download data</button>
      <button onClick={exportImage}>Download PNG image</button>
      <button onClick={exportSVG}>Download SVG image</button>
      <br/>
      <span>Controller</span>
      <button className="bg-slate-400" onClick={addNode}>Add Node</button>
      <Select
        class="react-select" className="react-select"
        value={elementsHolder.find((item) => item.data.id === selectedElement)}
        onChange={(selectedOption) => setSelectedElement(selectedOption.data.id)}
        options={elementsHolder.map((item) => ({
        ...item, // Spread the original item data
        value: item.data.id,
        label: item.data.id,
        }))}
          placeholder="Select a node"
        isSearchable
        getOptionValue={(option) => option.data.id}  // Use the original `data.id` as the value
        getOptionLabel={(option) => option.data.id}  // Display the `data.id` as the label
      />
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
      <button className="bg-slate-400" onClick={reverseAlignState}>Auto align</button>
      {selectedElement && (
        <div>
          <button className="bg-slate-400" onClick={deleteNode}>Delete Node</button>
          <input
            className="bg-stone-300"
            value={selectedElement}
            onChange={handleIdChange}
          />
          <Select
            class="react-select" className="react-select"
            value={elementsHolder.find((item) => item.data.id === targetSelectedElement)}
            onChange={(selectedOption) => setTargetSelectedElement(selectedOption.data.id)}
            options={elementsHolder.map((item) => ({
            ...item, // Spread the original item data
            value: item.data.id,
            label: item.data.id,
            }))}
              placeholder="Select a node"
            isSearchable
            getOptionValue={(option) => option.data.id}  // Use the original `data.id` as the value
            getOptionLabel={(option) => option.data.id}  // Display the `data.id` as the label
          />
          <button onClick={addNewElementLink}>Link</button><button onClick={removeElementLink}>Delete Links</button>
          <div>
            <span>Background image</span>
            <input type="file" id="backgroundImageInput" name="file" onClick={(e) => setImageHolder(e.target.value)}/>
            <button onClick={addStyle}>Set image background</button>
          </div>
        </div>
      )}
      <ConspiracyBoard elementsHolder={allElements} graphType={graphType} style={nodeStyle} autoAlign={autoAlignState}/>
    </div>
  );
};

export default ConspiracyController;
