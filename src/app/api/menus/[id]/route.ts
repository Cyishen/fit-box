import { NextResponse } from 'next/server';
import { deleteMenuById, getMenuById } from '@/actions/user-create';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const menu = await getMenuById(id);

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error, message: 'Menu not found' }, { status: 401 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await deleteMenuById(id);

    return NextResponse.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error, message: 'Failed to delete menu' }, { status: 500 });
  }
}