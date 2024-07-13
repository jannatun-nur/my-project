
const DisplayImage = ({ imageUrl, imageBlob }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(imageBlob);
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy image URL:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', background:'red' }}>
      <h3>Background Removed Image:</h3>
      <img src={imageUrl} alt="Background Removed" style={{ maxWidth: '100%', marginTop: '10px' }} />
      <br />
      <button onClick={handleDownload} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Download Image
      </button>
      <button onClick={handleCopyLink} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Copy Link
      </button>
    </div>
  );
};

export default DisplayImage;
