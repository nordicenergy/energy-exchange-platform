import { appReducer, initialState } from '../app';

const { ACTIONS } = fixtures();

describe('App reducer:', () => {
    describe('Breadcrumbs:', () => {
        it('should handle SETUP_BREADCRUMBS', () => {
            const result = appReducer(initialState, ACTIONS.setupBreadcrumbs);
            expect(result.breadCrumbs.data).toEqual(ACTIONS.setupBreadcrumbs.payload);
        });

        it('should handle SETUP_BREADCRUMBS and reset state', () => {
            const result = appReducer(initialState, ACTIONS.resetBreadcrumbs);
            expect(result.breadCrumbs.data).toEqual([]);
        });
    });

    describe('Loader:', () => {
        it('should handle SETUP_LOADER_VISIBILITY', () => {
            const result = appReducer(initialState, ACTIONS.setupLoaderVisibility);
            const { payload } = ACTIONS.setupLoaderVisibility;
            expect(result.loader.data).toEqual({ [payload.id]: payload.waiting });
        });
    });

    describe('Pending cases:', () => {
        it('should handle GET_ABOUT_US', () => {
            const result = appReducer(initialState, ACTIONS.getAboutUs.pending);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: true, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });

        it('should handle GET_TERMS_AND_CONDITIONS', () => {
            const result = appReducer(initialState, ACTIONS.getTermsAndConditions.pending);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: true });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });

        it('should handle GET_FAQ', () => {
            const result = appReducer(initialState, ACTIONS.getFaq.pending);
            expect(result.localization.loading).toEqual({ faq: true, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });
    });

    describe('Error cases:', () => {
        it('should handle GET_ABOUT_US', () => {
            const result = appReducer(initialState, ACTIONS.getAboutUs.fail);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({
                aboutUs: ACTIONS.getAboutUs.fail.error,
                faq: null,
                termsAndConditions: null
            });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });

        it('should handle GET_TERMS_AND_CONDITIONS', () => {
            const result = appReducer(initialState, ACTIONS.getTermsAndConditions.fail);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({
                termsAndConditions: ACTIONS.getTermsAndConditions.fail.error,
                aboutUs: null,
                faq: null
            });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });

        it('should handle GET_FAQ', () => {
            const result = appReducer(initialState, ACTIONS.getFaq.fail);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({
                aboutUs: null,
                faq: ACTIONS.getFaq.fail.error,
                termsAndConditions: null
            });
            expect(result.localization.data).toEqual(initialState.localization.data);
        });
    });

    describe('Success cases:', () => {
        it('should handle SETUP_LOCALE', () => {
            const result = appReducer(initialState, ACTIONS.setupLocale);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual({
                ...initialState.localization.data,
                locale: ACTIONS.setupLocale.payload
            });
        });

        it('should handle GET_ABOUT_US', () => {
            const result = appReducer(initialState, ACTIONS.getAboutUs.success);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual({
                ...initialState.localization.data,
                aboutUs: ACTIONS.getAboutUs.success.payload
            });
        });

        it('should handle GET_TERMS_AND_CONDITIONS', () => {
            const result = appReducer(initialState, ACTIONS.getTermsAndConditions.success);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual({
                ...initialState.localization.data,
                termsAndConditions: ACTIONS.getTermsAndConditions.success.payload
            });
        });

        it('should handle GET_FAQ', () => {
            const result = appReducer(initialState, ACTIONS.getFaq.success);
            expect(result.localization.loading).toEqual({ faq: false, aboutUs: false, termsAndConditions: false });
            expect(result.localization.error).toEqual({ faq: null, aboutUs: null, termsAndConditions: null });
            expect(result.localization.data).toEqual({
                ...initialState.localization.data,
                faq: ACTIONS.getFaq.success.payload
            });
        });
    });
});

function fixtures() {
    const ACTIONS = {
        setupBreadcrumbs: {
            type: 'SETUP_BREADCRUMBS',
            payload: [
                {
                    id: 'testId',
                    label: 'Test',
                    path: '/test'
                }
            ]
        },
        setupLoaderVisibility: {
            type: 'SETUP_LOADER_VISIBILITY',
            payload: { id: 'PAGE_NAME', waiting: true }
        },
        resetBreadcrumbs: {
            type: 'SETUP_BREADCRUMBS',
            payload: undefined
        },
        setupLocale: {
            type: 'SETUP_LOCALE',
            payload: 'en'
        },
        getAboutUs: {
            success: {
                type: 'GET_ABOUT_US',
                payload: ['about us info'],
                error: null,
                loading: false,
                meta: ['en']
            },
            pending: {
                type: 'GET_ABOUT_US',
                payload: [],
                error: null,
                loading: true,
                meta: ['en']
            },
            fail: {
                type: 'GET_ABOUT_US',
                payload: [],
                error: 'error message',
                loading: false,
                meta: ['en']
            }
        },
        getFaq: {
            success: {
                type: 'GET_FAQ',
                payload: ['q1', 'q2'],
                error: null,
                loading: false,
                meta: ['en']
            },
            pending: {
                type: 'GET_FAQ',
                payload: [],
                error: null,
                loading: true,
                meta: ['en']
            },
            fail: {
                type: 'GET_FAQ',
                payload: [],
                error: 'error message',
                loading: false,
                meta: ['en']
            }
        },
        getTermsAndConditions: {
            success: {
                type: 'GET_TERMS_AND_CONDITIONS',
                payload: ['terms and conditions info'],
                error: null,
                loading: false,
                meta: ['en']
            },
            pending: {
                type: 'GET_TERMS_AND_CONDITIONS',
                payload: [],
                error: null,
                loading: true,
                meta: ['en']
            },
            fail: {
                type: 'GET_TERMS_AND_CONDITIONS',
                payload: [],
                error: 'error message',
                loading: false,
                meta: ['en']
            }
        }
    };
    return { ACTIONS };
}
