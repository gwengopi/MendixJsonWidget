import { ReactElement, useMemo } from "react";
import classNames from "classnames";
import {
    JsonValue,
    JsonObject,
    JsonArray,
    isJsonObject,
    isJsonArray,
    isPrimitive,
    detectDataType
} from "../types";

export type ViewMode = "rows" | "columns";

export interface TableRendererProps {
    data: JsonValue;
    enableCopyValue: boolean;
    onValueClick?: () => void;
    depth?: number;
    viewMode?: ViewMode;
}

/**
 * Renders any JSON structure as HTML tables
 * - Objects: Key-Value table (2 columns) or transposed (keys as row, values as row)
 * - Arrays of objects: Multi-column table with keys as headers
 * - Arrays of primitives: Single column table
 * - Nested structures: Nested tables in cells
 */
export function TableRenderer({
    data,
    enableCopyValue,
    onValueClick,
    depth = 0,
    viewMode = "rows"
}: TableRendererProps): ReactElement {
    // Primitive value at root
    if (isPrimitive(data)) {
        return (
            <div className="djv-table-primitive">
                <PrimitiveCell value={data} enableCopy={enableCopyValue} onValueClick={onValueClick} />
            </div>
        );
    }

    // Object: render as Key-Value table
    if (isJsonObject(data)) {
        return (
            <ObjectTable
                data={data}
                enableCopyValue={enableCopyValue}
                onValueClick={onValueClick}
                depth={depth}
                viewMode={viewMode}
            />
        );
    }

    // Array
    if (isJsonArray(data)) {
        return (
            <ArrayTable
                data={data}
                enableCopyValue={enableCopyValue}
                onValueClick={onValueClick}
                depth={depth}
                viewMode={viewMode}
            />
        );
    }

    return <div className="djv-unknown">Unable to render</div>;
}

/**
 * Renders an object as a table
 * - Rows mode: Key-Value table (2 columns)
 * - Columns mode: Keys as first row, Values as second row (transposed)
 */
interface ObjectTableProps {
    data: JsonObject;
    enableCopyValue: boolean;
    onValueClick?: () => void;
    depth: number;
    viewMode: ViewMode;
}

function ObjectTable({ data, enableCopyValue, onValueClick, depth, viewMode }: ObjectTableProps): ReactElement {
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return <div className="djv-empty-object">(empty object)</div>;
    }

    // Columns mode: Transposed view - keys as header row, values as data row
    if (viewMode === "columns") {
        return (
            <table className={classNames("djv-table", "djv-object-table", "djv-transposed", `djv-depth-${Math.min(depth, 5)}`)}>
                <thead>
                    <tr>
                        {entries.map(([key]) => (
                            <th key={key} className="djv-th">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="djv-tr">
                        {entries.map(([key, value]) => (
                            <td key={key} className="djv-td">
                                <ValueCell
                                    value={value}
                                    enableCopyValue={enableCopyValue}
                                    onValueClick={onValueClick}
                                    depth={depth + 1}
                                    viewMode={viewMode}
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        );
    }

    // Rows mode: Standard Key-Value table
    return (
        <table className={classNames("djv-table", "djv-object-table", `djv-depth-${Math.min(depth, 5)}`)}>
            <thead>
                <tr>
                    <th className="djv-th djv-th-key">Key</th>
                    <th className="djv-th djv-th-value">Value</th>
                </tr>
            </thead>
            <tbody>
                {entries.map(([key, value]) => (
                    <tr key={key} className="djv-tr">
                        <td className="djv-td djv-td-key">{key}</td>
                        <td className="djv-td djv-td-value">
                            <ValueCell
                                value={value}
                                enableCopyValue={enableCopyValue}
                                onValueClick={onValueClick}
                                depth={depth + 1}
                                viewMode={viewMode}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * Renders an array as a table
 * - Rows mode: Each array item as a row
 * - Columns mode: Transposed - keys as rows, array indices as columns
 */
interface ArrayTableProps {
    data: JsonArray;
    enableCopyValue: boolean;
    onValueClick?: () => void;
    depth: number;
    viewMode: ViewMode;
}

function ArrayTable({ data, enableCopyValue, onValueClick, depth, viewMode }: ArrayTableProps): ReactElement {
    const arrayType = useMemo(() => analyzeArray(data), [data]);

    if (data.length === 0) {
        return <div className="djv-empty-array">(empty array)</div>;
    }

    // Array of objects with consistent keys
    if (arrayType.type === "objects" && arrayType.columns.length > 0) {
        // Columns mode: Transposed - keys as rows, items as columns
        if (viewMode === "columns") {
            return (
                <table className={classNames("djv-table", "djv-array-table", "djv-transposed", `djv-depth-${Math.min(depth, 5)}`)}>
                    <thead>
                        <tr>
                            <th className="djv-th djv-th-key">Key</th>
                            {data.map((_, index) => (
                                <th key={index} className="djv-th djv-th-index">{index}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {arrayType.columns.map(col => (
                            <tr key={col} className="djv-tr">
                                <td className="djv-td djv-td-key">{col}</td>
                                {data.map((item, index) => (
                                    <td key={index} className="djv-td">
                                        <ValueCell
                                            value={(item as JsonObject)[col]}
                                            enableCopyValue={enableCopyValue}
                                            onValueClick={onValueClick}
                                            depth={depth + 1}
                                            viewMode={viewMode}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // Rows mode: Standard multi-column table
        return (
            <table className={classNames("djv-table", "djv-array-table", `djv-depth-${Math.min(depth, 5)}`)}>
                <thead>
                    <tr>
                        <th className="djv-th djv-th-index">#</th>
                        {arrayType.columns.map(col => (
                            <th key={col} className="djv-th">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="djv-tr">
                            <td className="djv-td djv-td-index">{index}</td>
                            {arrayType.columns.map(col => (
                                <td key={col} className="djv-td">
                                    <ValueCell
                                        value={(item as JsonObject)[col]}
                                        enableCopyValue={enableCopyValue}
                                        onValueClick={onValueClick}
                                        depth={depth + 1}
                                        viewMode={viewMode}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    // Array of primitives
    if (arrayType.type === "primitives") {
        // Columns mode: Single row with all values
        if (viewMode === "columns") {
            return (
                <table className={classNames("djv-table", "djv-primitive-array-table", "djv-transposed", `djv-depth-${Math.min(depth, 5)}`)}>
                    <thead>
                        <tr>
                            {data.map((_, index) => (
                                <th key={index} className="djv-th djv-th-index">{index}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="djv-tr">
                            {data.map((item, index) => (
                                <td key={index} className="djv-td">
                                    <PrimitiveCell
                                        value={item as string | number | boolean | null}
                                        enableCopy={enableCopyValue}
                                        onValueClick={onValueClick}
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            );
        }

        // Rows mode: Standard single column
        return (
            <table className={classNames("djv-table", "djv-primitive-array-table", `djv-depth-${Math.min(depth, 5)}`)}>
                <thead>
                    <tr>
                        <th className="djv-th djv-th-index">#</th>
                        <th className="djv-th">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="djv-tr">
                            <td className="djv-td djv-td-index">{index}</td>
                            <td className="djv-td">
                                <PrimitiveCell
                                    value={item as string | number | boolean | null}
                                    enableCopy={enableCopyValue}
                                    onValueClick={onValueClick}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    // Mixed array
    // Columns mode: Single row with all values
    if (viewMode === "columns") {
        return (
            <table className={classNames("djv-table", "djv-mixed-array-table", "djv-transposed", `djv-depth-${Math.min(depth, 5)}`)}>
                <thead>
                    <tr>
                        {data.map((_, index) => (
                            <th key={index} className="djv-th djv-th-index">{index}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="djv-tr">
                        {data.map((item, index) => (
                            <td key={index} className="djv-td">
                                <ValueCell
                                    value={item}
                                    enableCopyValue={enableCopyValue}
                                    onValueClick={onValueClick}
                                    depth={depth + 1}
                                    viewMode={viewMode}
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        );
    }

    // Rows mode: Standard row per item
    return (
        <table className={classNames("djv-table", "djv-mixed-array-table", `djv-depth-${Math.min(depth, 5)}`)}>
            <thead>
                <tr>
                    <th className="djv-th djv-th-index">#</th>
                    <th className="djv-th">Value</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="djv-tr">
                        <td className="djv-td djv-td-index">{index}</td>
                        <td className="djv-td">
                            <ValueCell
                                value={item}
                                enableCopyValue={enableCopyValue}
                                onValueClick={onValueClick}
                                depth={depth + 1}
                                viewMode={viewMode}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * Renders a cell value - either primitive or nested table
 */
interface ValueCellProps {
    value: JsonValue;
    enableCopyValue: boolean;
    onValueClick?: () => void;
    depth: number;
    viewMode: ViewMode;
}

function ValueCell({ value, enableCopyValue, onValueClick, depth, viewMode }: ValueCellProps): ReactElement {
    if (value === undefined) {
        return <span className="djv-undefined">undefined</span>;
    }

    if (isPrimitive(value)) {
        return <PrimitiveCell value={value} enableCopy={enableCopyValue} onValueClick={onValueClick} />;
    }

    // Nested object or array - render as nested table
    return (
        <div className="djv-nested-table">
            <TableRenderer
                data={value}
                enableCopyValue={enableCopyValue}
                onValueClick={onValueClick}
                depth={depth}
                viewMode={viewMode}
            />
        </div>
    );
}

/**
 * Renders a primitive value with appropriate styling
 */
interface PrimitiveCellProps {
    value: string | number | boolean | null;
    enableCopy: boolean;
    onValueClick?: () => void;
}

function PrimitiveCell({ value, enableCopy, onValueClick }: PrimitiveCellProps): ReactElement {
    const dataType = detectDataType(value);
    const displayValue = formatValue(value);

    const handleClick = () => {
        if (enableCopy && value !== null) {
            navigator.clipboard.writeText(String(value)).catch(() => {});
        }
        if (onValueClick) {
            onValueClick();
        }
    };

    return (
        <span
            className={classNames("djv-value", `djv-value-${dataType}`, {
                "djv-copyable": enableCopy
            })}
            onClick={enableCopy || onValueClick ? handleClick : undefined}
            title={enableCopy ? "Click to copy" : undefined}
        >
            {displayValue}
        </span>
    );
}

/**
 * Format a primitive value for display
 */
function formatValue(value: string | number | boolean | null): string {
    if (value === null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "string") return value;
    return String(value);
}

/**
 * Analyze array to determine best rendering strategy
 */
interface ArrayAnalysis {
    type: "objects" | "primitives" | "mixed";
    columns: string[];
}

function analyzeArray(arr: JsonArray): ArrayAnalysis {
    if (arr.length === 0) {
        return { type: "mixed", columns: [] };
    }

    // Check if all primitives
    const allPrimitives = arr.every(item => isPrimitive(item));
    if (allPrimitives) {
        return { type: "primitives", columns: [] };
    }

    // Check if all objects
    const allObjects = arr.every(item => isJsonObject(item));
    if (allObjects) {
        // Collect all unique keys
        const keySet = new Set<string>();
        (arr as JsonObject[]).forEach(obj => {
            Object.keys(obj).forEach(key => keySet.add(key));
        });
        return { type: "objects", columns: Array.from(keySet) };
    }

    return { type: "mixed", columns: [] };
}

export default TableRenderer;
