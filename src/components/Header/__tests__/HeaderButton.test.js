import React from 'react';
import HeaderButton from '../HeaderButton';
import { mount } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBell from '@fortawesome/fontawesome-free-solid/faBell';

function renderComponent({ icon = faBell, hasIndicator = false, onClickHandler = () => {} }) {
    return mount(<HeaderButton icon={icon} hasIndicator={hasIndicator} onClickHandler={onClickHandler} />);
}

describe('<HeaderButton /> Component', () => {
    it(`should contains following blocks:
        - <div> with class "header-button-container";
        - <button> with class "header-button";
        - <span> with class "header-button-icon-container" and icon passed through props;`, () => {
        const component = renderComponent({ icon: faBell });
        expect(component.find('div.header-button-container').length).toBe(1);
        expect(component.find('button.header-button').length).toBe(1);
        expect(component.find('span.header-button-icon-container').length).toBe(1);
        expect(component.find('span.has-indicator').length).toBe(0);
        expect(component.find(FontAwesomeIcon).length).toBe(1);
    });

    it('should display indicator', () => {
        const component = renderComponent({
            hasIndicator: true
        });
        expect(component.find('span.has-indicator').length).toBe(1);
    });

    it('should handle onClick event', () => {
        const onClickHandler = jest.fn();
        const component = renderComponent({
            onClickHandler
        });
        component.find('button').simulate('click');
        expect(onClickHandler).toHaveBeenCalled();
    });
});
