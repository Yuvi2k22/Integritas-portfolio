import { NextRequest, NextResponse } from 'next/server';
import {
  validateAuthContext,
  validateProjectAndEpic,
} from '~/lib/utils/api/validations';
import { baseBackendLogicsSchema } from '~/schemas/epics/backend-logics-schema';
import { EpicStatus } from '@workspace/database';
import { prisma } from '@workspace/database/client';
import { getAuthOrganizationContext } from '@workspace/auth/context';
import { checkSession } from '@workspace/auth/session';
import { respond } from '../helper';
import {
  deleteFiles,
  getKeyFromTemplate,
  S3_Key_Templates,
  TemplateFields,
} from '@workspace/aws/s3';

export async function POST(req: NextRequest) {
  try {
    await validateAuthContext();
    const ctx = await getAuthOrganizationContext();
    if (!checkSession(ctx.session)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }
    const formData = await req.formData();

    const data = {
      projectId: formData.get('projectId')?.toString(),
      epicId: formData.get('epicId')?.toString(),
    };

    const { projectId, epicId } = baseBackendLogicsSchema.parse(data);
    await validateProjectAndEpic(projectId, epicId);
    const targetKeyTemplate = S3_Key_Templates.epicAudioFile;
    const key = getKeyFromTemplate(targetKeyTemplate, {
      [TemplateFields.OrganizationId]: ctx.organization.id,
      [TemplateFields.ProjectId]: projectId,
      [TemplateFields.EpicId]: epicId,
      [TemplateFields.FileId]: 'backendLogic',
    });
    await deleteFiles([key]);
    await prisma.epic.update({
      where: { id: epicId },
      data: {
        backendLogicAudioS3ObjectKey: null,
        backendLogicAudioRecordedTime: null,
      },
    });
    return respond(200, {
      success: 'Backend logic audio file deleted successfully',
    });
  } catch (error) {
    console.error('Backend logic audio file deletion failed:', error);
    return respond(500, { serverError: (error as Error).message });
  }
}
