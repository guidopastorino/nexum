import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/utils/api/auth-options/authOptions";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  console.log({session})
  console.log({params: params.id})

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const currentUser = await User.findById(session.user.id);
  const targetUser = await User.findById(params.id);

  if (!currentUser || !targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (currentUser.following.includes(targetUser._id)) {
    return NextResponse.json({ message: 'Already following' }, { status: 400 });
  }

  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await currentUser.save();
  await targetUser.save();

  return NextResponse.json({ message: 'Followed successfully' }, { status: 200 });
}
