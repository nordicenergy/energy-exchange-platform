import { dispatcher } from '../../store';
import { performSetupBreadcrumbs, performSetupLoaderVisibility, performSetupLocale } from '../app';
import { getTermsAndConditions } from '../../services/api/app';

describe('Users action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchAction = jest.fn();
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for setting breadcrumbs', () => {
        performSetupBreadcrumbs([
            {
                id: 'testId',
                label: 'Test',
                path: '/test'
            }
        ]);

        const [firstCall] = dispatcher.dispatchAction.mock.calls;
        const [type, meta] = firstCall;
        expect(dispatcher.dispatchAction.mock.calls.length).toEqual(1);
        expect(type).toEqual('SETUP_BREADCRUMBS');
        expect(meta).toEqual([
            {
                id: 'testId',
                label: 'Test',
                path: '/test'
            }
        ]);
    });

    it('should call dispatch method for setting loader visibility', () => {
        const pageId = Symbol('pageId');
        performSetupLoaderVisibility(pageId, true);

        const [firstCall] = dispatcher.dispatchAction.mock.calls;
        const [type, payload] = firstCall;
        expect(dispatcher.dispatchAction).toHaveBeenCalledTimes(1);
        expect(type).toEqual('SETUP_LOADER_VISIBILITY');
        expect(payload).toEqual({ id: pageId, waiting: true });
    });

    it('should call dispatch method for get localization content', () => {
        performSetupLocale('en');

        const [[setupLocaleType, setupLocalePayload]] = dispatcher.dispatchAction.mock.calls;

        const [
            [getAboutUsMethod, getAboutUsType, getAboutUsLoadingFunc, getAboutUsMeta],
            [getFaqMethod, getFaqType, getFaqLoadingFunc, getFaqMeta],
            [
                getTermsAndConditionsMethod,
                getTermsAndConditionsType,
                getTermsAndConditionsLoadingFunc,
                getTermsAndConditionsMeta
            ]
        ] = dispatcher.dispatchPromise.mock.calls;
        const aboutUsLoading = getAboutUsLoadingFunc({
            App: { localization: { loading: { aboutUs: 'TEST' } } }
        });

        const faqLoading = getFaqLoadingFunc({
            App: { localization: { loading: { faq: 'TEST' } } }
        });

        const termsAndConditionsLoading = getTermsAndConditionsLoadingFunc({
            App: { localization: { loading: { termsAndConditions: 'TEST' } } }
        });

        expect(dispatcher.dispatchAction).toHaveBeenCalledTimes(1);
        expect(setupLocaleType).toBe('SETUP_LOCALE');
        expect(setupLocalePayload).toBe('en');

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(3);
        expect(getAboutUsMethod.name).toEqual('getAboutUsContent');
        expect(getAboutUsType).toEqual('GET_ABOUT_US');
        expect(aboutUsLoading).toEqual('TEST');
        expect(getAboutUsMeta).toEqual(['en']);

        expect(getFaqMethod.name).toEqual('getFAQContent');
        expect(getFaqType).toEqual('GET_FAQ');
        expect(faqLoading).toEqual('TEST');
        expect(getFaqMeta).toEqual(['en']);

        expect(getTermsAndConditionsMethod.name).toEqual('getTermsAndConditions');
        expect(getTermsAndConditionsType).toEqual('GET_TERMS_AND_CONDITIONS');
        expect(termsAndConditionsLoading).toEqual('TEST');
        expect(getTermsAndConditionsMeta).toEqual(['en']);
    });
});
