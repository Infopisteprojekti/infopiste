import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import fileService from "../services/files"

const File = () => {
  const { id } = useParams()
  const [file, setFile] = useState(null)

  useEffect(() => {
    initializeFile()
  }, [id])
  
  const initializeFile = async () => {
    const returnedFile = await fileService.getById(id)
    setFile(returnedFile)
  }


  return (
    <div>
      {file ? (
        <div>
          <h2>{file.originalname}</h2>
          <iframe
            src={`/api/uploads/${file.filename}`}
            title={file.originalname}
            width="50%"
            height="800px"
          />
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  )
}

export default File