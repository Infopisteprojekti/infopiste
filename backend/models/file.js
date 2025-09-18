const mongoose = require("mongoose")

const schema = mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
})

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("File", schema)