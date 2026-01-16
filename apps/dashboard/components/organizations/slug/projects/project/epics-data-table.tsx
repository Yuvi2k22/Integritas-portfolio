'use client';

import { MouseEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import { Tier } from '@workspace/billing/tier';
import { replaceRouteSlugs, routes, RouteSlugs } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from '@workspace/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { EmptyText } from '@workspace/ui/components/empty-text';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { CenteredSpinner } from '@workspace/ui/components/spinner';
import { TableCell, TableRow } from '@workspace/ui/components/table';

import { useSessionRecording } from '~/app/posthog-provider';
import { getOrganizationEpicCount } from '~/data/organization/get-organization-epic-details';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { useTransitionContext } from '~/hooks/use-transition-context';
import { GetEpicsSortBy } from '~/schemas/epics/get-epics-schema';
import { EpicDto } from '~/types/dtos/epic-dto';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { SortDirection } from '~/types/sort-direction';
import { UpgradeToProDialog } from '../epics/advanced-tools/common/upgrade-to-pro-dialog';
import { DeleteEpicDialog } from '../epics/delete-epic-dialog';
import { searchParams } from '../epics/epics-search-params';
import { UpsertEpicDialog } from '../epics/upsert-epic-dialog';
import { EpicLimitReachedDialog } from './epic-limit-reached-dialog';
import { toast } from '@workspace/ui/components/sonner';

const columnHelper = createColumnHelper<EpicDto>();

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <div className="px-2 pl-4">
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: (info) => <div className="p-2 pl-4">{info.getValue()}</div>,
    enableHiding: false,
  }),
  columnHelper.accessor('description', {
    header: ({ column }) => (
      <div className="px-2 pr-4">
        <DataTableColumnHeader column={column} title="Description" />
      </div>
    ),
    cell: (info) => {
      const value = info.getValue();
      const tablevalue = value.length > 20 ? value.slice(0, 20) + '...' : value;
      return (
        <div className="relative p-2 pr-4 group">
          {tablevalue}
          {value && value.length > 20 && (
            <span
              className={`z-50 absolute hidden ${value.length > 20 ? 'w-[500px]' : 'w-full'} max-h-[400%] p-3 text-base text-white break-words transform -translate-x-1/2 bg-gray-900 rounded shadow-lg top-full left-1/2 group-hover:block overflow-y-auto`}
            >
              {value}
            </span>
          )}
        </div>
      );
    },
    enableHiding: false,
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <div className="px-2 pl-4">
        <DataTableColumnHeader column={column} title="Status" />
      </div>
    ),
    cell: (info) => <div className="p-2 pl-4">{info.getValue()}</div>,
    enableHiding: false,
  }),
  columnHelper.accessor('createdAt', {
    header: ({ column }) => (
      <div className="px-2">
        <DataTableColumnHeader column={column} title="Created Date" />
      </div>
    ),
    cell: (info) => (
      <div className="p-2">{info.getValue().toString().split('T')[0]}</div>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: ({ column }) => (
      <div className="px-2">
        <DataTableColumnHeader column={column} title="Last Modified" />
      </div>
    ),
    cell: (info) => (
      <div className="p-2">{info.getValue().toString().split('T')[0]}</div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    meta: { title: 'Actions' },
    header: ({ column }) => (
      <div className="px-2 pr-4">
        <DataTableColumnHeader column={column} title="Actions" />
      </div>
    ),
    cell: ({ row }) => {
      const params = useParams<{ slug: string; projectId: string }>();
      const router = useRouter();
      const activeOrganization = useActiveOrganization();
      const project = useActiveProject();

      const epicPageUrl = replaceRouteSlugs(
        routes.dashboard.organizations.slug.projects.project.epics.epic.Index,
        {
          [RouteSlugs.OrgSlug]: params.slug,
          [RouteSlugs.ProjectSlug]: params.projectId,
          [RouteSlugs.EpicSlug]: row.original.id,
        },
      );

      const handleView = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        router.push(epicPageUrl);
      };
      const handleEdit = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        NiceModal.show(UpsertEpicDialog, { epic: row.original, project });
      };
      const handleDelete = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        NiceModal.show(DeleteEpicDialog, { epic: row.original, project });
      };
      return (
        <div className="pr-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="ml-auto mr-4 flex size-8 data-[state=open]:bg-muted"
                onClick={(e) => e.stopPropagation()}
                title="Open menu"
              >
                <MoreHorizontalIcon className="size-4 shrink-0" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              {activeOrganization.tier === Tier.Pro && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="!text-destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
];

export type EpicsDataTableProps = {
  data: EpicDto[];
  totalCount: number;
  profile: ProfileDto;
};

export function EpicsDataTable(props: EpicsDataTableProps) {
  const { data, totalCount, profile } = props;

  const router = useRouter();
  const params = useParams<{ slug: string; projectId: string }>();
  const { isLoading, startTransition } = useTransitionContext();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useQueryStates(
    {
      sortBy: searchParams.sortBy,
      sortDirection: searchParams.sortDirection,
    },
    {
      history: 'push',
      startTransition,
      shallow: false,
    },
  );

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: searchParams.pageIndex,
      pageSize: searchParams.pageSize,
    },
    {
      history: 'push',
      startTransition,
      shallow: false,
    },
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: [
        {
          id: sorting.sortBy,
          desc: sorting.sortDirection === SortDirection.Desc,
        },
      ],
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount: Math.max(
      1,
      Math.ceil(totalCount / Math.max(1, pagination.pageSize)),
    ),
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    getRowId: (row, _relativeIndex, parent) => (parent ? parent.id : row.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(table.getState().sorting)
          : updaterOrValue;

      if (newSorting.length > 0) {
        setSorting({
          sortBy: newSorting[0].id as GetEpicsSortBy,
          sortDirection: newSorting[0].desc
            ? SortDirection.Desc
            : SortDirection.Asc,
        });
      } else {
        setSorting({
          sortBy: GetEpicsSortBy.CreatedAt,
          sortDirection: SortDirection.Desc,
        });
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
  });

  const NoEpicsFound = () => {
    const activeOrganization = useActiveOrganization();
    const activeProject = useActiveProject();
    const { startRecording } = useSessionRecording();

    const handleCreateEpic = async () => {
      const data = await getOrganizationEpicCount();
      if (data?.serverError) {
        toast.error('Failed to create feature. Please try again.');
        return;
      }
      const { organizationTier, epicsCount, members } = data;

      if (organizationTier === 'free' && epicsCount >= 1) {
        return NiceModal.show(UpgradeToProDialog, {
          message: 'create more than one feature',
          organizationName: activeOrganization.name,
          email: profile.email,
          organizationSlug: activeOrganization.slug,
        });
      }

      startRecording({
        email: profile.email,
        organizationName: activeOrganization.name,
        eventName: 'Feature create',
      });

      const maxEpics = members && members > 0 ? members * 5 : 5;
      if (organizationTier === 'pro' && epicsCount >= maxEpics) {
        return NiceModal.show(EpicLimitReachedDialog);
      }

      NiceModal.show(UpsertEpicDialog, { project: activeProject });
    };

    return (
      <TableRow className="!bg-transparent">
        <TableCell
          className="h-24 text-center"
          colSpan={table.getAllColumns().length}
        >
          <div className="flex gap-1 justify-center">
            <EmptyText>No features created yet.</EmptyText>
            <p
              className="text-blue-500 cursor-pointer"
              onClick={handleCreateEpic}
            >
              Create New Feature
            </p>
            <EmptyText>to get started!</EmptyText>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  // Event Handlers

  const handleRowClicked = (row: Row<EpicDto>): void => {
    const epicPageUrl = replaceRouteSlugs(
      routes.dashboard.organizations.slug.projects.project.epics.epic.Index,
      {
        [RouteSlugs.OrgSlug]: params.slug,
        [RouteSlugs.ProjectSlug]: params.projectId,
        [RouteSlugs.EpicSlug]: row.original.id,
      },
    );
    router.push(epicPageUrl);
  };

  return (
    <div className="relative flex flex-col overflow-hidden border rounded-lg">
      <ScrollArea verticalScrollBar horizontalScrollBar className="h-full">
        <DataTable
          fixedHeader
          table={table}
          wrapperClassName="h-[75vh]"
          onRowClicked={handleRowClicked}
          noResultsComponent={<NoEpicsFound />}
        />
      </ScrollArea>
      <DataTablePagination table={table} />
      {isLoading && <CenteredSpinner />}
    </div>
  );
}
