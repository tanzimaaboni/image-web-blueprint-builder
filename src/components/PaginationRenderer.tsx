
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface PaginationRendererProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationRenderer: React.FC<PaginationRendererProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        )}
        
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          let pageNumber: number;
          
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
            if (i === 4) return (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
            if (i === 0) return (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else {
            if (i === 0) {
              return (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                </PaginationItem>
              );
            } else if (i === 1) {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else if (i === 3) {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else if (i === 4) {
              return (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
              );
            }
            pageNumber = currentPage + (i - 2);
          }
          
          return (
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={pageNumber === currentPage} 
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationRenderer;
