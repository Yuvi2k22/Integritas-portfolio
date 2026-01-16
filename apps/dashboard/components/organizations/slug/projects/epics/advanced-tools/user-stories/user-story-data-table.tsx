/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { toast } from '@workspace/ui/components/sonner';

import { updateUserStoriesBulk } from '~/actions/user-stories/bulk-update-user-story';
import { updateChecklistItem } from '~/actions/user-stories/check-list-update';
import { updateUserStory } from '~/actions/user-stories/update-user-story';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganizationMembers } from '~/hooks/use-active-organization-members';
import { useActiveProject } from '~/hooks/use-active-project';
import { UserStoryDto } from '~/types/dtos/user-story-dto';
import { DeleteUserStoryDialog } from './delete-user-story-dialog';
import { CreateUserStoryDialog } from './upsert-user-story-dialog';
import StoriesTable, { UpadteCheckListItem } from './user-story-table';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

export type CheckListItems = {
  id: string;
  name: string;
  orderIndex: number;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  userStoryId?: string;
};
export type UserStory = {
  dueDate?: Date;
  id: string;
  name: string;
  description: string;
  storyPoints: number;
  completed: boolean;
  orderIndex?: number;
  acceptanceCriteria?: string;
  createdAt?: string;
  updatedAt?: string;
  assignees?: any;
  checkListItems?: CheckListItems[];
};
interface UserStoryTableProps {
  userStories: UserStoryDto[];
}
export default function UserStoriesTable({ userStories }: UserStoryTableProps) {
  const [stories, setStories] = useState<UserStory[]>([]);
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();
  const activeMembers = useActiveOrganizationMembers();
  useEffect(() => {
    const user_story = userStories;
    if (user_story.length) {
      setStories(user_story as UserStory[]);
    }
  }, [userStories]);

  const handleUpdateCheckList = async (
    userStoryId: string,
    checkList: UpadteCheckListItem,
  ) => {
    const result = await updateChecklistItem({ userStoryId, checkList });
    if (result?.serverError && result?.validationErrors) {
      toast.error(`Can't update checklist`, userStoryToastPosition);
    }
  };
  const updateUserStoryDetails = async (story: UserStory, type?: string) => {
    const data: any = {
      projectId: activeProject.id,
      epicId: activeEpic.id,
      userStoryId: story?.id as string,
    };
    if (type === 'points') {
      data.storyPoints = story.storyPoints;
    }
    if (type === 'status') {
      data.completed = story.completed;
    }
    if (type === 'date' && story.dueDate) {
      data.dueDate = story.dueDate.toISOString();
    }
    if (type === 'assignee') {
      data.assignees = story.assignees.map(
        (assigne: { membershipId: string; name: string }) => ({
          id: assigne.membershipId,
        }),
      );
    }
    if (type === 'acceptanceCriteria') {
      data.acceptanceCriteria = story.acceptanceCriteria;
    }

    const result = await updateUserStory(data);
    if (!result?.serverError && !result?.validationErrors) {
      toast.success(`User story updated successfully`, userStoryToastPosition);
    } else {
      toast.error(`Can't update user story`, userStoryToastPosition);
    }
  };

  const updateStoryAndNotify = (
    storyId: string,
    update?: Partial<UserStory>,
    updateType?: string,
  ) => {
    setStories(
      stories.map((story) => {
        if (story.id !== storyId) return story;
        const updatedStory = { ...story, ...update };
        updateUserStoryDetails(updatedStory, updateType);
        return updatedStory;
      }),
    );
  };

  const handleStatusChange = (storyId: string, newStatus: boolean) => {
    updateStoryAndNotify(storyId, { completed: newStatus }, 'status');
  };

  const handleAssigneeChange = (
    storyId: string,
    assignee: { name: string; membershipId: string },
  ) => {
    const currentStory = stories.find((story) => story.id === storyId);
    if (currentStory?.assignees?.[0]?.membershipId !== assignee.membershipId) {
      updateStoryAndNotify(storyId, { assignees: [assignee] }, 'assignee');
    }
  };

  const handleDueDateChange = (storyId: string, date: Date | undefined) => {
    updateStoryAndNotify(storyId, { dueDate: date }, 'date');
  };

  const handleStoryPointsChange = (storyId: string, points: string) => {
    const numericPoints = Number(points);
    if (isNaN(numericPoints) || numericPoints < 0) return;
    const currentUserStory = userStories.find((story) => story.id == storyId);

    if (currentUserStory?.storyPoints !== numericPoints) {
      updateStoryAndNotify(storyId, { storyPoints: numericPoints }, 'points');
    }
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const newStories = [...stories];
    const draggedItem = newStories[dragIndex];
    // Remove the dragged item
    newStories.splice(dragIndex, 1);
    // Insert it at the new position
    newStories.splice(hoverIndex, 0, draggedItem);
    const updatedStories = newStories.map((story, index) => ({
      ...story,
      orderIndex: index,
    }));
    setStories(updatedStories);
  };

  const handleEditDetailsModal = (selectedStory: UserStory) => {
    if (selectedStory) {
      const newStories = stories.map((data) =>
        data.id === selectedStory.id
          ? {
              ...selectedStory,
              description: selectedStory.description,
              checkListItems: selectedStory.checkListItems,
            }
          : data,
      );
      setStories(newStories);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    NiceModal.show(DeleteUserStoryDialog, {
      userStoryId: storyId,
      projectId: activeProject.id,
      epicId: activeEpic.id,
    });
  };

  const handleEditUserStory = async (story: UserStory) => {
    NiceModal.show(CreateUserStoryDialog, {
      projectId: activeProject.id,
      epicId: activeEpic.id,
      story,
      type: 'update',
    });
  };
  const handleDragComplete = async () => {
    const data = stories.map((story) => ({
      ...story,
      projectId: activeProject.id,
      epicId: activeEpic.id,
      userStoryId: story.id,
    }));
    const result = await updateUserStoriesBulk(data);
    if (!result?.serverError && !result?.validationErrors) {
      toast.success(`User story updated successfully`, userStoryToastPosition);
    } else {
      toast.error(`Can't update user story`, userStoryToastPosition);
    }
  };
  return (
    <div>
      <StoriesTable
        stories={stories}
        onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
        onDueDateChange={handleDueDateChange}
        onStoryPointsChange={handleStoryPointsChange}
        onReorder={handleReorder}
        onEditDetailsModal={handleEditDetailsModal}
        onDeleteUserStory={handleDeleteStory}
        onEditUserStory={handleEditUserStory}
        loader={false}
        members={activeMembers}
        onDragComplete={handleDragComplete}
        onUpdateCheckListItem={handleUpdateCheckList}
        onAcceptanceCriteriaUpdate={updateUserStoryDetails}
      />
    </div>
  );
}
