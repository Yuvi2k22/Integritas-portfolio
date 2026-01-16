'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Check,
  Edit3,
  GripVertical,
  MoreHorizontal,
  Trash2,
  User,
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Button } from '@workspace/ui/components/button';
import { Calendar as CalendarComponent } from '@workspace/ui/components/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { Input } from '@workspace/ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import ReusableTable, { Column } from '@workspace/ui/components/reusable-table';

import { MemberDto } from '~/types/dtos/member-dto';
import { StoryDetailsSidebar } from './story-details-sidebar';
import { CheckListItems, UserStory } from './user-story-data-table';

interface TeamMember {
  membershipId: string;
  name: string;
}
export type UpadteCheckListItem = {
  id?: string;
  name: string;
  orderIndex?: number;
  completed?: boolean;
};
interface StoriesTableProps {
  stories: UserStory[];
  onStatusChange: (storyId: string, newStatus: boolean) => void;
  onAssigneeChange: (
    storyId: string,
    assignee: { name: string; membershipId: string },
  ) => void;
  onDueDateChange: (storyId: string, date: Date | undefined) => void;
  onStoryPointsChange: (storyId: string, points: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onEditDetailsModal: (selectedStory: UserStory) => void;
  onDeleteUserStory: (storyId: string) => void;
  onEditUserStory: (story: UserStory) => void;
  loader: boolean;
  members: MemberDto[];
  onDragComplete: () => void;
  onUpdateCheckListItem: (
    storyId: string,
    checkList: UpadteCheckListItem,
  ) => void;
  onAcceptanceCriteriaUpdate: (story: UserStory, type?: string) => void;
}

const ItemTypes = {
  STORY: 'story',
};

const DraggableRow: React.FC<{
  story: UserStory;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onDragComplete: () => void; // New prop for drag completion callback
  children: React.ReactNode;
}> = ({ story, index, onReorder, onDragComplete, children }) => {
  const ref = React.useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STORY,
    item: { originalIndex: index, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop() && item.index !== item.originalIndex) {
        onDragComplete();
      }
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.STORY,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <tr
      ref={ref}
      style={{ opacity }}
      className="hover:bg-gray-50 dark:hover:bg-white/10"
    >
      {children}
    </tr>
  );
};

const StoriesTable: React.FC<StoriesTableProps> = ({
  stories,
  onStatusChange,
  onAssigneeChange,
  onDueDateChange,
  onStoryPointsChange,
  onReorder,
  onEditDetailsModal,
  onDeleteUserStory,
  onEditUserStory,
  loader,
  members,
  onDragComplete,
  onUpdateCheckListItem,
  onAcceptanceCriteriaUpdate,
}) => {
  const [openAssigneePopover, setOpenAssigneePopover] = useState<string | null>(
    null,
  );
  const [openDueDatePopover, setOpenDueDatePopover] = useState<string | null>(
    null,
  );
  const [selectedStory, setSelectedStory]: any = useState('');
  const [openActionsPopover, setOpenActionsPopover] = useState<string | null>(
    null,
  );
  const [teamMembers, setTeamMembers]: any = useState([]);
  useEffect(() => {
    if (members.length > 0) {
      const activeTeamMembers = members.map((member) => ({
        membershipId: member.membershipId,
        name: member.name,
      }));
      setTeamMembers(activeTeamMembers);
    }
  }, [members]);
  useEffect(() => {
    if (stories.length > 0 && selectedStory) {
      const updatedStory = stories.find(
        (story) => story.id === selectedStory.id,
      );
      setSelectedStory(updatedStory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories]);
  const handleAcceptanceCriteriaChange = (
    storyId: string,
    newDescription: string,
  ) => {
    if (selectedStory) {
      selectedStory.acceptanceCriteria = newDescription;
      setSelectedStory({ ...selectedStory });
    }
    onAcceptanceCriteriaUpdate(selectedStory, 'acceptanceCriteria');
  };
  function compareDates(utcTime: Date, localTime: Date): boolean {
    const utcDate = new Date(utcTime);
    const localDate = new Date(localTime);
    return utcDate.toDateString() === localDate.toDateString();
  }
  function isUtcDateBeforeToday(utcInput: Date | string | number): boolean {
    const utcDateOnly = new Date(utcInput);
    const now = new Date();
    const localStartOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return utcDateOnly.getTime() < localStartOfDay.getTime();
  }
  const columns: Column<UserStory>[] = [
    {
      header: '',
      width: 'w-[5%]',
      render: () => (
        <div className="cursor-grab">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      ),
    },
    {
      header: 'Story',
      width: 'w-[30%]',
      render: (story) => (
        <div
          className="text-base font-medium cursor-pointer pointer-events-auto text-primary hover:underline"
          onClick={() => setSelectedStory(story)}
        >
          {story.name}
        </div>
      ),
    },
    {
      header: 'Status',
      width: 'w-[15%]',
      render: (story) => (
        <Button
          variant={story.completed ? 'default' : 'outline'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(story.id, !story.completed);
          }}
          className="gap-2"
        >
          <Check
            className={`h-4 w-4 ${story.completed ? 'opacity-100' : 'opacity-50'}`}
          />
          {story.completed ? 'Completed' : 'Mark Complete'}
        </Button>
      ),
    },
    {
      header: 'Assignee',
      width: 'w-[15%]',
      render: (story) => (
        <Popover
          open={openAssigneePopover === story.id}
          onOpenChange={(open) => {
            if (open) {
              setOpenAssigneePopover(story.id);
            } else {
              setOpenAssigneePopover(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <User className="w-4 h-4" />
              {story?.assignees?.[0]
                ? teamMembers
                    ?.find(
                      (m: TeamMember) =>
                        m.membershipId === story.assignees[0].membershipId,
                    )
                    ?.name.split(' ')[0]
                    .replace(/\b\w/g, (char: string) => char.toUpperCase())
                : 'Assign'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right">
            <Command>
              <CommandInput placeholder="Search team member..." />
              <CommandList>
                <CommandEmpty>No team member found.</CommandEmpty>
                <CommandGroup>
                  {teamMembers.map((member: TeamMember) => (
                    <CommandItem
                      key={member.name}
                      onSelect={() => {
                        onAssigneeChange(story.id, {
                          name: member.name,
                          membershipId: member.membershipId,
                        });
                        setOpenAssigneePopover(null);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {member.name.replace(/\b\w/g, (char) =>
                        char.toUpperCase(),
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ),
    },
    {
      header: 'Due Date',
      width: 'w-[15%]',
      render: (story) => (
        <Popover
          open={openDueDatePopover === story.id}
          onOpenChange={(open) => {
            if (open) {
              setOpenDueDatePopover(story.id);
            } else {
              setOpenDueDatePopover(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${!story.completed && story.dueDate && isUtcDateBeforeToday(story?.dueDate) ? `bg-red-500 hover:bg-red-600` : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar className="w-4 h-4" />
              {story.dueDate
                ? format(story.dueDate, 'MMM d, yyyy')
                : 'Set Due Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={story.dueDate}
              onSelect={(date) => {
                if (
                  date &&
                  (!story?.dueDate || !compareDates(story.dueDate, date))
                ) {
                  onDueDateChange(story.id, date);
                }
                setOpenDueDatePopover(null);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ),
    },
    {
      header: 'Story Points',
      width: 'w-[20%]',
      render: (story) => (
        <Input
          type="number"
          min="0"
          placeholder="Points"
          value={
            !story.storyPoints
              ? '0'
              : story.storyPoints.toString().replace(/^0+/, '')
          }
          onChange={(e) => {
            e.stopPropagation();
            onStoryPointsChange(story.id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-24 number-incre-decre"
        />
      ),
    },
    {
      header: 'Actions',
      width: 'w-[5%]',
      render: (story) => (
        <Popover
          open={openActionsPopover === story.id}
          onOpenChange={(open) => {
            if (open) {
              setOpenActionsPopover(story.id);
            } else {
              setOpenActionsPopover(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right">
            <Command>
              <CommandList>
                <CommandItem
                  onSelect={() => {
                    onEditUserStory(story);
                    setOpenActionsPopover(null);
                  }}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onDeleteUserStory(story.id);
                    setOpenActionsPopover(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </CommandItem>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  const handleCloseStoryDetailsModal = () => {
    if (selectedStory) onEditDetailsModal(selectedStory);
    setSelectedStory(null);
  };
  const handleAddChecklistItem = (storyId: string, itemName: string) => {
    if (!selectedStory) return;
    const checkListLength = selectedStory?.checkListItems?.length;
    onUpdateCheckListItem(storyId, {
      name: itemName,
      completed: false,
      orderIndex:
        checkListLength > 0
          ? selectedStory?.checkListItems[checkListLength - 1].orderIndex + 1
          : 1,
    });
  };

  const handleEditChecklistItem = (
    storyId: string,
    itemId: string,
    itemName: string,
  ) => {
    if (!selectedStory) return;

    const item = selectedStory.checkListItems.find(
      (item: CheckListItems) => item.id === itemId,
    );
    onUpdateCheckListItem(storyId, { ...item, name: itemName });
  };
  const handleChecklistItemToggle = (
    storyId: string,
    itemId: string,
    checked: boolean,
  ) => {
    if (selectedStory?.checkListItems) {
      const item = selectedStory.checkListItems.find(
        (item: CheckListItems) => item.id === itemId,
      );
      onUpdateCheckListItem(storyId, { ...item, completed: checked });
    }
  };
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ReusableTable<UserStory>
          columns={columns}
          data={stories}
          loader={loader}
          rowRender={(story, index, children) => (
            <DraggableRow
              key={index}
              story={story}
              index={index}
              onReorder={onReorder}
              onDragComplete={onDragComplete}
            >
              {children}
            </DraggableRow>
          )}
        />
      </DndProvider>

      {/* Story Details Sidebar */}
      {selectedStory && (
        <StoryDetailsSidebar
          story={selectedStory}
          onClose={handleCloseStoryDetailsModal}
          onToggleChecklistItem={handleChecklistItemToggle}
          onAcceptanceCriteriaChange={handleAcceptanceCriteriaChange}
          onAddChecklistItem={handleAddChecklistItem}
          onEditChecklistItem={handleEditChecklistItem}
        />
      )}
    </>
  );
};

export default StoriesTable;
