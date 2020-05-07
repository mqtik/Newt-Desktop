import { PluginToolbar } from '@edtr-io/plugin-toolbar/beta';

/**
 * Creates the default {@link @edtr-io/plugin-toolbar#PluginToolbar | plugin toolbar}
 *
 * @param config - Optional configuration
 * @returns The default {@link @edtr-io/plugin-toolbar#PluginToolbar | plugin toolbar}
 * @beta
 */
export declare function createDefaultPluginToolbar(config?: DefaultPluginToolbarConfig): PluginToolbar;

/** @beta */
export declare interface DefaultPluginToolbarConfig {
    primaryColor: string;
}

export { }
