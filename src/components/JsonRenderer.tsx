import { ReactElement, Fragment, useMemo } from "react";
import classNames from "classnames";
import {
    JsonObject,
    JsonArray,
    JsonRendererProps,
    isJsonObject,
    isJsonArray,
    isPrimitive,
    isTableCompatibleArray,
    getTableColumns
} from "../types";
import { generatePath } from "../utils/jsonUtils";
import { ExpandableHeader } from "./ExpandableHeader";
import { PrimitiveValue } from "./PrimitiveValue";
import { Pagination } from "./Pagination";

/**
 * Core recursive JSON renderer component
 * Handles all JSON data types with proper visualization
 */
export function JsonRenderer({
    data,
    path,
    depth,
    expandState,
    onToggleExpand,
    searchTerm,
    searchMatches,
    showDataTypes,
    showItemCount,
    indentSize,
    enableCopyValue,
    enablePagination,
    pageSize,
    paginationThreshold,
    paginationState,
    onPageChange,
    onValueClick,
    keyName,
    isArrayItem,
    arrayIndex
}: JsonRendererProps): ReactElement {
    const currentPath = path || "root";
    const isExpanded = expandState[currentPath] ?? true;
    const isKeyMatch = searchTerm ? searchMatches.has(`${currentPath}:key`) : false;
    const isValueMatch = searchTerm ? searchMatches.has(`${currentPath}:value`) : false;

    // Render primitive values
    if (isPrimitive(data)) {
        return (
            <div
                className={classNames("djv-entry", "djv-primitive-entry", {
                    "djv-array-item": isArrayItem
                })}
                style={{ paddingLeft: depth * indentSize }}
            >
                {keyName !== undefined && (
                    <Fragment>
                        <span className={classNames("djv-key", { "djv-key-match": isKeyMatch })}>
                            {keyName}
                        </span>
                        <span className="djv-separator">:</span>
                    </Fragment>
                )}
                {arrayIndex !== undefined && (
                    <span className="djv-array-index">[{arrayIndex}]</span>
                )}
                <PrimitiveValue
                    value={data}
                    showDataType={showDataTypes}
                    enableCopy={enableCopyValue}
                    searchTerm={searchTerm}
                    isMatch={isValueMatch}
                    onValueClick={onValueClick}
                />
            </div>
        );
    }

    // Render objects
    if (isJsonObject(data)) {
        return (
            <ObjectRenderer
                data={data}
                path={currentPath}
                depth={depth}
                expandState={expandState}
                onToggleExpand={onToggleExpand}
                searchTerm={searchTerm}
                searchMatches={searchMatches}
                showDataTypes={showDataTypes}
                showItemCount={showItemCount}
                indentSize={indentSize}
                enableCopyValue={enableCopyValue}
                enablePagination={enablePagination}
                pageSize={pageSize}
                paginationThreshold={paginationThreshold}
                paginationState={paginationState}
                onPageChange={onPageChange}
                onValueClick={onValueClick}
                keyName={keyName}
                isExpanded={isExpanded}
                isKeyMatch={isKeyMatch}
                arrayIndex={arrayIndex}
            />
        );
    }

    // Render arrays
    if (isJsonArray(data)) {
        return (
            <ArrayRenderer
                data={data}
                path={currentPath}
                depth={depth}
                expandState={expandState}
                onToggleExpand={onToggleExpand}
                searchTerm={searchTerm}
                searchMatches={searchMatches}
                showDataTypes={showDataTypes}
                showItemCount={showItemCount}
                indentSize={indentSize}
                enableCopyValue={enableCopyValue}
                enablePagination={enablePagination}
                pageSize={pageSize}
                paginationThreshold={paginationThreshold}
                paginationState={paginationState}
                onPageChange={onPageChange}
                onValueClick={onValueClick}
                keyName={keyName}
                isExpanded={isExpanded}
                isKeyMatch={isKeyMatch}
                arrayIndex={arrayIndex}
            />
        );
    }

    // Fallback for unknown types
    return (
        <div className="djv-unknown">
            Unable to render value
        </div>
    );
}

interface ObjectRendererProps extends Omit<JsonRendererProps, "data" | "isArrayItem"> {
    data: JsonObject;
    isExpanded: boolean;
    isKeyMatch: boolean;
}

function ObjectRenderer({
    data,
    path,
    depth,
    expandState,
    onToggleExpand,
    searchTerm,
    searchMatches,
    showDataTypes,
    showItemCount,
    indentSize,
    enableCopyValue,
    enablePagination,
    pageSize,
    paginationThreshold,
    paginationState,
    onPageChange,
    onValueClick,
    keyName,
    isExpanded,
    isKeyMatch,
    arrayIndex
}: ObjectRendererProps): ReactElement {
    const entries = Object.entries(data);
    const itemCount = entries.length;

    return (
        <div
            className={classNames("djv-entry", "djv-object-entry", {
                "djv-expanded": isExpanded,
                [`djv-depth-${Math.min(depth, 5)}`]: true
            })}
            style={{ paddingLeft: depth > 0 ? indentSize : 0 }}
        >
            <ExpandableHeader
                keyName={keyName}
                isExpanded={isExpanded}
                onToggle={() => onToggleExpand(path)}
                itemCount={itemCount}
                showItemCount={showItemCount}
                type="object"
                searchTerm={searchTerm}
                isKeyMatch={isKeyMatch}
                depth={depth}
                arrayIndex={arrayIndex}
            />

            {isExpanded && (
                <div className="djv-object-content">
                    {entries.map(([key, value]) => {
                        const childPath = generatePath(path === "root" ? "" : path, key);
                        return (
                            <JsonRenderer
                                key={key}
                                data={value}
                                path={childPath}
                                depth={depth + 1}
                                expandState={expandState}
                                onToggleExpand={onToggleExpand}
                                searchTerm={searchTerm}
                                searchMatches={searchMatches}
                                showDataTypes={showDataTypes}
                                showItemCount={showItemCount}
                                indentSize={indentSize}
                                enableCopyValue={enableCopyValue}
                                enablePagination={enablePagination}
                                pageSize={pageSize}
                                paginationThreshold={paginationThreshold}
                                paginationState={paginationState}
                                onPageChange={onPageChange}
                                onValueClick={onValueClick}
                                keyName={key}
                            />
                        );
                    })}
                    <div
                        className="djv-bracket djv-bracket-close"
                        style={{ paddingLeft: depth > 0 ? indentSize : 0 }}
                    >
                        {"}"}
                    </div>
                </div>
            )}
        </div>
    );
}

interface ArrayRendererProps extends Omit<JsonRendererProps, "data" | "isArrayItem"> {
    data: JsonArray;
    isExpanded: boolean;
    isKeyMatch: boolean;
}

function ArrayRenderer({
    data,
    path,
    depth,
    expandState,
    onToggleExpand,
    searchTerm,
    searchMatches,
    showDataTypes,
    showItemCount,
    indentSize,
    enableCopyValue,
    enablePagination,
    pageSize,
    paginationThreshold,
    paginationState,
    onPageChange,
    onValueClick,
    keyName,
    isExpanded,
    isKeyMatch,
    arrayIndex
}: ArrayRendererProps): ReactElement {
    const itemCount = data.length;
    const shouldPaginate = enablePagination && itemCount >= paginationThreshold;
    const currentPage = paginationState[path] ?? 0;

    // Determine items to display based on pagination
    const displayItems = useMemo(() => {
        if (!shouldPaginate) return data;
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return data.slice(start, end);
    }, [data, shouldPaginate, currentPage, pageSize]);

    const startIndex = shouldPaginate ? currentPage * pageSize : 0;

    // Check if array is table-compatible (array of similar objects)
    const isTableArray = useMemo(() => {
        return isTableCompatibleArray(data) && data.length > 0;
    }, [data]);

    // Check if array contains only primitives
    const isPrimitiveArray = useMemo(() => {
        return data.every(item => isPrimitive(item));
    }, [data]);

    return (
        <div
            className={classNames("djv-entry", "djv-array-entry", {
                "djv-expanded": isExpanded,
                "djv-table-array": isTableArray && isExpanded,
                "djv-primitive-array": isPrimitiveArray,
                [`djv-depth-${Math.min(depth, 5)}`]: true
            })}
            style={{ paddingLeft: depth > 0 ? indentSize : 0 }}
        >
            <ExpandableHeader
                keyName={keyName}
                isExpanded={isExpanded}
                onToggle={() => onToggleExpand(path)}
                itemCount={itemCount}
                showItemCount={showItemCount}
                type="array"
                searchTerm={searchTerm}
                isKeyMatch={isKeyMatch}
                depth={depth}
                arrayIndex={arrayIndex}
            />

            {isExpanded && (
                <div className="djv-array-content">
                    {shouldPaginate && (
                        <div className="djv-pagination-wrapper">
                            <Pagination
                                totalItems={itemCount}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={(page) => onPageChange(path, page)}
                            />
                        </div>
                    )}

                    {isTableArray ? (
                        <ArrayTableView
                            data={displayItems as JsonObject[]}
                            path={path}
                            depth={depth}
                            startIndex={startIndex}
                            expandState={expandState}
                            onToggleExpand={onToggleExpand}
                            searchTerm={searchTerm}
                            searchMatches={searchMatches}
                            showDataTypes={showDataTypes}
                            showItemCount={showItemCount}
                            indentSize={indentSize}
                            enableCopyValue={enableCopyValue}
                            enablePagination={enablePagination}
                            pageSize={pageSize}
                            paginationThreshold={paginationThreshold}
                            paginationState={paginationState}
                            onPageChange={onPageChange}
                            onValueClick={onValueClick}
                        />
                    ) : isPrimitiveArray ? (
                        <PrimitiveArrayView
                            data={displayItems}
                            path={path}
                            depth={depth}
                            startIndex={startIndex}
                            searchTerm={searchTerm}
                            searchMatches={searchMatches}
                            showDataTypes={showDataTypes}
                            enableCopyValue={enableCopyValue}
                            onValueClick={onValueClick}
                            indentSize={indentSize}
                        />
                    ) : (
                        <MixedArrayView
                            data={displayItems}
                            path={path}
                            depth={depth}
                            startIndex={startIndex}
                            expandState={expandState}
                            onToggleExpand={onToggleExpand}
                            searchTerm={searchTerm}
                            searchMatches={searchMatches}
                            showDataTypes={showDataTypes}
                            showItemCount={showItemCount}
                            indentSize={indentSize}
                            enableCopyValue={enableCopyValue}
                            enablePagination={enablePagination}
                            pageSize={pageSize}
                            paginationThreshold={paginationThreshold}
                            paginationState={paginationState}
                            onPageChange={onPageChange}
                            onValueClick={onValueClick}
                        />
                    )}

                    <div
                        className="djv-bracket djv-bracket-close"
                        style={{ paddingLeft: depth > 0 ? indentSize : 0 }}
                    >
                        {"]"}
                    </div>
                </div>
            )}
        </div>
    );
}

// Table view for arrays of similar objects
interface ArrayTableViewProps {
    data: JsonObject[];
    path: string;
    depth: number;
    startIndex: number;
    expandState: JsonRendererProps["expandState"];
    onToggleExpand: JsonRendererProps["onToggleExpand"];
    searchTerm: string;
    searchMatches: Set<string>;
    showDataTypes: boolean;
    showItemCount: boolean;
    indentSize: number;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number;
    paginationThreshold: number;
    paginationState: JsonRendererProps["paginationState"];
    onPageChange: JsonRendererProps["onPageChange"];
    onValueClick?: () => void;
}

function ArrayTableView({
    data,
    path,
    depth: _depth,
    startIndex,
    expandState,
    onToggleExpand,
    searchTerm,
    searchMatches,
    showDataTypes,
    showItemCount,
    indentSize,
    enableCopyValue,
    enablePagination,
    pageSize,
    paginationThreshold,
    paginationState,
    onPageChange,
    onValueClick
}: ArrayTableViewProps): ReactElement {
    const columns = useMemo(() => getTableColumns(data), [data]);

    return (
        <div className="djv-table-wrapper">
            <table className="djv-table">
                <thead>
                    <tr>
                        <th className="djv-table-index">#</th>
                        {columns.map(col => (
                            <th key={col} className="djv-table-header">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => {
                        const actualIndex = startIndex + rowIndex;
                        const rowPath = generatePath(path === "root" ? "" : path, actualIndex);

                        return (
                            <tr key={actualIndex} className="djv-table-row">
                                <td className="djv-table-index">{actualIndex}</td>
                                {columns.map(col => {
                                    const cellValue = row[col];
                                    const cellPath = generatePath(rowPath, col);

                                    // For complex values, render recursively
                                    if (isJsonObject(cellValue) || isJsonArray(cellValue)) {
                                        return (
                                            <td key={col} className="djv-table-cell djv-cell-complex">
                                                <JsonRenderer
                                                    data={cellValue}
                                                    path={cellPath}
                                                    depth={0}
                                                    expandState={expandState}
                                                    onToggleExpand={onToggleExpand}
                                                    searchTerm={searchTerm}
                                                    searchMatches={searchMatches}
                                                    showDataTypes={showDataTypes}
                                                    showItemCount={showItemCount}
                                                    indentSize={indentSize}
                                                    enableCopyValue={enableCopyValue}
                                                    enablePagination={enablePagination}
                                                    pageSize={pageSize}
                                                    paginationThreshold={paginationThreshold}
                                                    paginationState={paginationState}
                                                    onPageChange={onPageChange}
                                                    onValueClick={onValueClick}
                                                />
                                            </td>
                                        );
                                    }

                                    // For primitives, render directly
                                    const isMatch = searchTerm ? searchMatches.has(`${cellPath}:value`) : false;
                                    return (
                                        <td key={col} className="djv-table-cell">
                                            <PrimitiveValue
                                                value={cellValue}
                                                showDataType={showDataTypes}
                                                enableCopy={enableCopyValue}
                                                searchTerm={searchTerm}
                                                isMatch={isMatch}
                                                onValueClick={onValueClick}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// List view for arrays of primitives
interface PrimitiveArrayViewProps {
    data: JsonArray;
    path: string;
    depth: number;
    startIndex: number;
    searchTerm: string;
    searchMatches: Set<string>;
    showDataTypes: boolean;
    enableCopyValue: boolean;
    onValueClick?: () => void;
    indentSize: number;
}

function PrimitiveArrayView({
    data,
    path,
    depth,
    startIndex,
    searchTerm,
    searchMatches,
    showDataTypes,
    enableCopyValue,
    onValueClick,
    indentSize
}: PrimitiveArrayViewProps): ReactElement {
    return (
        <ul className="djv-primitive-list">
            {data.map((item, index) => {
                const actualIndex = startIndex + index;
                const itemPath = generatePath(path === "root" ? "" : path, actualIndex);
                const isMatch = searchTerm ? searchMatches.has(`${itemPath}:value`) : false;

                return (
                    <li
                        key={actualIndex}
                        className="djv-primitive-list-item"
                        style={{ paddingLeft: (depth + 1) * indentSize }}
                    >
                        <span className="djv-array-index">[{actualIndex}]</span>
                        <PrimitiveValue
                            value={item}
                            showDataType={showDataTypes}
                            enableCopy={enableCopyValue}
                            searchTerm={searchTerm}
                            isMatch={isMatch}
                            onValueClick={onValueClick}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

// Mixed array view for arrays with mixed types
interface MixedArrayViewProps {
    data: JsonArray;
    path: string;
    depth: number;
    startIndex: number;
    expandState: JsonRendererProps["expandState"];
    onToggleExpand: JsonRendererProps["onToggleExpand"];
    searchTerm: string;
    searchMatches: Set<string>;
    showDataTypes: boolean;
    showItemCount: boolean;
    indentSize: number;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number;
    paginationThreshold: number;
    paginationState: JsonRendererProps["paginationState"];
    onPageChange: JsonRendererProps["onPageChange"];
    onValueClick?: () => void;
}

function MixedArrayView({
    data,
    path,
    depth,
    startIndex,
    expandState,
    onToggleExpand,
    searchTerm,
    searchMatches,
    showDataTypes,
    showItemCount,
    indentSize,
    enableCopyValue,
    enablePagination,
    pageSize,
    paginationThreshold,
    paginationState,
    onPageChange,
    onValueClick
}: MixedArrayViewProps): ReactElement {
    return (
        <div className="djv-mixed-array">
            {data.map((item, index) => {
                const actualIndex = startIndex + index;
                const itemPath = generatePath(path === "root" ? "" : path, actualIndex);

                return (
                    <JsonRenderer
                        key={actualIndex}
                        data={item}
                        path={itemPath}
                        depth={depth + 1}
                        expandState={expandState}
                        onToggleExpand={onToggleExpand}
                        searchTerm={searchTerm}
                        searchMatches={searchMatches}
                        showDataTypes={showDataTypes}
                        showItemCount={showItemCount}
                        indentSize={indentSize}
                        enableCopyValue={enableCopyValue}
                        enablePagination={enablePagination}
                        pageSize={pageSize}
                        paginationThreshold={paginationThreshold}
                        paginationState={paginationState}
                        onPageChange={onPageChange}
                        onValueClick={onValueClick}
                        isArrayItem={true}
                        arrayIndex={actualIndex}
                    />
                );
            })}
        </div>
    );
}

export default JsonRenderer;
