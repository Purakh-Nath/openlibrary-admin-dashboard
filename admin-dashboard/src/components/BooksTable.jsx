
import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import useBooks from '../hooks/useBooks';

// Utility functions
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add the headers to the CSV rows
  csvRows.push(headers.join(','));

  // Add the data to the CSV rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"'); // Escape quotes
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

const downloadCSV = (data, filename = 'data.csv') => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
};

const BooksTable = () => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [page, setPage] = useState(1);
  const [pageSizeLocal, setPageSizeLocal] = useState(10);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const { books, totalBooks, loading } = useBooks(page, pageSizeLocal, sortField, sortOrder);

  const columns = useMemo(() => [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Author Name', accessor: 'author_names[0]' },
    { Header: 'First Publish Year', accessor: 'first_publish_year' },
    { Header: 'Subject', accessor: 'subject' },
    { Header: 'Author Birth Date', accessor: 'author_birth_date' },
    { Header: 'Author Top Work', accessor: 'author_top_work' },
    { Header: 'Ratings Average', accessor: 'ratings_average' },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
        </div>
      ),
    },
  ], []);

  const handleEdit = (row) => {
    setEditingRow(row.index);
    setEditedValues(row.original);
  };

  const handleSave = () => {
    // Perform save operation here using editedValues
    console.log('Saving changes:', editedValues);
    setEditingRow(null);
    setEditedValues({});
  };

  const handleDownloadCSV = () => {
    downloadCSV(books, 'books.csv');
  };

  const tableInstance = useTable(
    {
      columns,
      data: books,
      initialState: { sortBy: [{ id: sortField, desc: sortOrder === 'desc' }] },
      manualSortBy: true,
      manualPagination: true,
      pageCount: Math.ceil(totalBooks / pageSizeLocal),
    },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize: tablePageSize, sortBy },
  } = tableInstance;

  const handleSort = (column) => {
    if (sortField === column.id) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column.id);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return <div className='text-center m-20 font-extrabold text-4xl text-slate-400'>Loading Data...</div>;
  }

  return (
    <div className='rounded-xl'>
      <button onClick={handleDownloadCSV} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded  border border-gray-100">
        Download CSV
      </button>
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 bg-slate-700 ">
        <thead className="bg-gray-400">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  onClick={() => handleSort(column)}
                  className="px-6 py-3 text-left text-xs  text-gray-950 font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  {column.render('Header')}
                  <span>
                    {sortField === column.id ? (sortOrder === 'asc' ? ' 🔼' : ' 🔽') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-slate-400 divide-y divide-gray-200">
          {tablePage.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  const cellProps = cell.getCellProps();
                  const { key, ...rest } = cellProps;
                  return (
                    <td key={key} {...rest} className="px-6 py-4 whitespace-nowrap font-medium">
                      {editingRow === row.index ? (
                        <input
                          type="text"
                          value={editedValues[cell.column.id] || ''}
                          onChange={(e) => setEditedValues({ ...editedValues, [cell.column.id]: e.target.value })}
                        />
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingRow !== null && (
        <div>
          <button onClick={handleSave} className="mt-4 px-4 py-2 bg-green-500 text-red rounded">
            Save
          </button>
        </div>
      )}

      <div className="pagination">
        <button className='text-green-400 text-2xl'  onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button className='text-3xl text-red-600' onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button className='text-3xl text-red-600' onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button className='text-green-400 text-2xl' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span className='text-xl text-fuchsia-400'>
          Page{' '}
          <strong className='text-xl text-fuchsia-500'>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={tablePageSize}
          onChange={e => setPageSizeLocal(Number(e.target.value))}
          className='text-xl text-neutral-950 font-light'
        >
          {[10, 20, 30, 40, 50,100].map(size => (
            <option key={size} value={size} className='text-blue-500 font-bold'>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BooksTable;

