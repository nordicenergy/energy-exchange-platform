export const initialState = {
    breadCrumbs: { data: [] },
    loader: { data: {} },
    localization: {
        data: {
            locale: localStorage.getItem('locale'),
            aboutUs: [],
            faq: [],
            termsAndConditions: []
        },
        loading: {
            faq: false,
            aboutUs: false,
            termsAndConditions: false
        },
        error: {
            faq: null,
            aboutUs: null,
            termsAndConditions: null
        }
    }
};

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case 'SETUP_BREADCRUMBS':
            const newBreadcrumbs = action.payload ? action.payload : initialState.breadCrumbs.data;
            return {
                ...state,
                breadCrumbs: {
                    data: newBreadcrumbs
                }
            };
        case 'SETUP_LOADER_VISIBILITY': {
            const { id = 'unknown', waiting = false } = action.payload || {};
            return {
                ...state,
                loader: {
                    data: {
                        ...state.loader.data,
                        [id]: waiting
                    }
                }
            };
        }
        case 'GET_FAQ':
            const faqData = action && action.payload;
            return {
                ...state,
                localization: {
                    data: faqData ? { ...state.localization.data, faq: faqData } : state.localization.data,
                    loading: { ...state.localization.loading, faq: action.loading },
                    error: { ...state.localization.error, faq: action.error }
                }
            };
        case 'GET_ABOUT_US':
            const aboutUsData = action && action.payload;
            return {
                ...state,
                localization: {
                    data: aboutUsData ? { ...state.localization.data, aboutUs: aboutUsData } : state.localization.data,
                    loading: { ...state.localization.loading, aboutUs: action.loading },
                    error: { ...state.localization.error, aboutUs: action.error }
                }
            };
        case 'GET_TERMS_AND_CONDITIONS':
            const termsAndConditionsData = action && action.payload;
            return {
                ...state,
                localization: {
                    data: termsAndConditionsData
                        ? { ...state.localization.data, termsAndConditions: termsAndConditionsData }
                        : state.localization.data,
                    loading: { ...state.localization.loading, termsAndConditions: action.loading },
                    error: { ...state.localization.error, termsAndConditions: action.error }
                }
            };
        case 'SETUP_LOCALE':
            const locale = action && action.payload;
            let newLocale = state.localization.data.locale;

            if (locale) {
                window.localStorage.setItem('locale', locale);
                newLocale = locale;
            }

            return {
                ...state,
                localization: {
                    ...state.localization,
                    data: { ...state.localization.data, locale: newLocale }
                }
            };
        default:
            return state;
    }
}
