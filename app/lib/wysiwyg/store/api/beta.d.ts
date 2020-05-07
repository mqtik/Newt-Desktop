import { EditorPlugin } from '@edtr-io/internal__plugin';
import { StateExecutor } from '@edtr-io/internal__plugin-state';
import { StateUpdater } from '@edtr-io/internal__plugin-state';
import { Store as Store_2 } from 'redux';
import { StoreEnhancer } from 'redux';

/** @public */
export declare type Action = ClipboardAction | DocumentsAction | FocusAction | HistoryAction | PluginAction | RootAction | SetPartialState;

/**
 * Action creators
 */
/** @public */
export declare type ActionCreator<T = string, P = any> = ActionCreatorWithoutPayload<T> | ActionCreatorWithPayload<T, P>;

/** @public */
export declare type ActionCreatorAction<T extends ActionCreator> = ReturnType<ReturnType<T>>;

/** @public */
export declare interface ActionCreatorWithoutPayload<T = string> {
    (): (scope: string) => {
        type: T;
        scope: string;
    };
    type: T;
}

/** @public */
export declare interface ActionCreatorWithPayload<T = string, P = any> {
    (payload: P): (scope: string) => {
        type: T;
        payload: P;
        scope: string;
    };
    type: T;
}

/** @public */
export declare const blur: ActionCreatorWithoutPayload<'Blur'>;

/** @public */
export declare type BlurAction = ActionCreatorAction<typeof blur>;

/** @public */
export declare const change: ActionCreatorWithPayload<'Change', {
    id: string;
    state: {
        initial: StateUpdater<unknown>;
        executor?: StateExecutor<StateUpdater<unknown>>;
    };
}>;

/** @public */
export declare type ChangeAction = ActionCreatorAction<typeof change>;

/** @public */
export declare type ChangeListener = (payload: {
    changed: boolean;
    getDocument: () => SelectorReturnType<typeof serializeRootDocument>;
}) => void;

/** @public */
export declare type ClipboardAction = CopyAction;

/** @beta */
export declare const copy: ActionCreatorWithPayload<'Copy', string | null>;

/** @public */
export declare interface CopyAction {
    type: 'Copy';
    payload: string | null;
    scope: string;
}

/**
 * Creates the Edtr.io store
 *
 * @returns The Edtr.io store
 * @public
 */
export declare function createStore<K extends string>({ scopes, createEnhancer }: StoreOptions<K>): {
    store: Store_2<State, Action>;
};

/** @public */
export declare type DocumentsAction = InsertAction | RemoveAction | ChangeAction | WrapAction | UnwrapAction | ReplaceAction;

/** @public */
export declare interface DocumentState {
    plugin: string;
    state: unknown;
}

/**
 * Finds the next node in a focus tree in focus order
 *
 * @param root - focus tree
 * @param from - id of the current document
 * @returns the id of the next document if it exists (`null` otherwise)
 * @public
 */
export declare function findNextNode(root: Node, from: string): string | null;

/**
 * Finds the parent node of an id in the focus tree
 *
 * @param root - focus tree
 * @param id - id of the current node
 * @returns the `Node` of the parent, if the id exists in the focus tree. (`null` otherwise)
 * @public
 */
export declare function findParent(root: Node, id: string): Node | null;

/**
 * Finds the previous node in a focus tree in focus order
 *
 * @param root - focus tree
 * @param from - id of the current document
 * @returns the id of the previous document if it exists (`null` otherwise)
 * @public
 */
export declare function findPreviousNode(root: Node, from: string): string | null;

/** @public */
export declare const focus: ActionCreatorWithPayload<'Focus', string>;

/** @public */
export declare type FocusAction = BlurAction | FocusDocumentAction | FocusNextDocumentAction | FocusPreviousDocumentAction;

/** @public */
export declare type FocusDocumentAction = ActionCreatorAction<typeof focus>;

/** @public */
export declare const focusNext: ActionCreatorWithoutPayload<'FocusNext'>;

/** @public */
export declare type FocusNextDocumentAction = ActionCreatorAction<typeof focusNext>;

/** @public */
export declare const focusPrevious: ActionCreatorWithoutPayload<'FocusPrevious'>;

/** @public */
export declare type FocusPreviousDocumentAction = ActionCreatorAction<typeof focusPrevious>;

/** @beta */
export declare const getClipboard: Selector<DocumentState[]>;

/** @public */
export declare const getDocument: Selector<DocumentState | null, [string | null]>;

/** @public */
export declare const getDocuments: Selector<Record<string, DocumentState>>;

/**
 * [[Selector]] that returns the id of the focused element (if there is any)
 *
 * @returns id of the focused element (`null` if there is no focused element)
 * @public
 */
export declare const getFocused: Selector<string | null, []>;

/**
 * [[Selector]] that returns the focus path from the leaf with the given id
 *
 * @param defaultLeaf - optional id of the document that should be considered as the leaf of the focus path. By default, we use the currently focused document of the current scope
 * @returns an array of ids of the documents that are part of the focus path (i.e. the focused document and their ancestors). `null`, if there exists no focus path
 * @public
 */
export declare const getFocusPath: Selector<string[] | null, [string?]>;

/**
 * [[Selector]] that returns the focus tree from the root document with the given id
 *
 * @param id - optional id of the document that should be considered as the root of the focus tree. By default, we use the root document of the current scope
 * @returns the [[focus tree|Node]] if it exists (`null` otherwise)
 * @public
 */
export declare const getFocusTree: Selector<Node | null, [string?]>;

/** @public */
export declare const getParent: Selector<Node | null, [string]>;

/** @public */
export declare const getPendingChanges: Selector<number>;

/** @public */
export declare const getPlugin: Selector<EditorPlugin<import("@edtr-io/internal__plugin-state").StateType<any, any, any>, {}> | null, [string]>;

/** @public */
export declare const getPlugins: Selector<Record<string, EditorPlugin>>;

/** @public */
export declare const getRoot: Selector<string | null>;

/**
 * Gets the {@link ScopedState | state} of a scope
 *
 * @param state - The current {@link State | state}
 * @param scope - The scope
 * @returns The {@link ScopedState | state} of the specified scope
 * @public
 */
export declare function getScope(state: State, scope: string): ScopedState;

/**
 * [[Selector]] that checks whether the document with the given id has a focused child. In contrast to [[hasFocusedDescendant]], this only returns `true` if the focused document is a direct child of the document.
 *
 * @param id - id of the document to check
 * @returns `true` if the given document has a focused child
 * @public
 */
export declare const hasFocusedChild: Selector<boolean, [string]>;

/**
 * [[Selector]] that checks whether the document with the given id has a focused descendant. In contrast to [[hasFocusedChild]], this also returns `true` if the focused document is an indirect child (e.g. a child of a child of a child).
 *
 * @param id - id of the document to check
 * @returns `true` if the given document has a focused descendant
 * @public
 */
export declare const hasFocusedDescendant: Selector<boolean, [string]>;

/** @public */
export declare const hasPendingChanges: Selector<boolean>;

/** @public */
export declare type HistoryAction = PersistAction | ResetAction | UndoAction | RedoAction;

/** @public */
export declare const initRoot: ActionCreatorWithPayload<'InitRoot', {
    initialState: {
        plugin: string;
        state?: unknown;
    };
    plugins: Record<string, EditorPlugin>;
}>;

/** @public */
export declare type InitRootAction = ActionCreatorAction<typeof initRoot>;

/** @public */
export declare const insert: ActionCreatorWithPayload<"Insert", {
    id: string;
    plugin: string;
    state?: unknown;
}>;

/** @public */
export declare type InsertAction = ActionCreatorAction<typeof insert>;

/** @public */
export declare const insertChildAfter: ActionCreatorWithPayload<'InsertChildAfter', {
    parent: string;
    sibling?: string;
    document?: {
        plugin: string;
        state?: unknown;
    };
}>;

/** @public */
export declare type InsertChildAfterAction = ActionCreatorAction<typeof insertChildAfter>;

/** @public */
export declare const insertChildBefore: ActionCreatorWithPayload<"InsertChildBefore", {
    parent: string;
    sibling: string;
    document?: {
        plugin: string;
        state?: unknown;
    } | undefined;
}>;

/** @public */
export declare type InsertChildBeforeAction = ActionCreatorAction<typeof insertChildBefore>;

/**
 * Checks whether the given document is empty
 *
 * @param doc - The document
 * @param plugin - The plugin
 * @returns `True` if the specified document is empty
 * @public
 */
export declare function isDocumentEmpty(doc: DocumentState | null, plugin: EditorPlugin | null): boolean;

/** @public */
export declare const isEmpty: Selector<boolean, [string]>;

/**
 * [[Selector]] that checks whether the document with the given id is focused
 *
 * @param id - id of the document to check
 * @returns `true` if the given document is focused
 * @public
 */
export declare const isFocused: Selector<boolean, [string]>;

/** @public */
export declare const mayInsertChild: Selector<boolean, [string]>;

/** @public */
export declare const mayRemoveChild: Selector<boolean, [string]>;

/** @public */
export declare interface Node {
    id: string;
    children?: Node[];
}

/** @public */
export declare const persist: ActionCreatorWithoutPayload<"Persist">;

/** @public */
export declare type PersistAction = ActionCreatorAction<typeof persist>;

/** @public */
export declare type PluginAction = InsertChildBeforeAction | InsertChildAfterAction | RemoveChildAction;

/** @public */
export declare const redo: ActionCreatorWithoutPayload<'Redo'>;

/** @public */
export declare type RedoAction = ActionCreatorAction<typeof redo>;

/** @public */
export declare const remove: ActionCreatorWithPayload<"Remove", string>;

/** @public */
export declare type RemoveAction = ActionCreatorAction<typeof remove>;

/** @public */
export declare const removeChild: ActionCreatorWithPayload<'RemoveChild', {
    parent: string;
    child: string;
}>;

/** @public */
export declare type RemoveChildAction = ActionCreatorAction<typeof removeChild>;

/** @public */
export declare const replace: ActionCreatorWithPayload<'Replace', {
    id: string;
    plugin: string;
    state?: unknown;
}>;

/** @public */
export declare type ReplaceAction = ActionCreatorAction<typeof replace>;

/** @public */
export declare const reset: ActionCreatorWithoutPayload<"Reset">;

/** @public */
export declare type ResetAction = ActionCreatorAction<typeof reset>;

/** @public */
export declare type RootAction = InitRootAction;

/** @public */
export declare interface ScopedState {
    plugins: Record<string, EditorPlugin>;
    documents: Record<string, DocumentState>;
    focus: string | null;
    root: string | null;
    clipboard: DocumentState[];
    history: unknown;
}

/**
 * Selectors
 */
/** @public */
export declare type Selector<T = any, P extends any[] = []> = (...args: P) => (scopedState: ScopedState) => T;

/** @public */
export declare type SelectorReturnType<T extends Selector<any, any>> = ReturnType<ReturnType<T>>;

/**
 * Serializes the document with the given `id`
 *
 * @param id - The id of the document
 * @returns The serialization
 * @public
 */
export declare const serializeDocument: Selector<{
    plugin: string;
    state: any;
} | null, [string | null]>;

/** @public */
export declare const serializeRootDocument: Selector<{
    plugin: string;
    state: any;
} | null>;

/** @public */
export declare type SetPartialState = ActionCreatorAction<typeof setPartialState>;

/** @public */
export declare const setPartialState: ActionCreatorWithPayload<"SetPartialState", Partial<ScopedState>>;

/**
 * Store state
 */
/** @public */
export declare type State = Record<string, ScopedState>;

/** @public */
export declare type Store = Store_2<State, Action>;

/** @public */
export declare type StoreEnhancerFactory = (defaultEnhancer: StoreEnhancer) => StoreEnhancer<{}, {}>;

/** @public */
export declare interface StoreOptions<K extends string> {
    scopes: Record<string, Record<K, EditorPlugin>>;
    createEnhancer: StoreEnhancerFactory;
}

/** @public */
export declare const undo: ActionCreatorWithoutPayload<'Undo'>;

/** @public */
export declare type UndoAction = ActionCreatorAction<typeof undo>;

/** @public */
export declare const unwrap: ActionCreatorWithPayload<'Unwrap', {
    id: string;
    oldId: string;
}>;

/** @public */
export declare type UnwrapAction = ActionCreatorAction<typeof unwrap>;

/** @public */
export declare const wrap: ActionCreatorWithPayload<'Wrap', {
    id: string;
    document: (id: string) => DocumentState;
}>;

/** @public */
export declare type WrapAction = ActionCreatorAction<typeof wrap>;

export { }
