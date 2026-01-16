'use client';

import { useState } from 'react';

import { TogglePointerEvents } from '@workspace/ui/components/pointer-control';
import { toast } from '@workspace/ui/components/sonner';

import { generateUserStories } from '~/actions/user-stories/generate-user-stories';
import { AdvancedToolGenerator } from '../common/advanced-tool-generator';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

interface UserStoryGeneratorProps {
  projectId: string;
  epicId: string;
}
export function UserStoryGenerator({
  projectId,
  epicId,
}: UserStoryGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const onGenerate = async () => {
    try {
      setLoading(true);
      TogglePointerEvents({
        pointerEventEnable: true,
        enableSpecificDataAttribute: 'user-story-generator',
      });

      const result = await generateUserStories({ projectId, epicId });

      if (!result?.serverError) {
        toast.success('User stories generated', userStoryToastPosition);
      }
    } catch (error) {
      console.error('User story generation failed:', error);
      toast.error("Can't generate user stories", userStoryToastPosition);
    } finally {
      setLoading(false);
      TogglePointerEvents({ pointerEventEnable: false });
    }
  };
  return (
    <div id="user-story-generator" className="h-full">
      <AdvancedToolGenerator
        toolName="User Story Generator"
        description="Generate user stories for your project based on project requirements and best practices."
        onGenerate={onGenerate}
        generateButtonName="User Stories"
        loading={loading}
      />
    </div>
  );
}
