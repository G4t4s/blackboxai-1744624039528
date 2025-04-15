import React, { useState } from 'react';

function App() {
  const [images, setImages] = useState([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Images uploaded successfully!');
    } else {
      alert('Failed to upload images.');
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleExecute = async () => {
    const response = await fetch('http://localhost:5000/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (response.ok) {
      setOutput(data.output);
    } else {
      setOutput(data.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      <input type="file" multiple onChange={handleImageChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-8">
        Upload
      </button>

      <h1 className="text-2xl font-bold mb-4">Execute Python Code</h1>
      <textarea
        value={code}
        onChange={handleCodeChange}
        rows={10}
        className="w-full p-2 border border-gray-300 rounded mb-4 font-mono"
        placeholder="Enter Python code here"
      />
      <button onClick={handleExecute} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Execute
      </button>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{output}</pre>
    </div>
  );
}

export default App;
