import mongoose, { Schema, Document, Model } from 'mongoose';
import { FamilyRole } from './family';

export interface IFamilyMember extends Document {
  familyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: FamilyRole;
  status: 'ACTIVE' | 'PENDING' | 'REMOVED';
  invitedBy?: mongoose.Types.ObjectId;
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    familyId: { type: Schema.Types.ObjectId, ref: 'Family', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: Object.values(FamilyRole),
      default: FamilyRole.MEMBER,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'REMOVED'],
      default: 'ACTIVE',
      index: true,
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    invitedAt: { type: Date },
    joinedAt: { type: Date },
  },
  { timestamps: true }
);

familyMemberSchema.index({ familyId: 1, userId: 1 }, { unique: true });

export const FamilyMember: Model<IFamilyMember> = (mongoose.models.FamilyMember as Model<IFamilyMember>) || mongoose.model<IFamilyMember>('FamilyMember', familyMemberSchema);