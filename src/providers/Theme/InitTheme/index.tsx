import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

/**
 * InitTheme Component
 *
 * Injects a blocking inline script that runs before hydration to prevent flash of incorrect theme.
 * This sets the correct theme class on the document element before any content is rendered.
 *
 * Uses dangerouslySetInnerHTML in head for instant execution - no Script component needed.
 */
export function InitTheme(): React.ReactElement {
    const themeScript = `
    (function() {
      try {
        var storedTheme = localStorage.getItem('${themeLocalStorageKey}');
        var theme = storedTheme;
        
        if (!theme || (theme !== 'light' && theme !== 'dark')) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          theme = prefersDark ? 'dark' : '${defaultTheme}';
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', '${defaultTheme}');
        document.documentElement.classList.add('${defaultTheme}');
      }
    })();
  `

    return <script dangerouslySetInnerHTML={{ __html: themeScript }} id="theme-init" />
}

export default InitTheme
