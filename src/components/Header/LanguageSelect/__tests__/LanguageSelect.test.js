import React from 'react';
import { shallow } from 'enzyme';
import LanguageSelect from '../LanguageSelect';

const localesDummy = ['en', 'de'];
const localeDummy = 'en';
const onChangeStub = jest.fn();

function renderComponent(
    { locales = localesDummy, locale = localeDummy, onChange = onChangeStub, ...otherProps } = {},
    mountFn = shallow
) {
    return mountFn(<LanguageSelect locales={locales} value={locale} onChange={onChange} {...otherProps} />);
}

describe('<LanguageSelect /> component', () => {
    afterEach(() => {
        onChangeStub.mockClear();
    });

    it('should renders without errors', () => {
        renderComponent();
    });

    it('should calls onChange callback', () => {
        const languageSelect = renderComponent();

        languageSelect
            .find('SelectField')
            .props()
            .onChange({ value: 'en', name: '' });
        expect(onChangeStub).toHaveBeenCalledWith('en');
    });

    it('should not calls onChange callback if onChange is not a function', () => {
        const languageSelect = renderComponent({ onChange: null });

        languageSelect
            .find('SelectField')
            .props()
            .onChange({ value: 'en', name: '' });
    });

    it('should provide property to select field in original case', () => {
        const languageSelect = renderComponent({ value: 'En' });
        const selectField = languageSelect.find('SelectField');
        expect(selectField.props().value).toEqual('En');
        expect(selectField.props().assistiveLabel).toEqual('Select application locale');
    });
});
