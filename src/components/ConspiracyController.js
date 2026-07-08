'use client'

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ConspiracyBoard from './ConspiracyBoard';

//Export libraries
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const ConspiracyController = () => {
  const [name, setName] = useState('Conspiracy')
  
  const [graphType, setGraphType] = useState("circle");
  const possibleGraphTypes = ["cose", "grid", "concentric", "circle", "avsdf", "klay", "cola"];

  const [imageHolder, setImageHolder] = useState(null)

  const [overlayCollapsed, setOverlayCollapsed] = useState(false)

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

    const setNodeBackgroundColor = (color) => {
      if (!selectedElement) {
        console.log('No node selected.');
        alert('No node selected.');
        return;
      }

      // Update node data so exporter includes the color
      setElementsHolder(prev => prev.map(item =>
        item.data.id === selectedElement ? { ...item, data: { ...item.data, backgroundColor: color } } : item
      ));

      // Update style for the specific node selector
      let usedBefore = false;
      const styleIDChange = nodeStyle.map(item => {
        if (item.selector === `node[id = "${selectedElement}"]`) {
          usedBefore = true;
          return { ...item, style: { ...item.style, 'background-color': color } };
        }
        return item;
      });

      if (usedBefore) {
        setStyle(styleIDChange);
      } else {
        setStyle(prev => [...prev, { selector: `node[id = "${selectedElement}"]`, style: { 'background-color': color, label: 'data(id)' } }]);
      }
    };

    const clearNodeBackgroundColor = () => {
      if (!selectedElement) return;

      // Remove backgroundColor from node data
      setElementsHolder(prev => prev.map(item =>
        item.data.id === selectedElement ? { ...item, data: (({ backgroundColor, ...rest }) => ({ ...rest }))(item.data) } : item
      ));

      // Remove background-color from the node-specific style (if present)
      const styleIDChange = nodeStyle.map(item => {
        if (item.selector === `node[id = "${selectedElement}"]`) {
          const { ['background-color']: _, ...restStyles } = item.style || {};
          return { ...item, style: restStyles };
        }
        return item;
      }).filter(item => !(item.selector === `node[id = "${selectedElement}"]` && Object.keys(item.style || {}).length === 0));

      setStyle(styleIDChange);
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
    const newNode = { data: { id: newNodeId, backgroundColor: '#666666' } };
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
        const importedNodes = data.nodes || [];
        const importedArrows = data.arrows || [];
        const importedStyle = data.style || [];

        // Build node-specific styles from node data (backgroundColor)
        const nodeColorStyles = importedNodes
          .map(n => (n.data && n.data.backgroundColor) ? { selector: `node[id = "${n.data.id}"]`, style: { 'background-color': n.data.backgroundColor } } : null)
          .filter(Boolean);

        // Merge importedStyle and nodeColorStyles: node-specific styles override general importedStyle selectors
        const finalStyle = [...importedStyle];
        nodeColorStyles.forEach(ncs => {
          const idx = finalStyle.findIndex(s => s.selector === ncs.selector);
          if (idx >= 0) {
            finalStyle[idx] = { ...finalStyle[idx], style: { ...finalStyle[idx].style, ...ncs.style } };
          } else {
            finalStyle.push(ncs);
          }
        });

        setElementsHolder(importedNodes)
        setElementLinks(importedArrows)
        setStyle(finalStyle)
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
    downloadFile(name+".ndv", jsonObj)
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
        FileSaver.saveAs(blob, name+'.png');
    });
  }

  const exportSVG = () => {
    const node = document.getElementById("cy");

    domtoimage.toSvg(node)
    .then((dataUrl) => {
      // Remove the `data:image/svg+xml;charset=utf-8,` prefix
      const svgContent = dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, '');
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(svgBlob, name+'.svg');
    })
    .catch((error) => {
      console.error('Error converting HTML to SVG:', error);
    });
  }

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-50 bg-white bg-opacity-95 rounded shadow max-w-md">
        <div className="flex items-center justify-between p-2 border-b bg-white bg-opacity-95 rounded-t">
          <span className="font-medium">Controls</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOverlayCollapsed(!overlayCollapsed)}
              className="px-2 py-1 bg-slate-200 rounded text-sm"
              aria-expanded={!overlayCollapsed}
            >
              {overlayCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
        </div>

        {!overlayCollapsed && (
          <div className="p-4 flex flex-col gap-2">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name your drawing name"
              className="p-1 border rounded"
            />
          <input
            type="file"
            accept=".ndv"
            onChange={uploadData}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <div className="flex gap-2">
            <button onClick={() => document.getElementById('fileInput').click()} className="px-2 py-1 bg-slate-200 rounded">Upload</button>
            <button onClick={downloadData} className="px-2 py-1 bg-slate-200 rounded">Download</button>
            <button onClick={exportImage} className="px-2 py-1 bg-slate-200 rounded">PNG</button>
            <button onClick={exportSVG} className="px-2 py-1 bg-slate-200 rounded">SVG</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-slate-400 px-2 py-1 rounded" onClick={addNode}>Add Node</button>
            <select value={graphType} onChange={handleGraphChange} className="p-1 border rounded">
              <option value="" disabled>
                Choose layout
              </option>
              {possibleGraphTypes.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button className="bg-slate-400 px-2 py-1 rounded" onClick={reverseAlignState}>Auto align{(autoAlignState==true) && (<span> On</span>)}{(autoAlignState==false) && (<span> Off</span>)}</button>
          </div>

          <div>
            <Select
              className="react-select"
              value={elementsHolder.find((item) => item.data.id === selectedElement)}
              onChange={(selectedOption) => setSelectedElement(selectedOption.data.id)}
              options={elementsHolder.map((item) => ({
                ...item,
                value: item.data.id,
                label: item.data.id,
              }))}
              placeholder="Select a node"
              isSearchable
              getOptionValue={(option) => option.data.id}
              getOptionLabel={(option) => option.data.id}
            />
          </div>

          {selectedElement && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <button className="bg-slate-400 px-2 py-1 rounded" onClick={deleteNode}>Delete Node</button>
                <input
                  className="bg-stone-300 p-1 rounded"
                  value={selectedElement}
                  onChange={handleIdChange}
                />
              </div>
              <div>
                <Select
                  className="react-select"
                  value={elementsHolder.find((item) => item.data.id === targetSelectedElement)}
                  onChange={(selectedOption) => setTargetSelectedElement(selectedOption.data.id)}
                  options={elementsHolder.map((item) => ({
                    ...item,
                    value: item.data.id,
                    label: item.data.id,
                  }))}
                  placeholder="Select a node"
                  isSearchable
                  getOptionValue={(option) => option.data.id}
                  getOptionLabel={(option) => option.data.id}
                />
                <button onClick={addNewElementLink} className="px-2 py-1 bg-slate-200 rounded">Link</button>
                <button onClick={removeElementLink} className="px-2 py-1 bg-slate-200 rounded">Delete Links</button>
              </div>
              <div>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span>Background image</span>
                    <input
                      type="file"
                      id="backgroundImageInput"
                      name="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) setImageHolder(file.name);
                      }}
                    />
                    <label htmlFor="backgroundImageInput" className="px-2 py-1 bg-slate-100 rounded cursor-pointer">Choose image</label>
                    <span className="max-w-[160px] truncate text-sm text-gray-600">{imageHolder || 'No file chosen'}</span>
                    <button onClick={addStyle} className="ml-auto px-2 py-1 bg-slate-200 rounded">Set image background</button>
                  </div>
                <div className="flex items-center gap-2 mt-2">
                  <span>Background color</span>
                  <input
                    type="color"
                    value={(elementsHolder.find(item => item.data.id === selectedElement) || {}).data?.backgroundColor || '#666666'}
                    onChange={(e) => setNodeBackgroundColor(e.target.value)}
                    className="ml-2"
                  />
                  <button onClick={() => setNodeBackgroundColor((elementsHolder.find(item => item.data.id === selectedElement) || {}).data?.backgroundColor || '#666666')} className="px-2 py-1 bg-slate-200 rounded">Set color</button>
                  <button onClick={clearNodeBackgroundColor} className="px-2 py-1 bg-slate-200 rounded">Clear color</button>
                </div>
              </div>
            </div>
            )}
          </div>
          )}
      </div>

      <div>
        <ConspiracyBoard className="h-screen" elementsHolder={allElements} graphType={graphType} style={nodeStyle} autoAlign={autoAlignState}/>
      </div>
    </div>
  );
};

export default ConspiracyController;
