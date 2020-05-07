import { BlockJSON } from 'slate';
import { DeepPartial } from '@edtr-io/ui';
import { Editor } from 'slate-react';
import { EditorPlugin } from '@edtr-io/plugin';
import { EditorPluginProps } from '@edtr-io/plugin';
import { EditorProps } from 'slate-react';
import { InlineJSON } from 'slate';
import { MarkJSON } from 'slate';
import { Plugin } from 'slate-react';
import * as React from 'react';
import { RenderBlockProps } from 'slate-react';
import { RenderInlineProps } from 'slate-react';
import { RenderMarkProps } from 'slate-react';
import { Rule } from 'slate-html-serializer';
import { SerializedScalarStateType } from '@edtr-io/plugin';
import { Serializer } from '@edtr-io/plugin';
import { useScopedStore } from '@edtr-io/core';
import { Value } from 'slate';
import { ValueJSON } from 'slate';

/** @public */
export declare type BlockEditorProps = RenderBlockProps;

/** @public */
export declare interface BlockRendererProps {
    node: BlockJSON;
}

/**
 * @param config - {@link TextConfig | Plugin configuration}
 * @public
 */
export declare function createTextPlugin(config: TextConfig): EditorPlugin<TextPluginState, TextPluginConfig>;

/**
 * @param html - The HTML string that should be deserialized to a Slate value
 * @internal
 */
export declare function htmlToSlateValue(html: string): Value;

/** @public */
export declare type InlineEditorProps = RenderInlineProps;

/** @public */
export declare interface InlineRendererProps {
    node: InlineJSON;
}

/**
 * @param value - Current {@link https://docs.slatejs.org/v/v0.47/slate-core/value | value}
 * @public
 */
export declare function isValueEmpty(value: Value): boolean;

/** @public */
export declare type MarkEditorProps = RenderMarkProps;

/** @public */
export declare interface MarkRendererProps {
    mark: MarkJSON;
}

/** @public */
export declare type NewElement = NewParagraphElement | NewHeadingElement | NewLinkElement | NewMathElement | NewOrderedListElement | NewUnorderedListElement | NewListItemElement | NewListItemChildElement;

/** @public */
export declare interface NewHeadingElement {
    type: 'h';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: NewNode[];
}

/** @public */
export declare interface NewLinkElement {
    type: 'a';
    href: string;
    children: NewNode[];
}

/** @public */
export declare interface NewListItemChildElement {
    type: 'list-item-child';
    children: NewNode[];
}

/** @public */
export declare interface NewListItemElement {
    type: 'list-item';
    children: NewNode[];
}

/** @public */
export declare interface NewMathElement {
    type: 'math';
    src: string;
    inline: boolean;
    children: NewNode[];
}

/** @public */
export declare type NewNode = NewText | NewElement;

/** @public */
export declare interface NewOrderedListElement {
    type: 'ordered-list';
    children: NewNode[];
}

/** @public */
export declare interface NewParagraphElement {
    type: 'p';
    children: NewNode[];
}

/** @public */
export declare interface NewText {
    text: string;
    color?: number;
    em?: boolean;
    strong?: boolean;
}

/** @public */
export declare interface NewUnorderedListElement {
    type: 'unordered-list';
    children: NewNode[];
}

/** @public */
export declare type NodeControlsProps = EditorProps & {
    editor: Editor;
};

/** @public */
export declare type NodeEditorProps = BlockEditorProps | InlineEditorProps;

/** @public */
export declare type NodeRendererProps = BlockRendererProps | InlineRendererProps;

/** @public */
export declare interface OldColorMark {
    object: 'mark';
    type: '@splish-me/color';
    data: {
        colorIndex: number;
    };
}

/** @public */
export declare type OldElement = OldParagraphElement | OldHeadingElement | OldLinkElement | OldKatexInlineElement | OldKatexBlockElement | OldOrderedListElement | OldUnorderedListElement | OldListItemElement | OldListItemChildElement;

/** @public */
export declare interface OldEmphasizeMark {
    object: 'mark';
    type: '@splish-me/em';
}

/** @public */
export declare interface OldHeadingElement {
    object: 'block';
    type: '@splish-me/h1' | '@splish-me/h2' | '@splish-me/h3' | '@splish-me/h4' | '@splish-me/h5' | '@splish-me/h6';
    nodes: OldNode[];
}

/** @public */
export declare interface OldKatexBlockElement {
    object: 'block';
    type: '@splish-me/katex-block';
    data: {
        formula: string;
        inline: false;
    };
    isVoid: true;
    nodes: OldNode[];
}

/** @public */
export declare interface OldKatexInlineElement {
    object: 'inline';
    type: '@splish-me/katex-inline';
    data: {
        formula: string;
        inline: true;
    };
    isVoid: true;
    nodes: OldNode[];
}

/** @public */
export declare interface OldLinkElement {
    object: 'inline';
    type: '@splish-me/a';
    data: {
        href: string;
    };
    nodes: OldNode[];
}

/** @public */
export declare interface OldListItemChildElement {
    object: 'block';
    type: 'list-item-child';
    nodes: OldNode[];
}

/** @public */
export declare interface OldListItemElement {
    object: 'block';
    type: 'list-item';
    nodes: OldNode[];
}

/** @public */
export declare type OldMark = OldStrongMark | OldEmphasizeMark | OldColorMark;

/** @public */
export declare type OldNode = OldText | OldElement;

/** @public */
export declare interface OldOrderedListElement {
    object: 'block';
    type: 'ordered-list';
    nodes: OldNode[];
}

/** @public */
export declare interface OldParagraphElement {
    object: 'block';
    type: 'paragraph';
    nodes: OldNode[];
}

/** @public */
export declare interface OldStrongMark {
    object: 'mark';
    type: '@splish-me/strong';
}

/** @public */
export declare interface OldText {
    object: 'text';
    text: string;
    marks?: OldMark[];
}

/** @public */
export declare interface OldUnorderedListElement {
    object: 'block';
    type: 'unordered-list';
    nodes: OldNode[];
}

/** @public */
export declare const serializer: Serializer<NewNode[], ValueJSON>;

/** @public */
export declare interface SlateClosure {
    id: TextProps['id'];
    config: TextPluginConfig;
    store: ReturnType<typeof useScopedStore>;
}

/** @public */
export declare type SlatePluginClosure = React.RefObject<SlateClosure>;

/**
 * @param value - The Slate value that should be serialized as HTML
 * @internal
 */
export declare function slateValueToHtml(value: Value): string;

/** @public */
export declare interface TextConfig {
    placeholder?: TextPluginConfig['placeholder'];
    plugins?: {
        suggestions?: boolean;
        math?: boolean;
        headings?: boolean;
        lists?: boolean;
        colors?: boolean;
    };
    registry: TextPluginConfig['registry'];
    i18n?: DeepPartial<TextPluginConfig['i18n']>;
    theme?: DeepPartial<TextPluginConfig['theme']>;
    blockquote?: string;
}

/** @public */
export declare type TextPlugin = Plugin & Rule & {
    commands?: {
        [key: string]: (editor: Editor, ...args: any[]) => Editor;
    };
};

/** @public */
export declare interface TextPluginConfig {
    placeholder: string;
    plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[];
    registry: {
        name: string;
        title?: string;
        description?: string;
    }[];
    i18n: {
        blockquote: {
            toggleTitle: string;
        };
        colors: {
            setColorTitle: string;
            resetColorTitle: string;
            openMenuTitle: string;
            closeMenuTitle: string;
        };
        headings: {
            setHeadingTitle(level: number): string;
            openMenuTitle: string;
            closeMenuTitle: string;
        };
        link: {
            toggleTitle: string;
            placeholder: string;
            openInNewTabTitle: string;
        };
        list: {
            toggleOrderedList: string;
            toggleUnorderedList: string;
            openMenuTitle: string;
            closeMenuTitle: string;
        };
        math: {
            toggleTitle: string;
            displayBlockLabel: string;
            placeholder: string;
            editors: {
                visual: string;
                latex: string;
                noVisualEditorAvailableMessage: string;
            };
            helpText(KeySpan: React.ComponentType<{
                children: React.ReactNode;
            }>): React.ReactNode;
        };
        richText: {
            toggleStrongTitle: string;
            toggleEmphasizeTitle: string;
        };
        suggestions: {
            noResultsMessage: string;
        };
    };
    theme: {
        backgroundColor: string;
        color: string;
        hoverColor: string;
        active: {
            backgroundColor: string;
            color: string;
        };
        dropDown: {
            backgroundColor: string;
        };
        suggestions: {
            background: {
                default: string;
                highlight: string;
            };
            text: {
                default: string;
                highlight: string;
            };
        };
        plugins: {
            colors: {
                colors: string[];
                defaultColor: string;
            };
        };
    };
    blockquote?: string;
}

/** @public */
export declare type TextPluginState = SerializedScalarStateType<NewNode[], ValueJSON>;

/** @public */
export declare type TextProps = EditorPluginProps<TextPluginState, TextPluginConfig>;

export { }
