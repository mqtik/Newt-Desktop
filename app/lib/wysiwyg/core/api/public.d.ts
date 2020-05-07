/// <reference types="react" />
import { Action } from '@edtr-io/store';
import { ChangeListener } from '@edtr-io/store';
import { CustomTheme } from '@edtr-io/ui';
import { EditorPlugin } from '@edtr-io/internal__plugin';
import { GlobalHotKeys } from 'react-hotkeys';
import { HotKeys } from 'react-hotkeys';
import { IgnoreKeys } from 'react-hotkeys';
import * as InternalDocumentEditor from '@edtr-io/internal__document-editor/beta';
import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta';
import { PluginProps } from '@edtr-io/internal__plugin-state';
import { ProviderProps } from 'react-redux';
import * as React from 'react';
import { ScopedState } from '@edtr-io/store';
import { Store } from '@edtr-io/store';
import { StoreEnhancerFactory } from '@edtr-io/store';

/** @public */
export declare const DocumentEditorContext: React.Context<React.ComponentType<InternalDocumentEditor.DocumentEditorProps>>;

/**
 * Renders a single editor for an Edtr.io document
 *
 * @public
 */
export declare function Editor<K extends string = string>({ createStoreEnhancer, ...props }: EditorProps<K>): JSX.Element;

/** @public */
export declare interface EditorProps<K extends string = string> {
    omitDragDropContext?: boolean;
    children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode);
    plugins: Record<K, EditorPlugin>;
    initialState: {
        plugin: string;
        state?: unknown;
    };
    theme?: CustomTheme;
    onChange?: ChangeListener;
    editable?: boolean;
    createStoreEnhancer?: StoreEnhancerFactory;
    onError?: React.ContextType<typeof ErrorContext>;
    DocumentEditor?: React.ContextType<typeof DocumentEditorContext>;
    PluginToolbar?: React.ContextType<typeof PluginToolbarContext>;
}

/** @public */
export declare const ErrorContext: React.Context<((error: Error, errorInfo: {
    componentStack: string;
}) => void) | undefined>;
export { GlobalHotKeys }
export { HotKeys }
export { IgnoreKeys }

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayButton}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayButtonProps}
 * @public
 */
export declare function OverlayButton(props: OverlayButtonProps): JSX.Element;

/** @public */
export declare type OverlayButtonProps = InternalPluginToolbar.OverlayButtonProps;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayCheckbox}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayCheckboxProps}
 * @public
 */
export declare function OverlayCheckbox(props: OverlayCheckboxProps): JSX.Element;

/** @public */
export declare type OverlayCheckboxProps = InternalPluginToolbar.OverlayCheckboxProps;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayInput}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayInputProps}
 * @public
 */
export declare function OverlayInput(props: OverlayInputProps): JSX.Element;

/** @public */
export declare type OverlayInputProps = InternalPluginToolbar.OverlayInputProps;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlaySelect}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlaySelectProps}
 * @public
 */
export declare function OverlaySelect(props: OverlaySelectProps): JSX.Element;

/** @public */
export declare type OverlaySelectProps = InternalPluginToolbar.OverlaySelectProps;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayTextarea}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayTextareaProps}
 * @public
 */
export declare function OverlayTextarea(props: OverlayTextareaProps): JSX.Element;

/** @public */
export declare type OverlayTextareaProps = InternalPluginToolbar.OverlayTextareaProps;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | PluginToolbarButton}
 *
 * @public
 */
export declare const PluginToolbarButton: React.ForwardRefExoticComponent<Pick<InternalPluginToolbar.PluginToolbarButtonProps, "className" | "icon" | "label" | "onClick"> & React.RefAttributes<HTMLButtonElement>>;

/** @public */
export declare type PluginToolbarButtonProps = InternalPluginToolbar.PluginToolbarButtonProps;

/** @public */
export declare const PluginToolbarContext: React.Context<InternalPluginToolbar.PluginToolbar>;

/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | PluginToolbarOverlayButton}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#PluginToolbarOverlayButtonProps}
 * @public
 */
export declare function PluginToolbarOverlayButton(props: PluginToolbarOverlayButtonProps): JSX.Element;

/** @public */
export declare type PluginToolbarOverlayButtonProps = InternalPluginToolbar.PluginToolbarOverlayButtonProps;

/**
 * Store Provider
 *
 * @param props - The {@link https://react-redux.js.org/api/provider#props | ProviderProps}
 * @public
 */
export declare function Provider(props: ProviderProps<Action> & {
    children: React.ReactNode;
}): JSX.Element;

/** @public */
export declare const ScopeContext: React.Context<{
    scope: string;
    editable?: boolean | undefined;
}>;

/**
 * Renders a document inside another document
 *
 * @param props - The {@link SubDocumentProps}
 * @public
 */
export declare const SubDocument: (props: SubDocumentProps) => JSX.Element;

/** @public */
export declare interface SubDocumentProps {
    id: string;
    pluginProps?: PluginProps;
}

/** @public */
export declare const useDispatch: () => (action: Action) => void;

/**
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 *
 * @public
 */
export declare function useScope(enforcedScope?: string): string;

/**
 * React Hook to dispatch an action in the current scope
 *
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @public
 */
export declare function useScopedDispatch(enforcedScope?: string): (scopedAction: (scope: string) => Action) => void;

/**
 * React Hook to get the value of an selector in the current scope
 *
 * @param scopedSelector - The selector
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @returns The value of the selector in the current scope
 * @public
 */
export declare function useScopedSelector<T>(scopedSelector: (state: ScopedState) => T, enforcedScope?: string): T;

/**
 * React Hook to obtain a reference to the scoped store
 *
 * @param enforcedScope - If provided, used as the scope instead of the current scope
 * @returns The scoped store
 * @public
 */
export declare function useScopedStore(enforcedScope?: string): {
    dispatch: (scopedAction: (scope: string) => Action) => void;
    getState: () => ScopedState;
    subscribe: (listener: () => void) => import("redux").Unsubscribe;
};

/** @public */
export declare const useSelector: <T>(selector: (state: Record<string, ScopedState>) => T) => T;

/** @public */
export declare const useStore: () => Store;

export { }
