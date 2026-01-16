'use client';

import { useRouter } from 'next/navigation';
import NiceModal, { NiceModalHocProps } from '@ebay/nice-modal-react';
import { ChevronDownIcon } from 'lucide-react';
import { SubmitHandler } from 'react-hook-form';

import { replaceRouteSlugs, routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@workspace/ui/components/collapsible';
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

import { upsertEpic } from '~/actions/epics/upsert-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  UpsertEpicSchema,
  upsertEpicSchema
} from '~/schemas/epics/upsert-epic-schema';
import { EpicDto } from '~/types/dtos/epic-dto';
import { ProjectDto } from '~/types/dtos/project-dto';

export type UpsertEpicDialogProps = NiceModalHocProps & {
  epic?: EpicDto;
  project: ProjectDto;
};

export const UpsertEpicDialog = NiceModal.create<UpsertEpicDialogProps>(
  (props) => {
    const { epic, project } = props;
    const router = useRouter();
    const activeOrganization = useActiveOrganization();
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const methods = useZodForm({
      schema: upsertEpicSchema,
      mode: 'onSubmit',
      defaultValues: {
        projectId: project.id,
        name: epic?.name ?? '',
        description: epic?.description ? epic.description : undefined,
        epicSpeciality: epic?.epicSpeciality ? epic.epicSpeciality : undefined,
        thirdpartyRequirements: epic?.thirdpartyRequirements
          ? epic.thirdpartyRequirements
          : undefined
      }
    });

    const title = epic ? 'Edit Feature' : 'Create Feature';
    const description = epic
      ? 'Edit the feature details'
      : 'Create a new feature by filling out the form below';

    const canSubmit =
      !methods.formState.isSubmitting &&
      (!methods.formState.isSubmitted || methods.formState.isDirty);

    const onSubmit: SubmitHandler<UpsertEpicSchema> = async (values) => {
      if (!canSubmit) return;

      const result = await upsertEpic({
        ...values,
        projectId: project.id,
        idToUpdate: epic?.id
      });

      if (result?.data && !result.serverError && !result.validationErrors) {
        modal.handleClose();
        if (epic) toast.success('Feature details updated successfully');
        else {
          const createdEpic = result.data;
          const epicUrl = replaceRouteSlugs(
            routes.dashboard.organizations.slug.projects.project.epics.epic
              .Index,
            {
              '[slug]': activeOrganization.slug,
              '[projectSlug]': project.id,
              '[epicSlug]': createdEpic.id
            }
          );

          router.push(epicUrl);
        }
      } else {
        if (epic) toast.error("Can't update Feature details");
        else toast.error("Can't create Feature");
      }
    };

    const renderForm = (
      <form
        className="space-y-6"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div>
            <FormLabel>Feature Name</FormLabel>
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
            <FormLabel>
              What does this product / feature do? (optional)
            </FormLabel>
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

          <Collapsible className="space-y-4">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm">
              <ChevronDownIcon className="w-4 h-4" />
              Advanced
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div>
                <FormLabel>
                  Why was this product / feature created? (optional)
                </FormLabel>
                <FormField
                  control={methods.control}
                  name="epicSpeciality"
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

              {/* <div>
                <FormLabel>
                  Which 3rd party integrations are needed for this product?
                  (optional)
                </FormLabel>
                <FormField
                  control={methods.control}
                  name="thirdpartyRequirements"
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
              </div> */}
            </CollapsibleContent>
          </Collapsible>
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
          {epic ? 'Save' : 'Create'}
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
