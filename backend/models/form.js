import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 20,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Form', formSchema);
