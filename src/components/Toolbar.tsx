import { ReactElement } from "react";

export interface ToolbarProps {
    onExpandAll: () => void;
    onCollapseAll: () => void;
    showExpandCollapseAll: boolean;
    children?: React.ReactNode;
}

export function Toolbar({
    onExpandAll,
    onCollapseAll,
    showExpandCollapseAll,
    children
}: ToolbarProps): ReactElement {
    return (
        <div className="djv-toolbar">
            <div className="djv-toolbar-left">
                {children}
            </div>

            {showExpandCollapseAll && (
                <div className="djv-toolbar-right">
                    <button
                        className="djv-toolbar-btn"
                        onClick={onExpandAll}
                        title="Expand all"
                    >
                        <ExpandAllIcon />
                        <span className="djv-btn-text">Expand All</span>
                    </button>
                    <button
                        className="djv-toolbar-btn"
                        onClick={onCollapseAll}
                        title="Collapse all"
                    >
                        <CollapseAllIcon />
                        <span className="djv-btn-text">Collapse All</span>
                    </button>
                </div>
            )}
        </div>
    );
}

function ExpandAllIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
        </svg>
    );
}

function CollapseAllIcon(): ReactElement {
    return (
        <svg
            className="djv-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="17 11 12 6 7 11" />
            <polyline points="17 18 12 13 7 18" />
        </svg>
    );
}

export default Toolbar;
