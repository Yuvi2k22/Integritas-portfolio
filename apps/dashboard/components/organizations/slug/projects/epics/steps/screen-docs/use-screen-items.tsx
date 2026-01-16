import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useImmer } from 'use-immer';

import { apiRoutes } from '@workspace/routes';

import { StorageKeys } from '~/config/storage-keys';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { DesignFileDto } from '~/types/dtos/design-file-dto';

export type ScreenItemType = {
  subFiles: Array<
    {
      isGenerating: boolean;
      isGenerationCompleted: boolean;
    } & DesignFileDto
  >;
  isGenerating: boolean;
  isGenerationCompleted: boolean;
} & DesignFileDto;

export function useScreenItems() {
  const router = useRouter();
  const activeOrganization = useActiveOrganization();
  const activeProject = useActiveProject();
  const activeEpic = useActiveEpic();

  const [screenItems, setScreenItems] = useImmer<ScreenItemType[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState<boolean>(false);

  /**
   * Mark a mainscreen or subscreen as generating currently.
   * @param mainScreenId id of mainscreen
   * @param subScreenId id of subscreen that belongs to a mainscreen
   */
  const markGenerating = (mainScreenId: string, subScreenId?: string) => {
    setScreenItems((screenItems) => {
      const mainScreen = screenItems.find(
        (screenItem) => screenItem.id === mainScreenId
      );

      if (!mainScreen) return;
      if (subScreenId) {
        const subScreen = mainScreen.subFiles.find(
          (subScreen) => subScreen.id === subScreenId
        );

        if (!subScreen) return;
        subScreen.isGenerating = true;
      } else {
        mainScreen.isGenerating = true;
      }
    });
  };

  /**
   * Mark a mainscreen or subscreen as generation completed.
   * @param mainScreenId id of mainscreen
   * @param subScreenId id of subscreen that belongs to a mainscreen
   */
  const markGenerationCompleted = (
    mainScreenId: string,
    subScreenId?: string
  ) => {
    setScreenItems((screenItems) => {
      const mainScreen = screenItems.find(
        (screenItem) => screenItem.id === mainScreenId
      );

      if (!mainScreen) return;
      if (subScreenId) {
        const subScreen = mainScreen.subFiles.find(
          (subScreen) => subScreen.id === subScreenId
        );

        if (!subScreen) return;
        subScreen.isGenerating = false;
        subScreen.isGenerationCompleted = true;
      } else {
        mainScreen.isGenerating = false;
        mainScreen.isGenerationCompleted = true;
      }
    });
  };

  /**
   * Update the design flow doc of a mainscreen or subscreen.
   * @param content content to be updated in designFlowDoc
   * @param mainScreenId id of mainscreen
   * @param subScreenId id of subscreen that belongs to mainscreen
   */
  const setScreenDoc = (
    content: string,
    mainScreenId: string,
    subScreenId?: string
  ) => {
    setScreenItems((screenItems) => {
      const mainScreen = screenItems.find(
        (screenItem) => screenItem.id === mainScreenId
      );

      if (!mainScreen) return;
      if (subScreenId) {
        const subScreen = mainScreen.subFiles.find(
          (subScreen) => subScreen.id === subScreenId
        );

        if (!subScreen) return;
        subScreen.designFlowDoc = content;
      } else {
        mainScreen.designFlowDoc = content;
      }
    });
  };

  /**
   * Generate content with AI for all screen for which content was not generated.
   */
  const generateAllScreens = async () => {
    const response = await fetch(apiRoutes.projects.epics.generateAllScreens, {
      method: 'POST',
      headers: { 'x-organization-slug': activeOrganization.slug },
      body: JSON.stringify({
        projectId: activeProject.id,
        epicId: activeEpic.id
      })
    });

    const streamReader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    if (streamReader) {
      // vars the keep of which screen is generating
      let currentMainScreenId: string | undefined,
        currentSubscreenId: string | undefined;

      setIsGeneratingAll(true);

      let content = '';

      while (true) {
        const { value, done } = await streamReader.read();

        // If value is json parse it and update generation data
        if (
          value?.trimStart().startsWith('{') &&
          value.trimEnd().endsWith('}')
        ) {
          const { mainScreenId, subScreenId } = JSON.parse(value);

          // if new generating screen is announced mark current screen as completed if current screen exist
          if (currentMainScreenId)
            markGenerationCompleted(currentMainScreenId, currentSubscreenId);

          // assign ids of new screen
          currentMainScreenId = mainScreenId;
          currentSubscreenId = subScreenId;

          // mark new screen as generating
          if (currentMainScreenId)
            markGenerating(currentMainScreenId, currentSubscreenId);

          // reset content for new content of new screen
          content = '';
        } else {
          if (value) {
            content += value;
            if (currentMainScreenId)
              setScreenDoc(content, currentMainScreenId, currentSubscreenId);
          }
        }

        if (done) {
          if (currentMainScreenId)
            markGenerationCompleted(currentMainScreenId, currentSubscreenId);
          setIsGeneratingAll(false);
          router.refresh();
          break;
        }
      }
    }
  };

  /**
   * Generate content for a screen (mainscreen / subscreen).
   * Provide mainScreenId for generating mainscreen and both mainScreenId as well as subScreenId for generating subscreen.
   * @param mainScreenId id of the mainscreen
   * @param subScreenId id of the subscreen that belongs to a mainscreen
   */
  const generateScreen = (mainScreenId: string, subScreenId?: string) => {};

  /**
   * Deletes a screen (mainscreen / subscreen).
   * Provide mainScreenId for deleting mainscreen and both mainScreenId as well as subScreenId for deleting subscreen
   * @param mainScreenId id of the mainscreen
   * @param subScreenId id of the subscreen that belongs to a mainscreen
   */
  const deleteScreen = (mainScreenId: string, subScreenId?: string) => {
    setScreenItems((screenItems) => {
      const mainScreen = screenItems.find(
        (mainScreen) => mainScreen.id === mainScreenId
      );
      if (mainScreen) {
        if (subScreenId)
          mainScreen.subFiles = mainScreen.subFiles.filter(
            (subScreen) => subScreen.id !== subScreenId
          );
        else
          return screenItems.filter(
            (mainScreen) => mainScreen.id !== mainScreenId
          );
      }
    });
  };

  /**
   * All hooks goes below
   */

  /**
   * Hook that fetches designFiles from active epic, reformats it to ScreenItemType array and updates state.
   */
  useEffect(() => {
    const designFiles = activeEpic.designFiles;
    if (designFiles && designFiles.length !== 0) {
      const screenItems: ScreenItemType[] = designFiles.map((designFile) => {
        const subFiles =
          designFile.subFiles?.map((subFile) => ({
            ...subFile,
            isGenerating: false,
            isGenerationCompleted: subFile.designFlowDoc !== ''
          })) || [];

        return {
          ...designFile,
          subFiles,
          isGenerating: false,
          isGenerationCompleted: designFile.designFlowDoc !== ''
        };
      });

      setScreenItems(screenItems);
    }
  }, [activeEpic.designFiles]);

  useEffect(() => {
    if (activeEpic && !isGeneratingAll) {
      const autoGenerateBefore = parseInt(
        sessionStorage.getItem(
          StorageKeys.AUTO_GENERATE_SCREEN_DOCS_BEFORE
        ) as string
      );

      if (!Number.isNaN(autoGenerateBefore) && Date.now() < autoGenerateBefore)
        generateAllScreens();
    }
  }, [activeEpic, isGeneratingAll]);

  return {
    screenItems,
    generateScreen,
    deleteScreen,
    generateAllScreens,
    isGeneratingAll
  };
}
