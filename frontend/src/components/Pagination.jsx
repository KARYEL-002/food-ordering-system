import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}) => {
  if (totalPages <= 1 && (!pageSizeOptions || pageSizeOptions.length === 0)) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const handleKey = (e, p) => {
    if (e.key === 'Enter' || e.key === ' ') onPageChange(p);
  };

  return (
    <nav className="flex items-center justify-center gap-2 py-4" aria-label="Pagination Navigation">
      {pageSizeOptions && pageSizeOptions.length > 0 && (
        <div className="flex items-center gap-2 mr-4">
          <label style={{ color: '#704214' }} className="text-sm font-semibold">Rows:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded-lg border bg-white transform transition-transform duration-150 hover:scale-105"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border transform transition-transform duration-150 hover:scale-105 hover:shadow-md"
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          onKeyDown={(e) => handleKey(e, p)}
          className={`px-3 py-1 rounded-lg border transform transition-transform duration-150 ${p === currentPage ? 'bg-[#704214] text-white shadow-lg scale-100' : 'bg-white hover:scale-105 hover:shadow-md'}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border transform transition-transform duration-150 hover:scale-105 hover:shadow-md"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
