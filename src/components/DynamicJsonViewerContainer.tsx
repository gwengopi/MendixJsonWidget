import {
    ReactElement,
    useMemo,
    useCallback,
    useState
} from "react";
import classNames from "classnames";
import { DynamicJsonViewerContainerProps } from "../../typings/DynamicJsonViewerProps";
import { safeParseJson } from "../utils/jsonUtils";
import { TableRenderer } from "./TableRenderer";
import { useTheme } from "../hooks/useTheme";

import "../styles/DynamicJsonViewer.scss";

export type ViewMode = "rows" | "columns";

export function DynamicJsonViewerContainer(
    props: DynamicJsonViewerContainerProps
): ReactElement {
    const {
        name,
        class: className,
        style,
        tabIndex,
        jsonString,
        rootLabel,
        enableCopyValue,
        theme: themeProp,
        maxHeight,
        customClass,
        showParseErrors,
        errorMessage,
        showRawOnError,
        onValueClick
    } = props;

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>("rows");

    // Parse JSON data
    const parsedData = useMemo(() => {
        const jsonStr = jsonString?.value ?? "";
        return safeParseJson(jsonStr);
    }, [jsonString?.value]);

    // Theme handling
    const resolvedTheme = useTheme(themeProp);

    const handleValueClick = useCallback(() => {
        if (onValueClick?.canExecute) {
            onValueClick.execute();
        }
    }, [onValueClick]);

    const toggleViewMode = useCallback(() => {
        setViewMode(prev => prev === "rows" ? "columns" : "rows");
    }, []);

    // Render error state
    if (!parsedData.success) {
        return (
            <div
                className={classNames(
                    "djv-container",
                    "djv-error",
                    `djv-theme-${resolvedTheme}`,
                    className,
                    customClass
                )}
                style={style}
                tabIndex={tabIndex}
            >
                {showParseErrors && (
                    <div className="djv-error-content">
                        <div className="djv-error-icon">
                            <ErrorIcon />
                        </div>
                        <div className="djv-error-message">
                            {errorMessage || parsedData.error}
                        </div>
                        {showRawOnError && jsonString?.value && (
                            <div className="djv-raw-content">
                                <pre>{jsonString.value}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Render empty state
    if (parsedData.data === undefined || parsedData.data === null) {
        return (
            <div
                className={classNames(
                    "djv-container",
                    "djv-empty",
                    `djv-theme-${resolvedTheme}`,
                    className,
                    customClass
                )}
                style={style}
                tabIndex={tabIndex}
            >
                <div className="djv-empty-content">
                    <span className="djv-null-value">null</span>
                </div>
            </div>
        );
    }

    const rootLabelValue = rootLabel?.value || "";

    return (
        <div
            className={classNames(
                "djv-container",
                "djv-table-view",
                `djv-theme-${resolvedTheme}`,
                className,
                customClass
            )}
            style={{
                ...style,
                ...(maxHeight ? { maxHeight, overflowY: "auto" } : {})
            }}
            tabIndex={tabIndex}
            data-widget-name={name}
        >
            <div className="djv-toolbar">
                <div className="djv-toolbar-left">
                    {rootLabelValue && (
                        <span className="djv-toolbar-label">{rootLabelValue}</span>
                    )}
                </div>
                <div className="djv-toolbar-right">
                    <button
                        className={classNames("djv-view-toggle-btn", {
                            "djv-active": viewMode === "columns"
                        })}
                        onClick={toggleViewMode}
                        title={viewMode === "rows" ? "Switch to columns view" : "Switch to rows view"}
                    >
                        {viewMode === "rows" ? (
                            <>
                                <ColumnsIcon />
                                <span className="djv-btn-text">Columns</span>
                            </>
                        ) : (
                            <>
                                <RowsIcon />
                                <span className="djv-btn-text">Rows</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="djv-content">
                <TableRenderer
                    data={parsedData.data}
                    enableCopyValue={enableCopyValue}
                    onValueClick={onValueClick ? handleValueClick : undefined}
                    viewMode={viewMode}
                />
            </div>
        </div>
    );
}

function ErrorIcon(): ReactElement {
    return (
        <svg
            className="djv-icon djv-error-icon-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}

function ColumnsIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="18" rx="1" />
        </svg>
    );
}

function RowsIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="18" height="7" rx="1" />
            <rect x="3" y="14" width="18" height="7" rx="1" />
        </svg>
    );
}

export default DynamicJsonViewerContainer;
