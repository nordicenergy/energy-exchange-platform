import Axios from 'axios';
import { getAboutUsContent, getFAQContent, getTermsAndConditions } from '../app';

describe('App API Service', () => {
    beforeAll(() => {
        jest.spyOn(Axios, 'get').mockImplementation(jest.fn);
    });

    afterAll(() => {
        Axios.get.mockRestore();
    });

    afterEach(() => {
        Axios.get.mockClear();
    });

    it('should provide method for getting about us content', async () => {
        Axios.get.mockReturnValue(Promise.resolve({ data: { introductionText: 'test' } }));
        const aboutUsContent = await getAboutUsContent('en');
        expect(Axios.get).toHaveBeenCalledWith('/api/content/aboutUs', { params: { lang: 'en' } });
        expect(aboutUsContent).toEqual({ data: ['test'] });
    });

    it('should provide method for getting FAQ content', async () => {
        Axios.get.mockReturnValue(Promise.resolve({ data: { faq: ['faq 1', 'faq 2'] } }));
        const FAQContent = await getFAQContent('en');
        expect(Axios.get).toHaveBeenCalledWith('/api/content/FAQ', { params: { lang: 'en' } });
        expect(FAQContent).toEqual({ data: ['faq 1', 'faq 2'] });
    });

    it('should provide method for getting terms and conditions content', async () => {
        Axios.get.mockReturnValue(Promise.resolve({ data: { text: 'text1\ntext2' } }));
        const termsAndConditions = await getTermsAndConditions('en');
        expect(Axios.get).toHaveBeenCalledWith('/api/content/termsAndConditions', { params: { lang: 'en' } });
        expect(termsAndConditions).toEqual({ data: ['text1', 'text2'] });
    });
});
