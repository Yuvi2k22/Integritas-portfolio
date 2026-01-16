'use client';

import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { SubmitHandler } from 'react-hook-form';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { toast } from '@workspace/ui/components/sonner';
import { Textarea } from '@workspace/ui/components/textarea';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { addUserStory } from '~/actions/user-stories/add-user-story';
import { updateUserStory } from '~/actions/user-stories/update-user-story';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  AddUserStorySchema,
  addUserStorySchema,
} from '~/schemas/user-stories/add-user-story-schema';
import {
  updateUserStorySchema,
  UpdateUserStorySchema,
} from '~/schemas/user-stories/update-user-story-schema';
import { UserStory } from './user-story-data-table';
import { userStoryToastPosition } from '~/helper-functions/toastPosition';

export type CreateUserStoryDialogProps = NiceModalHocProps & {
  projectId?: string;
  epicId?: string;
  story?: UserStory;
  type?: string;
};
export const CreateUserStoryDialog =
  NiceModal.create<CreateUserStoryDialogProps>((props) => {
    const { projectId, epicId, story, type = 'create' } = props;
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const methods = useZodForm({
      schema: type === 'create' ? addUserStorySchema : updateUserStorySchema,
      mode: 'onSubmit',
      defaultValues: {
        projectId,
        epicId,
        userStoryId: story?.id ?? '',
        name: story?.name ?? '',
        description: story?.description ?? '',
      },
    });

    const titleText = `${type === 'create' ? 'Create' : 'Edit'} User Story`;
    const descriptionText = `${type === 'create' ? 'Create' : 'Edit'} a new user story by filling out the form below`;
    const canSubmit =
      !methods.formState.isSubmitting &&
      (!methods.formState.isSubmitted || methods.formState.isDirty);

    const onSubmit: SubmitHandler<
      AddUserStorySchema | UpdateUserStorySchema
    > = async (values) => {
      if (!canSubmit) return;
      const result =
        type === 'create'
          ? await addUserStory({
              ...(values as AddUserStorySchema),
            })
          : await updateUserStory({
              ...values,
              userStoryId: story?.id as string,
            });
      if (!result?.serverError && !result?.validationErrors) {
        if (result)
          toast.success(
            `User story ${type === 'create' ? 'created' : 'updated'} successfully`,
            userStoryToastPosition,
          );
        modal.handleClose();
      } else {
        toast.error(
          `Can't ${type === 'create' ? 'create' : 'update'} user story`,
          userStoryToastPosition,
        );
      }
    };

    const renderForm = (
      <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <FormLabel>Name</FormLabel>
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <Input
                      disabled={methods.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel>Description</FormLabel>
            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <Textarea
                      disabled={methods.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    );

    const renderButtons = (
      <>
        <Button type="button" variant="outline" onClick={modal.handleClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!canSubmit}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          {type === 'create' ? 'Create' : 'Update'}
        </Button>
      </>
    );

    return (
      <FormProvider {...methods}>
        {mdUp ? (
          <Dialog open={modal.visible}>
            <DialogContent
              className="sm:max-w-[500px]"
              onClose={modal.handleClose}
              onAnimationEndCapture={modal.handleAnimationEndCapture}
            >
              <DialogHeader className="mb-4">
                <DialogTitle>{titleText}</DialogTitle>
                <DialogDescription className="sr-only">
                  {descriptionText}
                </DialogDescription>
              </DialogHeader>
              {renderForm}
              <DialogFooter>{renderButtons}</DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={modal.visible} onOpenChange={modal.handleOpenChange}>
            <DrawerContent>
              <DrawerHeader className="mb-4 text-left">
                <DrawerTitle>{titleText}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {descriptionText}
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4">{renderForm}</div>
              <DrawerFooter className="flex-col-reverse pt-4">
                {renderButtons}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </FormProvider>
    );
  });
