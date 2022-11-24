import { sanitize } from 'string-sanitizer';

export function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace(/ /gi, "_");

    return slug;
}

export function sanitizeText(text: string) {
    let textSanitized = "";
    textSanitized = sanitize.keepSpace(text);
    textSanitized = textSanitized.trim();

    return textSanitized;
}

export function sanitizeSlug(text: string) {
    let textSanitized = "";
    textSanitized = text.replace(/_/gi, " ");
    textSanitized = sanitize.addUnderscore(textSanitized);
    textSanitized = textSanitized.trim();

    return textSanitized;
}

export function validate(name: string) {
    if (name.length > 30) return false;
    return true;
}