import { useState, useCallback, ReactElement } from "react";
import classNames from "classnames";
import {
    JsonValue,
    DataType,
    detectDataType
} from "../types";
import {
    formatDate,
    truncateString,
    copyToClipboard,
    highlightMatches
} from "../utils/jsonUtils";

export interface PrimitiveValueProps {
    value: JsonValue;
    showDataType: boolean;
    enableCopy: boolean;
    searchTerm: string;
    isMatch: boolean;
    onValueClick?: () => void;
}

const MAX_DISPLAY_LENGTH = 200;

export function PrimitiveValue({
    value,
    showDataType,
    enableCopy,
    searchTerm,
    isMatch,
    onValueClick
}: PrimitiveValueProps): ReactElement {
    const [copied, setCopied] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const dataType = detectDataType(value);
    const stringValue = formatValueForDisplay(value, dataType);
    const isLongValue = stringValue.length > MAX_DISPLAY_LENGTH;
    const displayValue = showFull ? stringValue : truncateString(stringValue, MAX_DISPLAY_LENGTH);

    const handleCopy = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (enableCopy) {
            const success = await copyToClipboard(stringValue);
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }
        }
    }, [enableCopy, stringValue]);

    const handleClick = useCallback(() => {
        if (onValueClick) {
            onValueClick();
        }
    }, [onValueClick]);

    const renderHighlightedValue = () => {
        if (!searchTerm || !isMatch) {
            return <span className="djv-value-text">{displayValue}</span>;
        }

        const highlights = highlightMatches(displayValue, searchTerm);
        return (
            <span className="djv-value-text">
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
    };

    return (
        <span
            className={classNames("djv-primitive", `djv-type-${dataType}`, {
                "djv-match": isMatch,
                "djv-copyable": enableCopy,
                "djv-clickable": !!onValueClick
            })}
            onClick={handleClick}
            title={enableCopy ? "Click to copy" : undefined}
        >
            {renderHighlightedValue()}

            {showDataType && (
                <span className={classNames("djv-type-badge", `djv-badge-${dataType}`)}>
                    {getDataTypeLabel(dataType)}
                </span>
            )}

            {isLongValue && (
                <button
                    className="djv-expand-text-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFull(!showFull);
                    }}
                >
                    {showFull ? "Show less" : "Show more"}
                </button>
            )}

            {enableCopy && (
                <button
                    className={classNames("djv-copy-btn", { "djv-copied": copied })}
                    onClick={handleCopy}
                    title="Copy value"
                >
                    {copied ? (
                        <CopyCheckIcon />
                    ) : (
                        <CopyIcon />
                    )}
                </button>
            )}
        </span>
    );
}

function formatValueForDisplay(value: JsonValue, dataType: DataType): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    switch (dataType) {
        case "date":
            return formatDate(value as string);
        case "boolean":
            return value ? "true" : "false";
        case "number":
            return String(value);
        case "string":
        case "url":
        case "email":
            return value as string;
        default:
            return String(value);
    }
}

function getDataTypeLabel(dataType: DataType): string {
    switch (dataType) {
        case "date":
            return "date";
        case "url":
            return "url";
        case "email":
            return "email";
        case "boolean":
            return "bool";
        case "number":
            return "num";
        case "string":
            return "str";
        case "null":
            return "null";
        default:
            return dataType;
    }
}

// Simple SVG icons
function CopyIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function CopyCheckIcon(): ReactElement {
    return (
        <svg
            className="djv-icon djv-icon-success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default PrimitiveValue;
