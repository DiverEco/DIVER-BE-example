// src/components/ImageUpload.tsx
import React, { useState } from 'react';

const ImageUpload: React.FC<{ jwtToken: string }> = ({ jwtToken }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [accessURL, setAccessURL] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (isValidImageFile(file)) {
        setSelectedImage(file);
        setPreviewURL(URL.createObjectURL(file));
      } else {
        setUploadStatus('Invalid file type. Please select an image.');
      }
    } else {
      setSelectedImage(null);
      setPreviewURL(null);
    }
  };

  const isValidImageFile = (file: File) => {
    // Define an array of valid image MIME types or extensions.
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    // Get the file's MIME type.
    const fileType = file.type;

    // Get the file's extension from its name.
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    // Check if the file is an image based on MIME type or extension.
    if (
      validImageTypes.includes(fileType) ||
      (fileExtension && validImageExtensions.includes(fileExtension))
    ) {
      return true;
    }
    return false;
  };

  const getPresignedURL = async () => {
    if (selectedImage) {
      try {
        // Include the filename as a query parameter in the URL.
        const filename = encodeURIComponent(selectedImage.name);
        const presignedUrl = `${process.env.REACT_APP_API_ENDPOINT}/upload?filename=${filename}`;
        
        // Send a request to the server to get the presigned URL using the JWT token.
        const response = await fetch(presignedUrl, {
          method: 'GET',
          headers: {
            // Authorization: `Bearer ${jwtToken}`,
            Authorization: `${jwtToken}`,
            'x-api-key': `${process.env.REACT_APP_API_KEY}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          const presignedUrl = data.presignedUrl;
          setUploadStatus('Fetching presigned URL...');

          // Now, use the obtained presigned URL for image upload.
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: selectedImage,
          });

          if (uploadResponse.ok) {
            setUploadStatus('Image uploaded successfully!');
            // Set the access URL from the response.
            setAccessURL(data.accessUrl);
          } else {
            setUploadStatus('Image upload failed!');
          }
        } else {
          setUploadStatus('Failed to fetch presigned URL.');
        }
      } catch (error) {
        setUploadStatus('An error occurred during upload.');
      }
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" accept="image/jpeg,image/png,image/gif,image/jpg" onChange={handleImageSelect} />
      {previewURL && <img 
        src={previewURL} alt="Preview" 
        srcSet="image-url-300.jpg 300w, image-url-768.jpg 768w, image-url-1280.jpg 1280w"
        sizes="(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px" />
      }
      <button onClick={getPresignedURL}>Upload</button>
      <div>{uploadStatus}</div>
      {accessURL && (
        <div>
          Access URL: <a href={accessURL} target="_blank" rel="noopener noreferrer">
            {accessURL}
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
