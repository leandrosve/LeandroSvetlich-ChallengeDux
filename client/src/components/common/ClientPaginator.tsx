'use client'
import { Paginator } from "primereact/paginator";
import React from "react";

interface Props {
    page: number;
    pageSize:number;
    totalCount:number;
    rowsPerPageOptions: number[];
    onPageChange: (page: number, pageSize:number) => void;
}

const ClientPaginator = ({page, pageSize,  totalCount, rowsPerPageOptions, onPageChange}:Props) => {
  return (
    <Paginator
      className="mt-auto"
      first={(page - 1) * pageSize}
      rows={pageSize}
      totalRecords={totalCount}
      rowsPerPageOptions={rowsPerPageOptions}
      onPageChange={(e) => onPageChange(e.page, e.rows)}
    />
  );
};

export default ClientPaginator;
