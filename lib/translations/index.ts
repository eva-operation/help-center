import { en } from './en';
import { zh } from './zh';
import { tr } from './tr';

export const translations = {
    en,
    zh,
    tr,
};

export type Language = keyof typeof translations;
export type TranslationType = typeof en;
