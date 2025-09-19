import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
            <Link to={`/files/${file.id}`}>
              {file.originalName}
            </Link>
          </li>
        )}
      </ul>
      <FileForm onFileUpload={handleFileUpload} />
    </div>
  )
}

export default BulletinBoard