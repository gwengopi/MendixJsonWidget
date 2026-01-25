import { ReactElement, useCallback, useMemo } from "react";
import classNames from "classnames";

export interface PaginationProps {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    totalItems,
    pageSize,
    currentPage,
    onPageChange
}: PaginationProps): ReactElement {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    const handlePrev = useCallback(() => {
        if (canGoPrev) {
            onPageChange(currentPage - 1);
        }
    }, [canGoPrev, currentPage, onPageChange]);

    const handleNext = useCallback(() => {
        if (canGoNext) {
            onPageChange(currentPage + 1);
        }
    }, [canGoNext, currentPage, onPageChange]);

    const handleFirst = useCallback(() => {
        onPageChange(0);
    }, [onPageChange]);

    const handleLast = useCallback(() => {
        onPageChange(totalPages - 1);
    }, [totalPages, onPageChange]);

    // Generate page numbers to show
    const pageNumbers = useMemo(() => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);

            if (currentPage > 2) {
                pages.push("ellipsis");
            }

            // Show pages around current
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 3) {
                pages.push("ellipsis");
            }

            // Always show last page
            pages.push(totalPages - 1);
        }

        return pages;
    }, [totalPages, currentPage]);

    if (totalPages <= 1) {
        return <span className="djv-pagination-info">{totalItems} items</span>;
    }

    return (
        <div className="djv-pagination">
            <span className="djv-pagination-info">
                {startItem}-{endItem} of {totalItems}
            </span>

            <div className="djv-pagination-controls">
                <button
                    className="djv-page-btn djv-page-first"
                    onClick={handleFirst}
                    disabled={!canGoPrev}
                    title="First page"
                >
                    <FirstPageIcon />
                </button>

                <button
                    className="djv-page-btn djv-page-prev"
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    title="Previous page"
                >
                    <PrevPageIcon />
                </button>

                <div className="djv-page-numbers">
                    {pageNumbers.map((page, index) =>
                        page === "ellipsis" ? (
                            <span key={`ellipsis-${index}`} className="djv-page-ellipsis">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                className={classNames("djv-page-number", {
                                    "djv-page-active": page === currentPage
                                })}
                                onClick={() => onPageChange(page)}
                            >
                                {page + 1}
                            </button>
                        )
                    )}
                </div>

                <button
                    className="djv-page-btn djv-page-next"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    title="Next page"
                >
                    <NextPageIcon />
                </button>

                <button
                    className="djv-page-btn djv-page-last"
                    onClick={handleLast}
                    disabled={!canGoNext}
                    title="Last page"
                >
                    <LastPageIcon />
                </button>
            </div>
        </div>
    );
}

// SVG Icons
function FirstPageIcon(): ReactElement {
    return (
        <svg className="djv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
        </svg>
    );
}

function PrevPageIcon(): ReactElement {
    return (
        <svg className="djv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function NextPageIcon(): ReactElement {
    return (
        <svg className="djv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function LastPageIcon(): ReactElement {
    return (
        <svg className="djv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
        </svg>
    );
}

export default Pagination;
