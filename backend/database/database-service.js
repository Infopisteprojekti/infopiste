import mongoose from 'mongoose';

const db = 'mongodb://localhost:1234/info';

mongoose.set('strictQuery', false);
mongoose.connect(db);

const infoSchema = new mongoose.Schema({
  fileName: String,
  file: Buffer,
});

// A module.exports = mongoose.model('Info', infoSchema);
export default mongoose.model('Info', infoSchema);
