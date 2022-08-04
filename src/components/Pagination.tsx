import React from 'react';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { ChevronLeft, ChevronRight } from 'styled-icons/entypo';

const Pagination: React.FC<{
  rows: number;
  rowsPerPage: number;
  page: number;
  className?: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ rows, rowsPerPage, page, setPage, className }) => {
  let pageNumbers = [];
  const TOTAL_PAGE = Math.ceil(rows / rowsPerPage);

  const rightPage = () => {
    console.log(TOTAL_PAGE);
    if (TOTAL_PAGE > page + 1) {
      setPage(page + 1);
    }
  };

  const leftPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  if (page < 4) {
    let addedPages = 0;
    for (let i = 1; i <= TOTAL_PAGE && addedPages <= 3; i++) {
      if (i !== TOTAL_PAGE) pageNumbers.push(i);
      addedPages++;
    }
    pageNumbers.push(TOTAL_PAGE);
  } else if (page > TOTAL_PAGE) {
    pageNumbers = [1];
    for (let i = TOTAL_PAGE - 3; i <= TOTAL_PAGE; i++) {
      if (i !== TOTAL_PAGE) pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (page + 1 == TOTAL_PAGE) {
      if (page - 2 !== 1) pageNumbers.push(page - 2);
      pageNumbers.push(page - 1);
      pageNumbers.push(page);
      pageNumbers.push(page + 1);
    } else {
      pageNumbers.push(page - 1);
      pageNumbers.push(page);
      pageNumbers.push(page + 1);
      pageNumbers.push(TOTAL_PAGE);
    }
  }
  return (
    <div id="pagination" className={`${className}`}>
      <button
        className="hover:text-gray-500 transition-all"
        onClick={() => leftPage()}
      >
        <ChevronLeft size="24" />
      </button>
      {pageNumbers.map((number, index) => (
        <button
          key={index}
          className={`text-lg w-8 h-8 hover:bg-sky-500 hover:text-white transition-colors rounded-lg ${
            page === number - 1 && 'bg-sky-500 text-white'
          }`}
          onClick={() => setPage(number - 1)}
        >
          {number}
        </button>
      ))}
      <button
        className="hover:text-gray-500 transition-all"
        onClick={() => rightPage()}
      >
        <ChevronRight size="24" />
      </button>
    </div>
  );
};

export default Pagination;
