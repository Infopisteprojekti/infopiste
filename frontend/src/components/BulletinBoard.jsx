import { useState, useEffect } from 'react'
import fileService from '../services/files'

import FileForm from './FileForm'

const BulletinBoard = () => {
  const [files, setFiles] = useState([])

  useEffect(() => {
    initializeFiles()
  }, [])

  const initializeFiles = async () => {
    const files = await fileService.getAll()
    setFiles(files)
  }

  const handleFileUpload = () => {
    initializeFiles()
  }

  return (
    <div>
      <h1>Bulletin Board</h1>
      <ul>
        {files.map(file =>
          <li key={file.id}>
            <a href={`/${file.path}`} target="_blank" rel="noopener noreferrer">
              {file.originalName}
            </a>
          </li>
        )}
      </ul>
      <FileForm onFileUpload={handleFileUpload} />
    </div>
  )
}

export default BulletinBoard