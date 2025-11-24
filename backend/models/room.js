import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
  roomEmail: String,
  displayId: String,
  displayName: String,
  capacity: Number,
  floorNumber: Number,
  isWheelChairAccessible: Boolean,
  tags: [String],
});

roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Room', roomSchema);
