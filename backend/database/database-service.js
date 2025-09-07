const mongoose = require("mongoose");

const db = "mongodb://localhost:1234/info";

mongoose.set('strictQuery', false);
mongoose.connect(db);

const infoSchema = new mongoose.Schema({
  fileName: String,
  file: Buffer,
});

module.exports = mongoose.model('Info', infoSchema);
