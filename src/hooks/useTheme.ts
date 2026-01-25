import { useState, useEffect } from "react";
import { ThemeEnum } from "../../typings/DynamicJsonViewerProps";

type ResolvedTheme = "light" | "dark";

/**
 * Hook to resolve the theme based on user preference and system settings
 */
export function useTheme(themeProp: ThemeEnum): ResolvedTheme {
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (themeProp === "auto") {
            return getSystemTheme();
        }
        return themeProp as ResolvedTheme;
    });

    useEffect(() => {
        // If theme is explicitly set, use it directly
        if (themeProp !== "auto") {
            setResolvedTheme(themeProp as ResolvedTheme);
            return;
        }

        // For auto mode, listen to system preference changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setResolvedTheme(e.matches ? "dark" : "light");
        };

        // Set initial value
        handleChange(mediaQuery);

        // Add listener for changes
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, [themeProp]);

    return resolvedTheme;
}

/**
 * Get the current system theme preference
 */
function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") {
        return "light";
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery.matches ? "dark" : "light";
}

export default useTheme;
