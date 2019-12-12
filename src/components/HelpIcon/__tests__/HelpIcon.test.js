import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import HelpIcon from '../HelpIcon';
import { mount } from 'enzyme';

const props = {
    text: 'Test Info Text'
};

function renderComponent(props) {
    return mount(<HelpIcon {...props} />);
}

describe('<HelpIcon /> Component', () => {
    it(`should contains following controls:
        - <FontAwesomeIcon> with class correct icon;
        - <div> elements with role "tooltip";
        - <span> wrapper;`, () => {
        const component = renderComponent(props);

        expect(component.find('span')).toHaveLength(1);

        const icons = component.find(FontAwesomeIcon);
        expect(icons).toHaveLength(1);
        const iconProps = icons.at(0).props();
        expect(iconProps['aria-label']).toEqual('help icon');
        expect(iconProps.icon.iconName).toEqual('question-circle');

        const tooltips = component.find('div[role="tooltip"]');
        expect(tooltips).toHaveLength(1);
        const tooltipProps = tooltips.at(0).props();
        expect(tooltipProps.id).toEqual(iconProps['aria-describedby']);
        expect(tooltips.at(0).text()).toEqual(props.text);
    });
});
