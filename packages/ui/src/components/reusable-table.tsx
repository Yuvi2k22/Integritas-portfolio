'use client';

import React from 'react';
import { Loader2Icon } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export interface Column<T> {
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
}

export interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loader?: boolean;
  rowRender?: (
    row: T,
    index: number,
    children: React.ReactNode,
  ) => React.ReactNode;
}

function ReusableTable<T>({
  columns,
  data,
  onRowClick,
  rowRender,
  loader = false,
}: ReusableTableProps<T>) {
  return (
    <div className="border rounded-md">
      <div className="max-h-[85vh] overflow-auto">
        <Table className="max-h-[85vh] block overflow-auto">
          <TableHeader className="sticky top-0 left-0 z-50 bg-gray-100 dark:bg-gray-800">
            <TableRow className="hover:bg-transparent">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={`${col.width || ''} dark:text-white`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loader ? (
              <TableRow
                key="loader"
                style={{ height: `${data?.length * 73}px` }}
              >
                <TableCell colSpan={columns.length} className="p-4">
                  <div
                    className="flex items-center justify-center w-full"
                    style={{ height: '100%' }}
                  >
                    <Loader2Icon className="animate-spin" size={24} />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => {
                const children = columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>{col.render(row)}</TableCell>
                ));
                const rowContent = rowRender ? (
                  rowRender(row, rowIndex, children)
                ) : (
                  <TableRow
                    key={rowIndex}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {children}
                  </TableRow>
                );

                return rowContent;
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ReusableTable;
