import { DeepPartial } from '@edtr-io/ui';
import { DocumentEditorProps } from '@edtr-io/document-editor/beta';
import * as React from 'react';

/**
 * Creates the default {@link @edtr-io/document-editor#DocumentEditorProps | document editor}
 *
 * @param config - Configuration
 * @returns The default {@link @edtr-io/document-editor#DocumentEditorProps | document editor}
 * @beta
 */
export declare function createDefaultDocumentEditor(config?: DefaultDocumentEditorConfig): React.ComponentType<DocumentEditorProps>;

/** @beta */
export declare interface DefaultDocumentEditorConfig {
    i18n?: DeepPartial<{
        modal: {
            title: string;
            closeLabel: string;
        };
    }>;
}

export { }
