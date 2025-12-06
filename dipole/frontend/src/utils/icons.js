/**
 * Centralized FontAwesome icon initialization
 *
 * The FontAwesome kit (@awesome.me/kit-*) doesn't support individual icon imports,
 * so we import the entire icon set here once. This is loaded in main.jsx.
 *
 * Note: To reduce bundle size further, consider migrating to the official
 * @fortawesome/free-solid-svg-icons package which supports tree-shaking.
 */
import { library } from "@fortawesome/fontawesome-svg-core";
import { all } from '@awesome.me/kit-a655910996/icons';

// Add all kit icons to the library once at startup
library.add(...all);

// Re-export FontAwesomeIcon for convenience
export { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
