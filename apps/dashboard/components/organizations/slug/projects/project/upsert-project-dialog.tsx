'use client';

import { useRouter } from 'next/navigation';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { SubmitHandler } from 'react-hook-form';

import { replaceRouteSlugs, routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@workspace/ui/components/drawer';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { toast } from '@workspace/ui/components/sonner';
import { Textarea } from '@workspace/ui/components/textarea';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { upsertProject } from '~/actions/projects/upsert-project';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  UpsertProjectSchema,
  upsertProjectSchema
} from '~/schemas/projects/upsert-project-schema';
import { ProjectDto } from '~/types/dtos/project-dto';

export type CreateProjectDialogProps = NiceModalHocProps & {
  project?: ProjectDto;
};

export const UpsertProjectDialog = NiceModal.create<CreateProjectDialogProps>(
  (props) => {
    const { project } = props;
    const router = useRouter();
    const activeOrganization = useActiveOrganization();
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const methods = useZodForm({
      schema: upsertProjectSchema,
      mode: 'onSubmit',
      defaultValues: {
        name: project?.name ?? '',
        description: project?.description ? project.description : undefined
      }
    });

    const title = project ? 'Edit Project' : 'Create Project';
    const description = project
      ? 'Edit the project details'
      : 'Create a new contact by filling out the form below.';

    const canSubmit =
      !methods.formState.isSubmitting &&
      (!methods.formState.isSubmitted || methods.formState.isDirty);

    const onSubmit: SubmitHandler<UpsertProjectSchema> = async (values) => {
      if (!canSubmit) return;

      const result = await upsertProject({
        ...values,
        idToUpdate: project?.id
      });

      if (result?.data && !result?.serverError && !result?.validationErrors) {
        if (project) toast.success('Project details updated successfully');
        else {
          const createdProject = result.data;
          const epicUrl = replaceRouteSlugs(
            routes.dashboard.organizations.slug.projects.project.Index,
            {
              '[slug]': activeOrganization.slug,
              '[projectSlug]': createdProject.id
            }
          );

          router.push(epicUrl);
        }
        modal.handleClose();
      } else {
        if (project) toast.error("Can't update project details");
        else toast.error("Can't create project");
      }
    };

    const renderForm = (
      <form
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div>
            <FormLabel>Project Name</FormLabel>
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

          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Project Description</FormLabel>
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
      </form>
    );

    const renderButtons = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={modal.handleClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!canSubmit}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          {project ? 'Save' : 'Create'}
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
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="sr-only">
                  {description}
                </DialogDescription>
              </DialogHeader>
              {renderForm}
              <DialogFooter>{renderButtons}</DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer
            open={modal.visible}
            onOpenChange={modal.handleOpenChange}
          >
            <DrawerContent>
              <DrawerHeader className="mb-4 text-left">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {description}
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
  }
);
