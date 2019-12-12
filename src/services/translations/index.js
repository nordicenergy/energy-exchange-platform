import en from './en.json';
import de from './de.json';

const locales = { en,de };

export function getTranslationOf(name) {
    const translations = locales[document.documentElement.getAttribute('lang') || 'de'];
    return translations[name];
}

export default { en };
