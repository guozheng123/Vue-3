declare module '*.js';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

type TpfCity = {
    label: string;
    value: string;
    children: TpfCity[];
};

declare module 'element-china-area-data' {
    declare const regionData: TpfCity[];
}
