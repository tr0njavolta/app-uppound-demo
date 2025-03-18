import React, { useState } from 'react';

function ImageUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setError(null);
    
    fetch('http://localhost:3002/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to upload image');
      return response.json();
    })
    .then(data => {
      setUploading(false);
      onImageUploaded(data.imageUrl);
    })
    .catch(error => {
      console.error('Error:', error);
      setUploading(false);
      setError('Failed to upload image. Please try again.');
    });
  };

  return (
    <div className="image-upload">
      <label htmlFor="image">
        {uploading ? 'Uploading...' : 'Choose Image'}
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ImageUpload;
