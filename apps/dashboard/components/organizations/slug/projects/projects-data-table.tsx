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
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { CenteredSpinner } from '@workspace/ui/components/spinner';

import { useTransitionContext } from '~/hooks/use-transition-context';
import { GetProjectsSortBy } from '~/schemas/projects/get-projects-schema';
import { ProjectDto } from '~/types/dtos/project-dto';
import { SortDirection } from '~/types/sort-direction';
import { DeleteProjectDialog } from './project/delete-project-dialog';
import { UpsertProjectDialog } from './project/upsert-project-dialog';
import { searchParams } from './projects-search-params';

const columnHelper = createColumnHelper<ProjectDto>();

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
              className={`z-50 text-center absolute hidden ${value.length > 20 ? 'w-[500px]' : 'w-full'} max-h-[400%] p-3 text-base text-white break-words transform -translate-x-1/2 bg-gray-900 rounded shadow-lg top-full left-1/2 group-hover:block overflow-y-auto`}
            >
              {value}
            </span>
          )}
        </div>
      );
    },
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
      const params = useParams<{ slug: string }>();
      const router = useRouter();
      const projectPageUrl = replaceRouteSlugs(
        routes.dashboard.organizations.slug.projects.project.Index,
        {
          [RouteSlugs.OrgSlug]: params.slug,
          [RouteSlugs.ProjectSlug]: row.original.id,
        },
      );

      const handleView = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        router.push(projectPageUrl);
      };
      const handleEdit = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        NiceModal.show(UpsertProjectDialog, { project: row.original });
      };
      const handleDelete = (ev: MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        NiceModal.show(DeleteProjectDialog, { project: row.original });
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="!text-destructive"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
];

type ProjectsDataTableProps = {
  data: ProjectDto[];
  totalCount: number;
};

export function ProjectsDataTable({
  data,
  totalCount,
}: ProjectsDataTableProps) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
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
          sortBy: newSorting[0].id as GetProjectsSortBy,
          sortDirection: newSorting[0].desc
            ? SortDirection.Desc
            : SortDirection.Asc,
        });
      } else {
        setSorting({
          sortBy: GetProjectsSortBy.CreatedAt,
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

  // Event Handlers

  const handleRowClicked = (row: Row<ProjectDto>): void => {
    const projectPageUrl = replaceRouteSlugs(
      routes.dashboard.organizations.slug.projects.project.Index,
      {
        [RouteSlugs.OrgSlug]: params.slug,
        [RouteSlugs.ProjectSlug]: row.original.id,
      },
    );

    router.push(projectPageUrl);
  };

  return (
    <div className="relative flex flex-col overflow-hidden border rounded-lg">
      <ScrollArea verticalScrollBar horizontalScrollBar className="h-full">
        <DataTable
          fixedHeader
          table={table}
          wrapperClassName="h-[75vh]"
          onRowClicked={handleRowClicked}
        />
      </ScrollArea>
      <DataTablePagination table={table} />
      {isLoading && <CenteredSpinner />}
    </div>
  );
}
