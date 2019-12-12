import Axios from 'axios';
import { SESSION_API_URL } from '../../constants';

export function getAboutUsContent(locale) {
    return Axios.get(`${SESSION_API_URL}/content/aboutUs`, {
        params: { lang: locale }
    }).then(response => {
        const { data } = response;
        return {
            data: data.introductionText.split('\n')
        };
    });
}

export function getFAQContent(locale) {
    return Axios.get(`${SESSION_API_URL}/content/FAQ`, {
        params: { lang: locale }
    }).then(response => {
        const faqData = response.data && response.data.faq;
        return {
            data: faqData
        };
    });
}

export function getTermsAndConditions(locale) {
    return Axios.get(`${SESSION_API_URL}/content/termsAndConditions`, {
        params: { lang: locale }
    }).then(response => {
        const { data } = response;
        return {
            data: data.text.split('\n')
        };
    });
}
