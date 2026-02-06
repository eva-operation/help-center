import { en } from './en';
import { tr } from './tr';
import { zh } from './zh';

export const translations = {
    en,
    tr,
    zh,
};

export type Language = keyof typeof translations;
export type TranslationType = typeof en;
