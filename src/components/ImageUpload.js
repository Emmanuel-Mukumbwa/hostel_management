import React, { useState } from 'react';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    fetch('http://localhost:8080/api/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUploading(false);
      })
      .catch((error) => {
        console.error(error);
        setUploading(false);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {uploading ? <p>Uploading...</p> : <p>Image uploaded successfully!</p>}
    </div>
  );
}

export default ImageUpload;