import { dispatcher } from '../store';
import { getAboutUsContent, getFAQContent, getTermsAndConditions } from '../services/api/app';

export function performSetupBreadcrumbs(breadcrumbs) {
    dispatcher.dispatchAction('SETUP_BREADCRUMBS', breadcrumbs);
}

export function performSetupLoaderVisibility(id, waiting) {
    dispatcher.dispatchAction('SETUP_LOADER_VISIBILITY', { id, waiting });
}

export function performSetupLocale(locale) {
    dispatcher.dispatchAction('SETUP_LOCALE', locale);
    dispatcher.dispatchPromise(getAboutUsContent, 'GET_ABOUT_US', state => state.App.localization.loading.aboutUs, [
        locale
    ]);
    dispatcher.dispatchPromise(getFAQContent, 'GET_FAQ', state => state.App.localization.loading.faq, [locale]);
    dispatcher.dispatchPromise(
        getTermsAndConditions,
        'GET_TERMS_AND_CONDITIONS',
        state => state.App.localization.loading.termsAndConditions,
        [locale]
    );
}
