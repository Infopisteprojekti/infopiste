require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const dbUrl = process.env.MONGO_DB_URL

const infoSchema = new mongoose.Schema({
  fileName: String,
  file: Buffer,
})

const PORT = process.env.PORT || 1234

app.use(cors())
app.use(express.json())

app.get("/api/hello", async (req, res) => {
  res.json({ message: 'hello from backend server'})
});

app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
  try {
    console.log('Connecting to the database in', dbUrl)
    await mongoose.connect(dbUrl)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to the database', error)
  }
})

module.exports = mongoose.model("Info", infoSchema);
