/**
 * Centralized FontAwesome icon initialization
 *
 * The FontAwesome kit (@awesome.me/kit-*) doesn't fully support tree-shaking
 * because some icons used in the app (scale-balanced, ruler-triangle, face-thinking)
 * aren't exported individually from the kit's modules.
 *
 * TODO: To enable tree-shaking, either:
 * 1. Add these icons to the kit via FontAwesome's kit configuration, or
 * 2. Replace with icons that are available in the kit's exports
 *
 * For now, we import all icons which works but adds ~500KB to the bundle.
 */
import { library } from "@fortawesome/fontawesome-svg-core";
import { all } from '@awesome.me/kit-a655910996/icons';

// Add all kit icons to the library once at startup
library.add(...all);

// Re-export FontAwesomeIcon for convenience
export { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
