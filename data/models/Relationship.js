import { model, Schema } from 'mongoose';


const relationshipSchema = new Schema(
  {
    primaryUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    secondaryUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relationType: {
      type: String,
      enum: ['FOLLOW', 'BLOCK'],
      required: true
    },
  },
  { timestamps: true }
);

relationshipSchema.index({ userId: 1, followerId: 1 }, { unique: true });

export default model('Relationship', relationshipSchema);
