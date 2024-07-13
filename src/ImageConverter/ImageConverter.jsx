// src/components/ImageConverter.js
import { useState } from 'react';
import { Canvg } from 'canvg';

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const convertToPng = async () => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const svgContent = e.target.result;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const v = await Canvg.fromString(context, svgContent);
      v.start();
      const pngUrl = canvas.toDataURL('image/png');
      setConvertedFile(pngUrl);
    };
    reader.readAsText(selectedFile);
  };

  const convertToSvg = () => {
    // Placeholder for PNG to SVG conversion logic
    alert('PNG to SVG conversion needs server-side implementation.');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = convertedFile;
    link.download = selectedFile.name.split('.')[0] + (convertedFile.includes('image/png') ? '.png' : '.svg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={convertToPng}>Convert to PNG</button>
      <button onClick={convertToSvg}>Convert to SVG</button>
      {convertedFile && (
        <div>
          <h3>Converted Image:</h3>
          <img src={convertedFile} alt="Converted" />
          <br />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
