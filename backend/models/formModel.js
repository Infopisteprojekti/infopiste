import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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

export const Form = mongoose.model('Form', formSchema);
