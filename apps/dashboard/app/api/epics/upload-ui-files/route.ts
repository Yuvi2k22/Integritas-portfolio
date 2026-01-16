import { NextRequest, NextResponse } from 'next/server';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { checkSession } from '@workspace/auth/session';

import { getEpic } from '~/data/epics/get-epic';
import { getProject } from '~/data/projects/get-project';
import { uploadEpicFilesSchema } from '~/schemas/epics/upload-epic-files-schema';
import { uploadDesignFilesAndUpdateDB } from './helper';

export async function POST(req: NextRequest) {
  const ctx = await getAuthOrganizationContext();
  if (!checkSession(ctx.session)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const formData = await req.formData();
  const { error, data, success } = uploadEpicFilesSchema.safeParse(formData);

  if (!success) return NextResponse.json({ error }, { status: 400 });

  const { projectId, epicId, files } = data;

  // fetch corresponding project and epic from provided data
  const [project, epic] = await Promise.all([
    getProject({ projectId }),
    getEpic({ projectId, epicId })
  ]);

  // If project or epic not found send 404
  if (!project)
    return NextResponse.json({ message: 'project not found' }, { status: 404 });
  if (!epic)
    return NextResponse.json({ message: 'epic not found' }, { status: 404 });
  if (epic.status !== 'DRAFT')
    return NextResponse.json(
      { message: "can't upload again" },
      { status: 400 }
    );

  await uploadDesignFilesAndUpdateDB(
    ctx.organization.id,
    projectId,
    epicId,
    files
  );

  return NextResponse.json({ message: 'success' });
}
