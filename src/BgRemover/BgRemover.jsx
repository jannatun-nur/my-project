// src/components/BackgroundRemover.js
import { useState } from 'react';
import axios from 'axios';

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageBlob, setImageBlob] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRemoveBackground = async () => {
    const formData = new FormData();
    formData.append('image_file', selectedFile);
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(imageBlob);
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleRemoveBackground}>Remove Background</button>
      {imageUrl && (
        <div>
          <h3>Background Removed Image:</h3>
          <img src={imageUrl} alt="Background Removed" />
          <br />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
