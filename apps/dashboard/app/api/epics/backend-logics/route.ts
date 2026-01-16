import { NextRequest, NextResponse } from 'next/server';
import {
  validateAuthContext,
  validateProjectAndEpic,
} from '~/lib/utils/api/validations';
import { baseBackendLogicsSchema } from '~/schemas/epics/backend-logics-schema';
import { EpicStatus } from '@workspace/database';
import { prisma } from '@workspace/database/client';
import {
  audioUploadToS3,
  distributeTranscription,
  extractTranscriptionFromUrl,
  respond,
  TranscriptionItem,
  updateDesignFilesWithTranscriptions,
} from './helper';
import { getAuthOrganizationContext } from '@workspace/auth/context';
import { checkSession } from '@workspace/auth/session';
interface UpdateData {
  backendLogicAudioTranscription: string;
  backendLogicGeneralTranscription?: string;
}
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
      totalAudio: formData.get('totalAudio') ?? undefined,
      audio: formData.get('audio') ?? undefined,
      text: formData.get('text')?.toString(),
      projectId: formData.get('projectId')?.toString(),
      epicId: formData.get('epicId')?.toString(),
      audioRecordedTime: formData.get('audioRecordedTime')?.toString(),
      langCode: formData.get('langCode')?.toString(),
    };

    const {
      audio,
      text,
      projectId,
      epicId,
      audioRecordedTime,
      langCode,
      totalAudio,
    } = baseBackendLogicsSchema.parse(data);
    const { epic } = await validateProjectAndEpic(projectId, epicId);
    if (audio || text) {
      if (audio && langCode) {
        const s3ObjectKeyUrl = await audioUploadToS3(
          ctx.organization.id,
          projectId,
          epic.id,
          audio,
        );
        if (!s3ObjectKeyUrl) {
          return respond(400, { serverError: 'S3 upload error' });
        }
        const audioUrl = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN}/${s3ObjectKeyUrl}`;
        const newAudioTranscription = await extractTranscriptionFromUrl(
          audioUrl,
          langCode,
        );
        if (totalAudio) {
          await audioUploadToS3(
            ctx.organization.id,
            projectId,
            epic.id,
            totalAudio,
          );
        }
        if (!newAudioTranscription) {
          return respond(400, { serverError: 'Audio transcription error' });
        }
        const combinedTranscription = epic.backendLogicAudioTranscription
          ? `${epic.backendLogicAudioTranscription}\n${newAudioTranscription}`
          : newAudioTranscription;
        await prisma.epic.update({
          where: { id: epicId },
          data: {
            backendLogicAudioTranscription: combinedTranscription,
            backendLogicAudioRecordedTime: audioRecordedTime,
          },
        });
        return respond(200, {
          audioTranscription: combinedTranscription,
          key: s3ObjectKeyUrl,
        });
      }

      if (!text) {
        return respond(400, { serverError: 'No transcription found' });
      }
      const {
        screens,
        general,
      }: { screens: TranscriptionItem[]; general: string | null } =
        await distributeTranscription(epic.id, text);

      if (screens.length) {
        await updateDesignFilesWithTranscriptions(screens);
      }

      const updateData: UpdateData = {
        backendLogicAudioTranscription: text,
      };

      if (general) updateData.backendLogicGeneralTranscription = general;

      await prisma.epic.update({ where: { id: epicId }, data: updateData });
    }

    if (epic.status === EpicStatus.AI_ANALYSIS_COMPLETED) {
      await prisma.epic.update({
        where: { id: epicId },
        data: { status: EpicStatus.BACKEND_LOGICS_COMPLETED },
      });
    }

    return respond(200, { success: true });
  } catch (error) {
    console.error('Transcription error:', error);
    return respond(500, { serverError: (error as Error).message });
  }
}
