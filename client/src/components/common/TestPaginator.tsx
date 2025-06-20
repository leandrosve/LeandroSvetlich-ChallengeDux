'use client'
import { Paginator } from "primereact/paginator";
import React from "react";

const TestPaginator = () => {
  return (
    <Paginator
      className="mt-auto"
      first={(1- 1) * 10}
      rows={10}
      totalRecords={100}
      rowsPerPageOptions={[10, 20, 30]}
    />
  );
};

export default TestPaginator;
