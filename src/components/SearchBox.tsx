import { ReactElement, useState, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";

export interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    matchCount: number;
    placeholder?: string;
    debounceMs?: number;
}

export function SearchBox({
    value,
    onChange,
    matchCount,
    placeholder = "Search JSON...",
    debounceMs = 300
}: SearchBoxProps): ReactElement {
    const [localValue, setLocalValue] = useState(value);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync local value with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        // Debounce the actual search
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            onChange(newValue);
        }, debounceMs);
    }, [onChange, debounceMs]);

    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange("");
        inputRef.current?.focus();
    }, [onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClear();
        }
    }, [handleClear]);

    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return (
        <div className="djv-search-box">
            <div className="djv-search-input-wrapper">
                <SearchIcon />
                <input
                    ref={inputRef}
                    type="text"
                    className="djv-search-input"
                    value={localValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label="Search JSON"
                />
                {localValue && (
                    <button
                        className="djv-search-clear"
                        onClick={handleClear}
                        title="Clear search"
                        aria-label="Clear search"
                    >
                        <ClearIcon />
                    </button>
                )}
            </div>

            {localValue && (
                <div className={classNames("djv-search-results", {
                    "djv-no-results": matchCount === 0
                })}>
                    {matchCount === 0 ? (
                        <span>No matches found</span>
                    ) : (
                        <span>{matchCount} {matchCount === 1 ? "match" : "matches"} found</span>
                    )}
                </div>
            )}
        </div>
    );
}

function SearchIcon(): ReactElement {
    return (
        <svg
            className="djv-icon djv-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function ClearIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export default SearchBox;
