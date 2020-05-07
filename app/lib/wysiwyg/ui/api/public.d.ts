/**
 * Provides utils for the User Interface
 *
 * @packageDocumentation
 */

import { faAnchor } from '@fortawesome/free-solid-svg-icons/faAnchor';
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons/faCaretSquareDown';
import { faCaretSquareUp } from '@fortawesome/free-solid-svg-icons/faCaretSquareUp';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faCut } from '@fortawesome/free-solid-svg-icons/faCut';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons/faDotCircle';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import { faEquals } from '@fortawesome/free-solid-svg-icons/faEquals';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faFileAudio } from '@fortawesome/free-solid-svg-icons/faFileAudio';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel';
import { faFileImage } from '@fortawesome/free-solid-svg-icons/faFileImage';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons/faFilePowerpoint';
import { faFileVideo } from '@fortawesome/free-solid-svg-icons/faFileVideo';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFilm } from '@fortawesome/free-solid-svg-icons/faFilm';
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faParagraph } from '@fortawesome/free-solid-svg-icons/faParagraph';
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPhotoVideo } from '@fortawesome/free-solid-svg-icons/faPhotoVideo';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import { faRandom } from '@fortawesome/free-solid-svg-icons/faRandom';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons/faRedoAlt';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faToolbox } from '@fortawesome/free-solid-svg-icons/faToolbox';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import * as StyledComponents from 'styled-components';
import { ThemeProps as ThemeProps_2 } from 'styled-components';

/**
 * Creates a function that maps {@link EditorThemeProps} to the current theme of the specified editor UI component
 *
 * @param key - The editor UI component
 * @param createDefaultTheme - The {@link EditorUiThemeFactory | factory} for the default theme
 * @returns A function that accepts {@link EditorThemeProps} and returns the current theme of the specified component
 * @public
 */
export declare function createEditorUiTheme<K extends keyof EditorUiTheme>(key: K, createDefaultTheme: EditorUiThemeFactory<K>): (theme: {
    editor: EditorTheme;
    editorUi: DeepPartial<EditorUiTheme>;
}) => EditorUiTheme[K];

/**
 * Creates an icon component
 *
 * @param i - The icon to use
 * @returns A component for the specified icon
 * @public
 */
export declare function createIcon(i: IconDefinition): React.ComponentType<{}>;

/**
 * Creates a function that maps {@link RendererThemeProps} to the current theme of the specified renderer UI component
 *
 * @param key - The renderer UI component
 * @param createDefaultTheme - The {@link RendererUiThemeFactory | factory} for the default theme
 * @returns A function that accepts {@link RendererThemeProps} and returns the current theme of the specified component
 * @public
 */
export declare function createRendererUiTheme<K extends keyof RendererUiTheme>(key: K, createDefaultTheme: RendererUiThemeFactory<K>): (theme: {
    renderer: RendererTheme;
    rendererUi: DeepPartial<RendererUiTheme>;
}) => RendererUiTheme[K];

/**
 * Helper type to be used to override the theme
 *
 * @public
 */
export declare type CustomTheme = DeepPartial<Theme>;

/** @public */
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends readonly (infer U)[] ? readonly DeepPartial<U>[] : T[P] extends Function ? T[P] : DeepPartial<T[P]>;
};

/** @public */
export declare const defaultEditorTheme: EditorTheme;

/** @public */
export declare const defaultRendererTheme: RendererTheme;

/** @public */
export declare interface EditorTheme {
    backgroundColor: string;
    color: string;
    primary: {
        color: string;
        background: string;
    };
    secondary: {
        color: string;
        background: string;
    };
    success: {
        color: string;
        background: string;
    };
    info: {
        color: string;
        background: string;
    };
    warning: {
        color: string;
        background: string;
    };
    danger: {
        color: string;
        background: string;
    };
}

/** @public */
export declare type EditorThemeProps = ThemeProps_2<{
    editor: EditorTheme;
    editorUi: DeepPartial<EditorUiTheme>;
}>;

/** @public */
export declare interface EditorUiTheme {
    button: {
        backgroundColor: string;
        color: string;
        borderColor: string;
        hoverBackgroundColor: string;
        hoverColor: string;
        hoverBorderColor: string;
    };
    checkbox: {
        boxSelectedColor: string;
        boxDeselectedColor: string;
        color: string;
    };
    input: {
        backgroundColor: string;
        color: string;
        highlightColor: string;
    };
    bottomToolbar: {
        backgroundColor: string;
        color: string;
    };
}

/** @public */
export declare type EditorUiThemeFactory<K extends keyof EditorUiTheme> = (theme: EditorTheme) => EditorUiTheme[K];

/** @public */
export declare const edtrAlignBlock = "M4 21h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z";

/** @public */
export declare const edtrAlignCenter = "M7 16c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm-3 5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-8h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z";

/** @public */
export declare const edtrAlignLeft = "M14 15H4c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm0-8H4c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zM4 13h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0 8h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z";

/** @public */
export declare const edtrAlignRight = "M4 21h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm6-4h10c.55 0 1-.45 1-1s-.45-1-1-1H10c-.55 0-1 .45-1 1s.45 1 1 1zm-6-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm6-4h10c.55 0 1-.45 1-1s-.45-1-1-1H10c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z";

/** @public */
export declare const edtrBold = "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5.78c2.07 0 3.96-1.69 3.97-3.77.01-1.53-.85-2.84-2.15-3.44zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z";

/** @public */
export declare const edtrClose = "M18.3,5.71 C17.91,5.32 17.28,5.32 16.89,5.71 L12,10.59 L7.11,5.7 C6.72,5.31 6.09,5.31 5.7,5.7 C5.31,6.09 5.31,6.72 5.7,7.11 L10.59,12 L5.7,16.89 C5.31,17.28 5.31,17.91 5.7,18.3 C6.09,18.69 6.72,18.69 7.11,18.3 L12,13.41 L16.89,18.3 C17.28,18.69 17.91,18.69 18.3,18.3 C18.69,17.91 18.69,17.28 18.3,16.89 L13.41,12 L18.3,7.11 C18.68,6.73 18.68,6.09 18.3,5.71 Z";

/** @public */
export declare const edtrColorText = "M10.63 3.93L6.06 15.58c-.27.68.23 1.42.97 1.42.43 0 .82-.27.98-.68L8.87 14h6.25l.87 2.32c.15.41.54.68.98.68.73 0 1.24-.74.97-1.42L13.37 3.93C13.14 3.37 12.6 3 12 3c-.6 0-1.15.37-1.37.93zM9.62 12L12 5.67 14.38 12H9.62z";

/** @public */
export declare const edtrDefaultPlugin = "M20.6190476,11.5238095 L19.1904762,11.5238095 L19.1904762,7.71428571 C19.1904762,6.65714286 18.3333333,5.80952381 17.2857143,5.80952381 L13.4761905,5.80952381 L13.4761905,4.38095238 C13.4761905,3.06598869 12.4102018,2 11.0952381,2 C9.78027441,2 8.71428571,3.06598869 8.71428571,4.38095238 L8.71428571,5.80952381 L4.9047619,5.80952381 C3.85279095,5.80952381 3,6.66231476 3,7.71428571 L3,11.3333333 L4.42857143,11.3333333 C5.85714286,11.3333333 7,12.4761905 7,13.9047619 C7,15.3333333 5.85714286,16.4761905 4.42857143,16.4761905 L3,16.4761905 L3,20.0952381 C3,21.147209 3.85279095,22 4.9047619,22 L8.52380952,22 L8.52380952,20.5714286 C8.52380952,19.1428571 9.66666667,18 11.0952381,18 C12.5238095,18 13.6666667,19.1428571 13.6666667,20.5714286 L13.6666667,22 L17.2857143,22 C18.3376852,22 19.1904762,21.147209 19.1904762,20.0952381 L19.1904762,16.2857143 L20.6190476,16.2857143 C21.9340113,16.2857143 23,15.2197256 23,13.9047619 C23,12.5897982 21.9340113,11.5238095 20.6190476,11.5238095 Z";

/** @public */
export declare const edtrDragHandle = "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z";

/** @public */
export declare const edtrFill = "M16.56 8.94L8.32.7C7.93.31 7.3.31 6.91.7c-.39.39-.39 1.02 0 1.41l1.68 1.68-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z";

/** @public */
export declare const edtrFormula = "M9.796061,6.84358189 L9.546061,9.73358189 L11.366061,9.73358189 C11.9183457,9.73358189 12.366061,10.1812971 12.366061,10.7335819 L12.366061,10.7335819 C12.366061,11.2858666 11.9183457,11.7335819 11.366061,11.7335819 L9.366061,11.7335819 L8.926061,16.8035819 C8.726061,19.0035819 6.786061,20.6335819 4.586061,20.4335819 C3.95133688,20.3777262 3.21218763,20.0027937 2.36861326,19.3087844 L2.3686112,19.3087869 C1.93754177,18.9541458 1.8755844,18.3172015 2.23022554,17.8861321 C2.25098506,17.8608987 2.27295601,17.8366869 2.296061,17.8135819 L2.296061,17.8135819 C2.68943711,17.4202058 3.31879167,17.3943638 3.74309403,17.7541652 C4.42335978,18.3310001 5.0243456,18.5341427 5.546061,18.3635819 C6.326061,18.1235819 6.876061,17.4335819 6.946061,16.6235819 L7.366061,11.7335819 L5.366061,11.7335819 C4.81377625,11.7335819 4.366061,11.2858666 4.366061,10.7335819 L4.366061,10.7335819 C4.366061,10.1812971 4.81377625,9.73358189 5.366061,9.73358189 L7.546061,9.73358189 L7.816061,6.66358189 C8.006061,4.46358189 9.936061,2.83358189 12.146061,3.01358189 C12.7876823,3.06959645 13.5343235,3.45039469 14.3859845,4.15597662 L14.3859731,4.15599041 C14.8171452,4.51320676 14.8770982,5.1523219 14.5198819,5.58349402 C14.4997127,5.60783893 14.4784158,5.63122712 14.456061,5.65358189 L14.456061,5.65358189 C14.077745,6.03189793 13.4644763,6.03223098 13.0857495,5.65432608 C12.6951429,5.26458609 12.3219165,5.05433484 11.966061,5.02358189 C10.866061,4.92358189 9.896061,5.73358189 9.796061,6.84358189 Z M20.841061,12.6785819 L20.841061,12.6785819 C20.4517003,12.2892211 19.8204217,12.2892211 19.431061,12.6785819 L17.306061,14.8035819 L15.1860786,12.6835995 C14.7931405,12.2906614 14.1567565,12.2884206 13.761061,12.6785819 L13.761061,12.6785819 C13.3689485,13.0652103 13.3645027,13.6965046 13.7511312,14.0886171 C13.7527745,14.0902837 13.7544236,14.0919445 13.7560786,14.0935995 L15.896061,16.2335819 L13.7610785,18.3385997 C13.3717179,18.7224956 13.3672879,19.3493438 13.7511838,19.7387045 C13.7544529,19.7420201 13.7577454,19.7453127 13.761061,19.7485819 L13.761061,19.7485819 C14.1567565,20.1387432 14.7931405,20.1365024 15.1860786,19.7435643 L17.306061,17.6235819 L19.431061,19.7485819 C19.8204217,20.1379426 20.4517003,20.1379426 20.841061,19.7485819 L20.841061,19.7485819 C21.2290435,19.3605994 21.2290435,18.7315555 20.841061,18.343573 C20.8402306,18.3427426 20.8393988,18.3419137 20.8385654,18.3410863 L18.716061,16.2335819 L20.8435477,14.0910599 C21.2319346,13.6999283 21.2308227,13.0683435 20.841061,12.6785819 Z";

/**
 * Edtr.io icon component
 *
 * @param props - An Edtr.io icon definition and an optional className
 * @returns The icon
 * @public
 */
export declare function EdtrIcon(props: {
    icon: string;
    className?: string;
}): JSX.Element;

/** @public */
export declare const edtrItalic = "M10 5.5c0 .83.67 1.5 1.5 1.5h.71l-3.42 8H7.5c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18h5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.71l3.42-8h1.29c.83 0 1.5-.67 1.5-1.5S17.33 4 16.5 4h-5c-.83 0-1.5.67-1.5 1.5z";

/** @public */
export declare const edtrLink = "M17 7h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9 5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1zm2 3H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h3c.55 0 1-.45 1-1s-.45-1-1-1H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h3c.55 0 1-.45 1-1s-.45-1-1-1z";

/** @public */
export declare const edtrListBullets = "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0-6h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 6c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z";

/** @public */
export declare const edtrListNumbered = "M8 7h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm12 10H8c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zm0-6H8c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM4.5 16h-2c-.28 0-.5.22-.5.5s.22.5.5.5H4v.5h-.5c-.28 0-.5.22-.5.5s.22.5.5.5H4v.5H2.5c-.28 0-.5.22-.5.5s.22.5.5.5h2c.28 0 .5-.22.5-.5v-3c0-.28-.22-.5-.5-.5zm-2-11H3v2.5c0 .28.22.5.5.5s.5-.22.5-.5v-3c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5s.22.5.5.5zm2 5h-2c-.28 0-.5.22-.5.5s.22.5.5.5h1.3l-1.68 1.96c-.08.09-.12.21-.12.32v.22c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H3.2l1.68-1.96c.08-.09.12-.21.12-.32v-.22c0-.28-.22-.5-.5-.5z";

/** @public */
export declare const edtrPlus = "M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M16,13 L13,13 L13,16 C13,16.55 12.55,17 12,17 C11.45,17 11,16.55 11,16 L11,13 L8,13 C7.45,13 7,12.55 7,12 C7,11.45 7.45,11 8,11 L11,11 L11,8 C11,7.45 11.45,7 12,7 C12.55,7 13,7.45 13,8 L13,11 L16,11 C16.55,11 17,11.45 17,12 C17,12.55 16.55,13 16,13 Z";

/** @public */
export declare const edtrQuote = "M7.17 17c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94zm10 0c.51 0 .98-.29 1.2-.74l1.42-2.84c.14-.28.21-.58.21-.89V8c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h2l-1.03 2.06c-.45.89.2 1.94 1.2 1.94z";

/** @public */
export declare const edtrSearch = "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z";

/** @public */
export declare const edtrText = "M2.5 5.5C2.5 6.33 3.17 7 4 7h3.5v10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V7H14c.83 0 1.5-.67 1.5-1.5S14.83 4 14 4H4c-.83 0-1.5.67-1.5 1.5zM20 9h-6c-.83 0-1.5.67-1.5 1.5S13.17 12 14 12h1.5v5.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12H20c.83 0 1.5-.67 1.5-1.5S20.83 9 20 9z";
export { faAnchor }
export { faCaretSquareDown }
export { faCaretSquareUp }
export { faCheck }
export { faCheckCircle }
export { faCheckSquare }
export { faCloudUploadAlt }
export { faCode }
export { faCog }
export { faCopy }
export { faCubes }
export { faCut }
export { faDotCircle }
export { faEllipsisH }
export { faEquals }
export { faExternalLinkAlt }
export { faFileAlt }
export { faFileArchive }
export { faFileAudio }
export { faFileDownload }
export { faFileExcel }
export { faFileImage }
export { faFilePdf }
export { faFilePowerpoint }
export { faFileVideo }
export { faFileWord }
export { faFilm }
export { faImages }
export { faKeyboard }
export { faLightbulb }
export { faLink }
export { faMinus }
export { faNewspaper }
export { faParagraph }
export { faPaste }
export { faPencilAlt }
export { faPhotoVideo }
export { faPlus }
export { faQuestionCircle }
export { faQuoteRight }
export { faRandom }
export { faRedoAlt }
export { faSearch }
export { faSmile }
export { faSortDown }
export { faSortUp }
export { faSpinner }
export { faTable }
export { faTimes }
export { faToolbox }
export { faTrashAlt }

/**
 * Font Awesome Icon component
 *
 * @param props - Most of {@link https://github.com/FortAwesome/react-fontawesome | FontAwesomeIconProps}
 * @public
 */
export declare function Icon(props: FontAwesomeIconProps): JSX.Element;

/** @public */
export declare interface RendererTheme {
    backgroundColor: string;
    color: string;
    primary: {
        color: string;
        background: string;
    };
    secondary: {
        color: string;
        background: string;
    };
    success: {
        color: string;
        background: string;
    };
    info: {
        color: string;
        background: string;
    };
    warning: {
        color: string;
        background: string;
    };
    danger: {
        color: string;
        background: string;
    };
}

/** @public */
export declare type RendererThemeProps = ThemeProps_2<{
    renderer: RendererTheme;
    rendererUi: DeepPartial<RendererUiTheme>;
}>;

/** @public */
export declare interface RendererUiTheme {
    expandableBox: {
        containerBorderColor: string;
        toggleBackgroundColor: string;
        toggleColor: string;
    };
    submitButton: {
        backgroundColor: string;
        hoverBackgroundColor: string;
        color: string;
        correctBackgroundColor: string;
        wrongBackgroundColor: string;
    };
}

/** @public */
export declare type RendererUiThemeFactory<K extends keyof RendererUiTheme> = (theme: RendererTheme) => RendererUiTheme[K];

/**
 * Provider to hydrate the context for the {@link Theme | Theme}
 *
 * @remarks
 * You probably don't want to use this component directly since it is already used by the core.
 * If you want to override the theme in some plugin, you probably want to use {@link ThemeProvider | ThemeProvider} instead.
 *
 * @param props - A {@link CustomTheme | CustomTheme} that will be deeply merged with the {@link Theme | default Theme}, and children
 * @public
 */
export declare function RootThemeProvider(props: StyledComponents.ThemeProviderProps<CustomTheme>): JSX.Element;

/**
 * Re-export of {@link https://styled-components.com/docs/api#primary | `styled` in `styled-components` }
 *
 * @public
 */
export declare const styled: StyledComponents.ThemedStyledInterface<StyledComponents.DefaultTheme>;

/**
 * Interface of an Edtr.io theme
 *
 * @public */
export declare interface Theme {
    editor: EditorTheme;
    editorUi: DeepPartial<EditorUiTheme>;
    renderer: RendererTheme;
    rendererUi: DeepPartial<RendererUiTheme>;
}

/**
 * Context used for the {@link Theme | Theme}, see also {@link https://styled-components.com/docs/advanced#theming | Theming }
 *
 * @public
 */
export declare const ThemeContext: React.Context<Theme>;

/**
 * Props that any styled-components automatically receive, see also {@link https://styled-components.com/docs/advanced#theming | Theming }
 *
 * @public
 */
export declare type ThemeProps = StyledComponents.ThemeProps<Theme>;

/**
 * Provider to override the current {@link Theme | theme}
 *
 * @param props - A {@link CustomTheme | CustomTheme} that will be deeply merged with the {@link Theme | current Theme}, and children
 * @public
 */
export declare function ThemeProvider(props: StyledComponents.ThemeProviderProps<CustomTheme>): JSX.Element;

/**
 * React Hook for the editor theming
 *
 * @returns An object containing the current {@link EditorTheme | editor theme} and {@link EditorUiTheme | editor UI theme}
 * @public
 */
export declare function useEditorTheme(): {
    editor: EditorTheme;
    editorUi: DeepPartial<EditorUiTheme>;
};

/**
 * React Hook for the theme of an editor UI component
 *
 * @param key - The editor UI component
 * @param createDefaultTheme - The {@link EditorUiThemeFactory | factory} for the default theme
 * @returns The current theme of the specified component
 * @public
 */
export declare function useEditorUiTheme<K extends keyof EditorUiTheme>(key: K, createDefaultTheme: EditorUiThemeFactory<K>): EditorUiTheme[K];

/**
 * React Hook for the renderer theming
 *
 * @returns An object containing the current {@link RendererTheme | renderer theme} and {@link RendererUiTheme | renderer UI theme}
 * @public
 */
export declare function useRendererTheme(): {
    renderer: RendererTheme;
    rendererUi: DeepPartial<RendererUiTheme>;
};

/**
 * React Hook for the theme of a renderer UI component
 *
 * @param key - The renderer UI component
 * @param createDefaultTheme - The {@link RendererUiThemeFactory | factory} for the default theme
 * @returns The current theme of the specified component
 * @public
 */
export declare function useRendererUiTheme<K extends keyof RendererUiTheme>(key: K, createDefaultTheme: RendererUiThemeFactory<K>): RendererUiTheme[K];

/**
 * React Hook to get the current {@link Theme | Theme}
 *
 * @returns The current {@link Theme | Theme}
 * @public
 */
export declare function useTheme(): Theme;

export { }
