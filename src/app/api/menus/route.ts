import { NextResponse } from 'next/server';
import { getAllMenusByUserId } from '@/actions/user-create';
import { auth } from "@/auth";

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const menu = await getAllMenusByUserId(userId);

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error, message: 'Menu not found' }, { status: 401 });
  }
}