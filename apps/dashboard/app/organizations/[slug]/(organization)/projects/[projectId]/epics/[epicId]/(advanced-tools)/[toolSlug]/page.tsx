import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { AdvancedTool } from '~/components/organizations/slug/projects/epics/advanced-tools/common/advanced-tool';
import { getAdvancedTool } from '~/data/advanced-tools/get-advanced-tool';
import { getAdvancedToolContents } from '~/data/advanced-tools/get-advanced-tool-contents';
import { TransitionProvider } from '~/hooks/use-transition-context';
import { createTitle } from '~/lib/formatters';

const dedupedGetAdvancedTool = React.cache(getAdvancedTool);

const paramsCache = createSearchParamsCache({
  projectId: parseAsString.withDefault(''),
  epicId: parseAsString.withDefault(''),
  toolSlug: parseAsString.withDefault(''),
});

export async function generateMetadata({
  params,
}: NextPageProps): Promise<Metadata> {
  const { toolSlug } = await paramsCache.parse(params);

  if (toolSlug) {
    const advancedTool = await dedupedGetAdvancedTool({
      slug: toolSlug,
    });
    if (advancedTool) {
      return {
        title: createTitle(advancedTool.name),
        description: advancedTool.description,
      };
    }
  }

  return {
    title: createTitle('Advanced Tool'),
  };
}

export default async function AdvancedToolPage({ params }: NextPageProps) {
  const { epicId, toolSlug } = await paramsCache.parse(params);

  const advancedTool = await dedupedGetAdvancedTool({
    slug: toolSlug,
  });
  if (!advancedTool) return notFound();

  const generatedContents = await getAdvancedToolContents({
    epicId,
    toolId: advancedTool.id,
  });
  return (
    <TransitionProvider>
      <div className="flex flex-row h-screen overflow-auto">
        <div className="size-full">
          <AdvancedTool
            tool={advancedTool}
            generatedContent={
              generatedContents.length !== 0 ? generatedContents[0].content : ''
            }
            reGenerateCount={
              generatedContents.length !== 0 &&
              generatedContents[0].reGenerateCount
                ? generatedContents[0].reGenerateCount
                : 0
            }
          />
        </div>
      </div>
    </TransitionProvider>
  );
}
