import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { Types } from 'mongoose';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const currentUser = await User.findById(session.user.id);
  const targetUser = await User.findById(params.id);

  if (!currentUser || !targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!currentUser.following.includes(targetUser._id)) {
    return NextResponse.json({ message: 'Not following' }, { status: 400 });
  }

  currentUser.following = currentUser.following.filter(
    (id: Types.ObjectId) => id.toString() !== targetUser._id.toString()
  );
  targetUser.followers = targetUser.followers.filter(
    (id: Types.ObjectId) => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await targetUser.save();

  return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
}