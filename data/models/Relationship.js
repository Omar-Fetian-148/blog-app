import { model, Schema } from 'mongoose';


const relationshipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', required: true
    },
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User', required: true
    },
    relationType: {
      type: String,
      enum: ['FRIEND', 'FOLLOW'],
      required: true
    },
  },
  { timestamps: true }
);

relationshipSchema.index({ userId: 1, followerId: 1 }, { unique: true });

export default model('Relationship', relationshipSchema);
