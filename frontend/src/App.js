import React, { useState } from 'react';

function App() {
  const [images, setImages] = useState([]);

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

  return (
    <div>
      <h1>Upload Images</h1>
      <input type="file" multiple onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;
