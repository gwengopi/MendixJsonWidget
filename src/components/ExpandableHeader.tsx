import { ReactElement, useCallback } from "react";
import classNames from "classnames";
import { highlightMatches } from "../utils/jsonUtils";

export interface ExpandableHeaderProps {
    keyName?: string;
    isExpanded: boolean;
    onToggle: () => void;
    itemCount?: number;
    showItemCount: boolean;
    type: "object" | "array";
    searchTerm: string;
    isKeyMatch: boolean;
    depth: number;
    arrayIndex?: number;
}

export function ExpandableHeader({
    keyName,
    isExpanded,
    onToggle,
    itemCount,
    showItemCount,
    type,
    searchTerm,
    isKeyMatch,
    depth,
    arrayIndex
}: ExpandableHeaderProps): ReactElement {
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle();
    }, [onToggle]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
        }
    }, [onToggle]);

    const renderKeyName = () => {
        if (arrayIndex !== undefined) {
            return (
                <span className="djv-array-index">[{arrayIndex}]</span>
            );
        }

        if (!keyName) return null;

        if (searchTerm && isKeyMatch) {
            const highlights = highlightMatches(keyName, searchTerm);
            return (
                <span className="djv-key">
                    {highlights.map((part, index) => (
                        <span key={index}>
                            {part.before}
                            {part.match && (
                                <mark className="djv-highlight">{part.match}</mark>
                            )}
                            {part.after}
                        </span>
                    ))}
                </span>
            );
        }

        return <span className="djv-key">{keyName}</span>;
    };

    return (
        <div
            className={classNames("djv-expandable-header", {
                "djv-expanded": isExpanded,
                "djv-collapsed": !isExpanded,
                "djv-key-match": isKeyMatch,
                [`djv-depth-${Math.min(depth, 5)}`]: true
            })}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
        >
            <span className="djv-expand-icon">
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </span>

            {renderKeyName()}

            {keyName && <span className="djv-separator">:</span>}

            <span className={classNames("djv-type-indicator", `djv-${type}`)}>
                {type === "object" ? "{" : "["}
            </span>

            {showItemCount && itemCount !== undefined && (
                <span className="djv-item-count">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
            )}

            {!isExpanded && (
                <span className={classNames("djv-type-indicator", `djv-${type}`)}>
                    {type === "object" ? "}" : "]"}
                </span>
            )}
        </div>
    );
}

function ChevronRightIcon(): ReactElement {
    return (
        <svg
            className="djv-icon djv-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function ChevronDownIcon(): ReactElement {
    return (
        <svg
            className="djv-icon djv-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export default ExpandableHeader;
