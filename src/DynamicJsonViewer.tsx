/**
 * Dynamic JSON Viewer - Mendix Pluggable Widget
 *
 * A pluggable widget that renders fully dynamic JSON data with:
 * - Recursive rendering for unlimited nesting depth
 * - Expand/collapse functionality
 * - Search within JSON
 * - Pagination for large arrays
 * - Light and dark theme support
 * - Table view for arrays of objects
 * - Type-aware value highlighting
 *
 * @author Your Name
 * @version 1.0.0
 */

import { ReactElement } from "react";
import { DynamicJsonViewerContainerProps } from "../typings/DynamicJsonViewerProps";
import { DynamicJsonViewerContainer } from "./components/DynamicJsonViewerContainer";

/**
 * Main widget entry point
 * This is the component that Mendix instantiates
 */
export function DynamicJsonViewer(props: DynamicJsonViewerContainerProps): ReactElement {
    return <DynamicJsonViewerContainer {...props} />;
}
