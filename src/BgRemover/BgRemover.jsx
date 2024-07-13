// src/components/BackgroundRemover.js
import { useState, useCallback } from 'react';
import axios from 'axios';

import DisplayImage from '../DisplayImage/DisplayImage';

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageBlob, setImageBlob] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageLink, setImageLink] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImageLink('');
  };

  const handleLinkChange = (event) => {
    setImageLink(event.target.value);
    setSelectedFile(null);
  };

  const handleRemoveBackground = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image_file', selectedFile);
    } else if (imageLink) {
      formData.append('image_url', imageLink);
    } else {
      alert('Please select a file or enter an image URL');
      return;
    }
    formData.append('size', 'auto');

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'iNMCCshEqJvmJCTisJDFDA52',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      setImageBlob(blob);
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setImageLink('');
    }
  }, []);

  return (
    <div className='lg:flex lg:justify-evenly px-4'>

      {/* image or gif */}
      <div>
      <p className='mt-24 text-4xl font-bold text-center'>Remove unnessesary background from your image</p>
      <button className='text-white mt-8 text-xl font-bold  bg-gradient-to-r from-indigo-800 via-blue-600 px-6 py-2 rounded-ee-full ml-60'>100% free</button>
      </div>

      {/* method */}
      <div style={{ textAlign: 'center' , width:'600px', height:'500px', background: "#c1c1c1"}}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #000' : '2px solid #ccc',
          padding: '20px',
          marginBottom: '10px',
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none', background:'white' }}
          id="fileInput"
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' ,width:'500px', height:'300px', background: 'white' , paddingTop:'130px' ,
        fontFamily:'serif', color:'blue', border:'2px solid blue' , borderRadius:'20px' , fontSize:'20px', marginLeft:'28px'}}>
          {selectedFile ? selectedFile.name : 'Drag & Drop or select a file' }
        </label>
      </div>
      <input
        type="text"
        placeholder="Paste an image URL here"
        value={imageLink}
        onChange={handleLinkChange}
        style={{ width: '80%', padding: '10px', marginBottom: '10px', border:'2px solid blue', background:'white',borderRadius:'10px' }}
      />
      <button onClick={handleRemoveBackground} className='px-4 py-2 bg-gradient-to-r from-indigo-900 via-blue-700 to-blue-500 text-white rounded-lg font-serif'>
        Remove Background
      </button>
      {imageUrl && (
        <DisplayImage imageUrl={imageUrl} imageBlob={imageBlob} />
      )}
    </div>
    </div>
  );
};

export default BackgroundRemover;
