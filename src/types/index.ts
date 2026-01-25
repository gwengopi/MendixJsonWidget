/**
 * Internal types for the Dynamic JSON Viewer widget
 */

// Represents any valid JSON value
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonArray;

export interface JsonObject {
    [key: string]: JsonValue;
}

export type JsonArray = JsonValue[];

// Type guards for JSON values
export function isJsonObject(value: JsonValue): value is JsonObject {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isJsonArray(value: JsonValue): value is JsonArray {
    return Array.isArray(value);
}

export function isPrimitive(value: JsonValue): value is string | number | boolean | null {
    return !isJsonObject(value) && !isJsonArray(value);
}

export function isString(value: JsonValue): value is string {
    return typeof value === "string";
}

export function isNumber(value: JsonValue): value is number {
    return typeof value === "number";
}

export function isBoolean(value: JsonValue): value is boolean {
    return typeof value === "boolean";
}

export function isNull(value: JsonValue): value is null {
    return value === null;
}

// Data type detection
export type DataType =
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "object"
    | "array"
    | "date"
    | "url"
    | "email";

export function detectDataType(value: JsonValue): DataType {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "object";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    if (typeof value === "string") {
        // Check for special string types
        if (isDateString(value)) return "date";
        if (isUrl(value)) return "url";
        if (isEmail(value)) return "email";
        return "string";
    }
    return "string";
}

// Helper functions for special type detection
export function isDateString(value: string): boolean {
    // ISO 8601 date patterns
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (isoDateRegex.test(value)) {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }
    return false;
}

export function isUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Expand state management
export interface ExpandState {
    [path: string]: boolean;
}

// Search context
export interface SearchMatch {
    path: string;
    key?: string;
    value?: string;
    matchType: "key" | "value" | "both";
}

// Pagination state for arrays
export interface PaginationState {
    [path: string]: number; // current page index
}

// Theme types
export type Theme = "light" | "dark" | "auto";

// Props for the internal JSON renderer component
export interface JsonRendererProps {
    data: JsonValue;
    path: string;
    depth: number;
    expandState: ExpandState;
    onToggleExpand: (path: string) => void;
    searchTerm: string;
    searchMatches: Set<string>;
    showDataTypes: boolean;
    showItemCount: boolean;
    indentSize: number;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number;
    paginationThreshold: number;
    paginationState: PaginationState;
    onPageChange: (path: string, page: number) => void;
    onValueClick?: () => void;
    keyName?: string;
    isArrayItem?: boolean;
    arrayIndex?: number;
}

// Props for the array table renderer
export interface ArrayTableProps {
    data: JsonObject[];
    path: string;
    depth: number;
    expandState: ExpandState;
    onToggleExpand: (path: string) => void;
    searchTerm: string;
    searchMatches: Set<string>;
    showDataTypes: boolean;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number;
    paginationState: PaginationState;
    onPageChange: (path: string, page: number) => void;
    onValueClick?: () => void;
}

// Check if an array contains only objects with consistent keys (for table rendering)
export function isTableCompatibleArray(arr: JsonArray): arr is JsonObject[] {
    if (arr.length === 0) return false;

    // Check if all items are objects
    const allObjects = arr.every(item => isJsonObject(item));
    if (!allObjects) return false;

    // Check if objects have consistent keys (at least some overlap)
    const firstKeys = new Set(Object.keys(arr[0] as JsonObject));
    if (firstKeys.size === 0) return false;

    // Allow some variation but require at least 50% key overlap
    for (let i = 1; i < Math.min(arr.length, 5); i++) {
        const itemKeys = Object.keys(arr[i] as JsonObject);
        const overlap = itemKeys.filter(k => firstKeys.has(k)).length;
        if (overlap < firstKeys.size * 0.5) return false;
    }

    return true;
}

// Get all unique keys from an array of objects
export function getTableColumns(arr: JsonObject[]): string[] {
    const keySet = new Set<string>();
    arr.forEach(obj => {
        Object.keys(obj).forEach(key => keySet.add(key));
    });
    return Array.from(keySet);
}
