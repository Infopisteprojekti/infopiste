import { useState, useRef } from 'react';
import fileService from '../services/files';

const FileForm = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async event => {
    event.preventDefault();

    if(!file) {
      alert('select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadedFile = await fileService.upload(formData);
      console.log('file uploaded successfully', uploadedFile);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      onFileUpload();
    } catch (error) {
      console.error('error uploading file:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <h2>upload a file</h2>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          <button type="submit">upload</button>
        </div>
      </form>
    </div>
  );
};

export default FileForm;