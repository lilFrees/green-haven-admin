// src/components/Pagination.jsx
import React from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: any[] = [];
    const maxNeighbors = 1; // Number of neighboring pages to show around the current page

    // Always show the first page
    pages.push(1);

    // Show dots if currentPage is greater than maxNeighbors + 2
    if (currentPage > maxNeighbors + 2) {
      pages.push("...");
    }

    // Calculate start and end pages
    const startPage = Math.max(2, currentPage - maxNeighbors);
    const endPage = Math.min(totalPages - 1, currentPage + maxNeighbors);

    // Add the range of pages around the current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Show dots if currentPage is far from the last page
    if (currentPage < totalPages - maxNeighbors - 1) {
      pages.push("...");
    }

    // Always show the last page if it's not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={<FaChevronLeft />}
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      />
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={index}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? "solid" : "outline"}
            colorScheme={page === currentPage ? "green" : "gray"}
          >
            {page}
          </Button>
        ),
      )}
      <IconButton
        icon={<FaChevronRight />}
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      />
    </div>
  );
};

export default Pagination;
