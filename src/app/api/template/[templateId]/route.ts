import { NextResponse } from 'next/server';
import { getTemplateExerciseByTemplateId } from '@/actions/user-create';

export async function GET( request: Request, { params }: { params: { templateId: string } }) {
  const { templateId } = params;

  try {
    const template = await getTemplateExerciseByTemplateId(templateId);

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error, message: 'template not found' }, { status: 401 });
  }
}