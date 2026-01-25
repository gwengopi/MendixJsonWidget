/**
 * Utility functions for JSON parsing, searching, and manipulation
 */

import {
    JsonValue,
    isJsonObject,
    isJsonArray,
    SearchMatch,
    ExpandState
} from "../types";

/**
 * Safely parse JSON string with error handling
 */
export function safeParseJson(jsonString: string): {
    success: boolean;
    data?: JsonValue;
    error?: string;
} {
    if (!jsonString || jsonString.trim() === "") {
        return {
            success: false,
            error: "Empty JSON string"
        };
    }

    try {
        const data = JSON.parse(jsonString);
        return { success: true, data };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown parsing error";
        return {
            success: false,
            error: `JSON Parse Error: ${errorMessage}`
        };
    }
}

/**
 * Generate a unique path for a JSON node
 */
export function generatePath(basePath: string, key: string | number): string {
    if (basePath === "") {
        return String(key);
    }
    if (typeof key === "number") {
        return `${basePath}[${key}]`;
    }
    return `${basePath}.${key}`;
}

/**
 * Count items in an object or array
 */
export function countItems(value: JsonValue): number {
    if (isJsonArray(value)) {
        return value.length;
    }
    if (isJsonObject(value)) {
        return Object.keys(value).length;
    }
    return 0;
}

/**
 * Format a value for display
 */
export function formatValue(value: JsonValue): string {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (isJsonArray(value)) return `Array(${value.length})`;
    if (isJsonObject(value)) return `Object(${Object.keys(value).length})`;
    return String(value);
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch {
        return dateString;
    }
}

/**
 * Truncate a long string for display
 */
export function truncateString(str: string, maxLength: number = 100): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
}

/**
 * Search for a term in JSON and return matching paths
 */
export function searchJson(
    data: JsonValue,
    searchTerm: string,
    basePath: string = ""
): SearchMatch[] {
    const matches: SearchMatch[] = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    function searchRecursive(value: JsonValue, path: string, keyName?: string): void {
        // Check if key matches
        if (keyName && keyName.toLowerCase().includes(lowerSearchTerm)) {
            matches.push({
                path,
                key: keyName,
                matchType: "key"
            });
        }

        // Check if value matches (for primitives)
        if (value !== null && !isJsonObject(value) && !isJsonArray(value)) {
            const stringValue = String(value).toLowerCase();
            if (stringValue.includes(lowerSearchTerm)) {
                const existing = matches.find(m => m.path === path);
                if (existing) {
                    existing.value = String(value);
                    existing.matchType = "both";
                } else {
                    matches.push({
                        path,
                        value: String(value),
                        matchType: "value"
                    });
                }
            }
        }

        // Recurse into objects
        if (isJsonObject(value)) {
            Object.entries(value).forEach(([key, val]) => {
                const newPath = generatePath(path, key);
                searchRecursive(val, newPath, key);
            });
        }

        // Recurse into arrays
        if (isJsonArray(value)) {
            value.forEach((item, index) => {
                const newPath = generatePath(path, index);
                searchRecursive(item, newPath);
            });
        }
    }

    if (searchTerm.trim()) {
        searchRecursive(data, basePath);
    }

    return matches;
}

/**
 * Get all paths that should be expanded to show search matches
 */
export function getExpandedPathsForSearch(matches: SearchMatch[]): Set<string> {
    const paths = new Set<string>();

    matches.forEach(match => {
        // Add the match path itself
        paths.add(match.path);

        // Add all parent paths
        const parts = match.path.split(/[.\[\]]+/).filter(Boolean);
        let currentPath = "";
        parts.forEach((part, index) => {
            if (index > 0) {
                currentPath = currentPath ? `${currentPath}.${part}` : part;
            } else {
                currentPath = part;
            }
            paths.add(currentPath);
        });
    });

    return paths;
}

/**
 * Initialize expand state based on initial depth
 */
export function initializeExpandState(
    data: JsonValue,
    initialDepth: number,
    basePath: string = ""
): ExpandState {
    const state: ExpandState = {};

    function processNode(value: JsonValue, path: string, depth: number): void {
        if (isJsonObject(value) || isJsonArray(value)) {
            // -1 means expand all
            // Otherwise, expand if current depth is less than initial depth
            const shouldExpand = initialDepth === -1 || depth < initialDepth;
            state[path || "root"] = shouldExpand;

            if (isJsonObject(value)) {
                Object.entries(value).forEach(([key, val]) => {
                    const newPath = path ? `${path}.${key}` : key;
                    processNode(val, newPath, depth + 1);
                });
            }

            if (isJsonArray(value)) {
                value.forEach((item, index) => {
                    const newPath = path ? `${path}[${index}]` : `[${index}]`;
                    processNode(item, newPath, depth + 1);
                });
            }
        }
    }

    processNode(data, basePath, 0);
    return state;
}

/**
 * Set all nodes to expanded or collapsed state
 */
export function setAllExpanded(
    data: JsonValue,
    expanded: boolean,
    basePath: string = ""
): ExpandState {
    const state: ExpandState = {};

    function processNode(value: JsonValue, path: string): void {
        if (isJsonObject(value) || isJsonArray(value)) {
            state[path || "root"] = expanded;

            if (isJsonObject(value)) {
                Object.entries(value).forEach(([key, val]) => {
                    const newPath = path ? `${path}.${key}` : key;
                    processNode(val, newPath);
                });
            }

            if (isJsonArray(value)) {
                value.forEach((item, index) => {
                    const newPath = path ? `${path}[${index}]` : `[${index}]`;
                    processNode(item, newPath);
                });
            }
        }
    }

    processNode(data, basePath);
    return state;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Get the depth of a path
 */
export function getPathDepth(path: string): number {
    if (!path || path === "root") return 0;
    const parts = path.split(/[.\[\]]+/).filter(Boolean);
    return parts.length;
}

/**
 * Check if a path is a child of another path
 */
export function isChildPath(parentPath: string, childPath: string): boolean {
    if (parentPath === "" || parentPath === "root") return true;
    return childPath.startsWith(parentPath + ".") || childPath.startsWith(parentPath + "[");
}

/**
 * Highlight matching text in a string
 */
export function highlightMatches(
    text: string,
    searchTerm: string
): { before: string; match: string; after: string }[] {
    if (!searchTerm.trim()) {
        return [{ before: "", match: "", after: text }];
    }

    const results: { before: string; match: string; after: string }[] = [];
    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    let lastIndex = 0;
    let index = lowerText.indexOf(lowerSearch);

    while (index !== -1) {
        const before = text.substring(lastIndex, index);
        const match = text.substring(index, index + searchTerm.length);
        lastIndex = index + searchTerm.length;

        results.push({ before, match, after: "" });
        index = lowerText.indexOf(lowerSearch, lastIndex);
    }

    if (results.length === 0) {
        return [{ before: "", match: "", after: text }];
    }

    // Add remaining text to the last result
    results[results.length - 1].after = text.substring(lastIndex);

    return results;
}
