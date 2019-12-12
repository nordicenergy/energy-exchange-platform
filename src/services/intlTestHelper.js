import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';

const messages = require('../services/translations/en'); // en.json

const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

function nodeWithIntlProp(node) {
    return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node, { context, ...additionalOptions } = {}) {
    return shallow(nodeWithIntlProp(node), {
        context: Object.assign({}, context, { intl }),
        ...additionalOptions
    });
}

export function mountWithIntl(node, { context, childContextTypes, ...additionalOptions } = {}) {
    return mount(nodeWithIntlProp(node), {
        context: Object.assign({}, context, { intl }),
        childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes),
        ...additionalOptions
    });
}
