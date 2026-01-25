/**
 * Editor Preview Component
 * This component is displayed in Mendix Studio Pro's page editor
 */

import { ReactElement } from "react";
import { DynamicJsonViewerPreviewProps } from "../typings/DynamicJsonViewerProps";

export function preview(props: DynamicJsonViewerPreviewProps): ReactElement {
    const { theme, enableSearch, showDataTypes } = props;

    return (
        <div
            style={{
                fontFamily: "monospace",
                fontSize: "12px",
                padding: "12px",
                border: "1px solid #e1e4e8",
                borderRadius: "6px",
                backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
                color: theme === "dark" ? "#c9d1d9" : "#24292f",
                minHeight: "200px"
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    paddingBottom: "8px",
                    borderBottom: `1px solid ${theme === "dark" ? "#30363d" : "#e1e4e8"}`
                }}
            >
                <span style={{ fontWeight: 600 }}>Dynamic JSON Viewer</span>
                {enableSearch && (
                    <div
                        style={{
                            padding: "4px 8px",
                            backgroundColor: theme === "dark" ? "#21262d" : "#f6f8fa",
                            borderRadius: "4px",
                            fontSize: "11px",
                            color: theme === "dark" ? "#8b949e" : "#57606a"
                        }}
                    >
                        🔍 Search enabled
                    </div>
                )}
            </div>

            {/* Preview content */}
            <div style={{ lineHeight: 1.6 }}>
                <PreviewLine
                    depth={0}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>{"{"}</span>
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={1}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#79c0ff" : "#0550ae" }}>"user"</span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>: {"{"} </span>
                            <span style={{ fontStyle: "italic", color: theme === "dark" ? "#6e7681" : "#8b949e" }}>
                                5 items
                            </span>
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={2}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#79c0ff" : "#0550ae" }}>"name"</span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>: </span>
                            <span style={{ color: theme === "dark" ? "#a5d6ff" : "#0a3069" }}>"John Doe"</span>
                            {showDataTypes && (
                                <span
                                    style={{
                                        marginLeft: "8px",
                                        fontSize: "9px",
                                        padding: "1px 4px",
                                        backgroundColor: theme === "dark" ? "#21262d" : "#f6f8fa",
                                        borderRadius: "3px",
                                        color: theme === "dark" ? "#a5d6ff" : "#0a3069"
                                    }}
                                >
                                    STR
                                </span>
                            )}
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={2}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#79c0ff" : "#0550ae" }}>"active"</span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>: </span>
                            <span style={{ color: theme === "dark" ? "#ff7b72" : "#cf222e", fontWeight: 600 }}>true</span>
                            {showDataTypes && (
                                <span
                                    style={{
                                        marginLeft: "8px",
                                        fontSize: "9px",
                                        padding: "1px 4px",
                                        backgroundColor: theme === "dark" ? "#21262d" : "#f6f8fa",
                                        borderRadius: "3px",
                                        color: theme === "dark" ? "#ff7b72" : "#cf222e"
                                    }}
                                >
                                    BOOL
                                </span>
                            )}
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={1}
                    content={
                        <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>{"}"}</span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={1}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#79c0ff" : "#0550ae" }}>"items"</span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>: [ </span>
                            <span style={{ fontStyle: "italic", color: theme === "dark" ? "#6e7681" : "#8b949e" }}>
                                2 items
                            </span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}> ]</span>
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={1}
                    content={
                        <span>
                            <span style={{ color: theme === "dark" ? "#79c0ff" : "#0550ae" }}>"metadata"</span>
                            <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>: </span>
                            <span style={{ color: theme === "dark" ? "#d2a8ff" : "#8250df", fontStyle: "italic" }}>null</span>
                        </span>
                    }
                    theme={theme}
                />

                <PreviewLine
                    depth={0}
                    content={
                        <span style={{ color: theme === "dark" ? "#8b949e" : "#57606a" }}>{"}"}</span>
                    }
                    theme={theme}
                />
            </div>

            {/* Footer info */}
            <div
                style={{
                    marginTop: "12px",
                    paddingTop: "8px",
                    borderTop: `1px solid ${theme === "dark" ? "#30363d" : "#e1e4e8"}`,
                    fontSize: "10px",
                    color: theme === "dark" ? "#6e7681" : "#8b949e"
                }}
            >
                Configure JSON source in widget properties
            </div>
        </div>
    );
}

interface PreviewLineProps {
    depth: number;
    content: ReactElement;
    theme: string;
}

function PreviewLine({ depth, content, theme: _theme }: PreviewLineProps): ReactElement {
    return (
        <div style={{ paddingLeft: `${depth * 16}px` }}>
            {content}
        </div>
    );
}

export function getPreviewCss(): string {
    return "";
}
