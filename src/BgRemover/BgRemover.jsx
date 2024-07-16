import { useState, useCallback } from "react";
import axios from "axios";
import { GrDownload } from "react-icons/gr";
import { FaCopy } from "react-icons/fa";

const BackgroundRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageBlob, setImageBlob] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageLink, setImageLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageLink("");
    updateHistory(URL.createObjectURL(file), null, file);
  };

  const handleLinkChange = (event) => {
    setImageLink(event.target.value);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemoveBackground = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image_file", selectedFile);
    } else if (imageLink) {
      formData.append("image_url", imageLink);
    } else {
      alert("Please select a file or enter an image URL");
      return;
    }
    formData.append("size", "auto");

    setIsRemoving(true);

    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": "iNMCCshEqJvmJCTisJDFDA52",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      setImageBlob(blob);
      updateHistory(url, blob, selectedFile);
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageLink("");
      updateHistory(URL.createObjectURL(file), null, file);
    }
  }, []);

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

  const updateHistory = (url, blob, file) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ url, blob, file });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      const prevState = history[prevIndex];
      setImageUrl(prevState.url);
      setImageBlob(prevState.blob);
      setSelectedFile(prevState.file);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const nextState = history[nextIndex];
      setImageUrl(nextState.url);
      setImageBlob(nextState.blob);
      setSelectedFile(nextState.file);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageUrl("");
    setImageBlob(null);
    setImageLink("");
    setPreviewUrl(null);
    setHistory([]);
    setHistoryIndex(-1);
  };

  return (
    <div className="lg:flex lg:justify-evenly px-4 mt-10">

        <div style={{ position: "absolute", right: "10px", top: "10px"}}>
          <button onClick={handleUndo} disabled={historyIndex <= 0} className="px-4 py-2 bg-gradient-to-r from-indigo-900 via-blue-700 to-blue-500 text-white rounded-lg font-serif mr-3">
            Undo
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="px-4 py-2 bg-gradient-to-r from-indigo-900 via-blue-700 to-blue-500 text-white rounded-lg font-serif mr-3">
            Redo
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-gradient-to-r from-indigo-900 via-blue-700 to-blue-500 text-white rounded-lg font-serif mr-3" >
            Reset
          </button>
        </div>

      <div>
        <p className="mt-24 text-4xl font-bold text-center text-indigo-700">
          Remove unnecessary background from your image
        </p>
        <button className="text-white mt-8 text-xl font-bold bg-gradient-to-r from-indigo-800 via-blue-600 px-6 py-2 rounded-ee-full ml-60">
          100% free
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          width: "600px",
          height: "500px",
          position: "relative",
        }}
      >
    
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px dashed #000" : "",
            padding: "20px",
            marginBottom: "10px",
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "500px",
              height: "300px",
              background: "white",
              fontFamily: "serif",
              color: "blue",
              border: "2px solid blue",
              borderRadius: "20px",
              fontSize: "20px",
              marginLeft: "28px",
              transition: "background 0.5s ease",
            }}
          >
            {isRemoving ? (
              <div>Removing background...</div>
            ) : imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Background Removed"
                  style={{
                    maxWidth: "250px",
                    maxHeight: "280px",
                    objectFit: "contain",
                    marginBottom: "10px",
                  }}
                />
                <div className="flex ">
                <button onClick={handleDownload} style={{ padding: '5px 10px', marginTop: '5px' }}>
                <GrDownload />
                </button>
                <button onClick={handleCopyLink} style={{ padding: '5px 10px', marginTop: '5px' }}>
                <FaCopy />
                </button>
                </div>
              </>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected"
                style={{
                  maxWidth: "250px",
                  maxHeight: "280px",
                  objectFit: "contain",
                }}
              />
            ) : (
              "Drag & Drop or select a file"
            )}
          </label>
        </div>
        <input
          type="text"
          placeholder="Paste an image URL here"
          value={imageLink}
          onChange={handleLinkChange}
          style={{
            width: "80%",
            padding: "10px",
            marginBottom: "10px",
            border: "2px solid blue",
            background: "white",
            borderRadius: "10px",
          }}
        />
        <button
          onClick={handleRemoveBackground}
          className="px-4 py-2 bg-gradient-to-r from-indigo-900 via-blue-700 to-blue-500 text-white rounded-lg font-serif"
        >
          Remove Background
        </button>
      </div>
    </div>
  );
};

export default BackgroundRemover;
