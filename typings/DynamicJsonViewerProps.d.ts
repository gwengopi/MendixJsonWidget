/**
 * This file was generated from DynamicJsonViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue } from "mendix";

export type ThemeEnum = "auto" | "light" | "dark";

export interface DynamicJsonViewerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    jsonString: DynamicValue<string>;
    rootLabel?: DynamicValue<string>;
    defaultExpanded: boolean;
    initialExpandDepth: number;
    showDataTypes: boolean;
    showItemCount: boolean;
    indentSize: number;
    enableSearch: boolean;
    enableExpandCollapseAll: boolean;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number;
    paginationThreshold: number;
    theme: ThemeEnum;
    maxHeight: string;
    customClass: string;
    showParseErrors: boolean;
    errorMessage: string;
    showRawOnError: boolean;
    onValueClick?: ActionValue;
}

export interface DynamicJsonViewerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    jsonString: string;
    rootLabel: string;
    defaultExpanded: boolean;
    initialExpandDepth: number | null;
    showDataTypes: boolean;
    showItemCount: boolean;
    indentSize: number | null;
    enableSearch: boolean;
    enableExpandCollapseAll: boolean;
    enableCopyValue: boolean;
    enablePagination: boolean;
    pageSize: number | null;
    paginationThreshold: number | null;
    theme: ThemeEnum;
    maxHeight: string;
    customClass: string;
    showParseErrors: boolean;
    errorMessage: string;
    showRawOnError: boolean;
    onValueClick: {} | null;
}
