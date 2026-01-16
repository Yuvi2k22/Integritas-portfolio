'use client';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Loader, X } from 'lucide-react';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import React, { useState } from 'react';
import { addNotionProjectDatabase } from '~/actions/notion/add-notion-database';
import { useSetState } from '~/hooks/useSetState';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

type DatabaseOption = {
  id: string;
  name: string;
  properties: any;
};

export type SelectNotionDatabasesDialogProps = NiceModalHocProps & {
  databases: DatabaseOption[];
  projectId: string;
  epicId: string;
};

const checkRelationofDB = (
  targetId: string,
  property: { [x: string]: any },
) => {
  let firstRelation = null;

  for (const key in property) {
    const prop = property[key];
    if (
      prop.type === 'relation' &&
      prop.relation &&
      prop.relation.database_id === targetId
    ) {
      firstRelation = prop.id;
      break;
    }
  }

  // If no relation found, return false
  if (!firstRelation) {
    return false;
  }

  return {
    pageProjectId: firstRelation,
  };
};

export const SelectNotionDatabasesDialog =
  NiceModal.create<SelectNotionDatabasesDialogProps>(
    ({ databases, projectId, epicId }) => {
      const modal = useEnhancedModal();
      const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });

      const [epicDatabase, setEpicDatabase] = useState('');
      const [taskDatabase, setTaskDatabase] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [errors, setErrors] = useSetState({
        epicDatabase: '',
        taskDatabase: '',
        selectedDBNoRealtion: '',
      });

      const handleSubmit = async () => {
        const newErrors = {
          epicDatabase: epicDatabase ? '' : 'Epic database is required.',
          taskDatabase: taskDatabase ? '' : 'Task database is required.',
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((e) => e);
        if (hasErrors) return;
        setIsLoading(true);
        const newData: {
          notionDBId: string;
          notionDBName: string;
          epicDB: boolean;
          taskDB: boolean;
          pageTitleName?: string;
          pageProjectId?: string;
        }[] = [];
        const taskDBProperty = databases.find(
          (value) => value.id === taskDatabase,
        )?.properties;

        const checkRelationOfTaskAndEpicDB = checkRelationofDB(
          epicDatabase,
          taskDBProperty,
        );
        if (checkRelationOfTaskAndEpicDB) {
          databases.forEach((data) => {
            if (data.id == epicDatabase) {
              newData.push({
                notionDBId: data.id,
                notionDBName: data.name,
                epicDB: true,
                taskDB: false,
              });
            }
            if (data.id == taskDatabase) {
              newData.push({
                notionDBId: data.id,
                notionDBName: data.name,
                epicDB: false,
                taskDB: true,
                pageProjectId: checkRelationOfTaskAndEpicDB.pageProjectId,
              });
            }
          });
          const result = await addNotionProjectDatabase({
            projectId,
            epicId,
            notionDb: newData,
          });
          if (result?.data) {
            toast.success(
              'Notion integration completed',
              userStoryToastPosition,
            );
            modal.handleClose();
          } else {
            toast.error(
              'Notion integration failed!, Try again...',
              userStoryToastPosition,
            );
            modal.handleClose();
          }
        } else {
          setErrors({
            selectedDBNoRealtion:
              "Please ensure that a relation property is available on the task database - and points to the project database (that you've selected)",
          });
          toast.error(
            "Please ensure that a relation property is available on the task database - and points to the project database (that you've selected)",
            userStoryToastPosition,
          );
        }

        setIsLoading(false);
      };

      const handleEpicChange = (value: string) => {
        setEpicDatabase(value);
        if (errors.epicDatabase || errors.selectedDBNoRealtion) {
          setErrors({ epicDatabase: '', selectedDBNoRealtion: '' });
        }
      };

      const handleTaskChange = (value: string) => {
        setTaskDatabase(value);
        if (errors.taskDatabase || errors.selectedDBNoRealtion) {
          setErrors({ taskDatabase: '', selectedDBNoRealtion: '' });
        }
      };

      const filteredEpicOptions = databases.filter(
        (db) => db.id !== taskDatabase,
      );
      const filteredTaskOptions = databases.filter(
        (db) => db.id !== epicDatabase,
      );

      const renderForm = (
        <div className="mt-2 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Project Database
            </label>
            <div className="relative">
              <Select value={epicDatabase} onValueChange={handleEpicChange}>
                <SelectTrigger className={`w-full ${epicDatabase && 'pr-10'}`}>
                  <SelectValue placeholder="Select Project database" />
                </SelectTrigger>
                <SelectContent>
                  {filteredEpicOptions.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {epicDatabase && (
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-red-500"
                  onClick={() => setEpicDatabase('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {errors.epicDatabase && (
              <p className="mt-1 text-sm text-red-600">{errors.epicDatabase}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Task Database
            </label>
            <div className="relative">
              <Select value={taskDatabase} onValueChange={handleTaskChange}>
                <SelectTrigger className={`w-full ${taskDatabase && 'pr-10'}`}>
                  <SelectValue placeholder="Select Task database" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTaskOptions.map((db) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {taskDatabase && (
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-red-500"
                  onClick={() => setTaskDatabase('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {errors.taskDatabase && (
              <p className="mt-1 text-sm text-red-600">{errors.taskDatabase}</p>
            )}
          </div>
          {errors.selectedDBNoRealtion && (
            <p className="p-2 mt-1 text-sm text-red-600">
              {errors.selectedDBNoRealtion}
            </p>
          )}
        </div>
      );

      const title = 'Select Notion Databases';
      const description = '';
      const actions = (
        <>
          <Button variant="outline" onClick={modal.handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-[180px]"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              </>
            ) : (
              'Complete Integration'
            )}
          </Button>
        </>
      );

      return mdUp ? (
        <AlertDialog open={modal.visible}>
          <AlertDialogContent
            onClose={modal.handleClose}
            onAnimationEndCapture={modal.handleAnimationEndCapture}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            {renderForm}
            <AlertDialogFooter>{actions}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={modal.visible} onOpenChange={modal.handleOpenChange}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {renderForm}
            <DrawerFooter className="flex-col-reverse pt-4">
              {actions}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    },
  );
