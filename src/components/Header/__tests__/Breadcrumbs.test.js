import React from 'react';
import Breadcrumbs from '../Breadcrumbs';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faHome, faBook, faCalculator, faChartBar, faUser } from '@fortawesome/fontawesome-free-solid';
import { mount } from 'enzyme';

function renderComponent({
    items = [
        {
            id: 'trading',
            label: 'Trading',
            path: 'trading'
        },
        {
            id: 'powerchain',
            label: 'PowerChain',
            path: 'trading/powerchain'
        }
    ],
    iconsTypes = {
        '': faHome,
        documents: faBook,
        submit_meter: faCalculator,
        trading: faChartBar,
        profile: faUser
    },
    onClick = () => {}
}) {
    return mount(<Breadcrumbs items={items} iconsTypes={iconsTypes} onClick={onClick} />);
}

describe('<Breadcrumbs /> Component', () => {
    it(`should contains following controls:
        - 2 <a> elements;
        - 2 <div> elements with class "breadcrumb-item";
        - <div> elements with class "breadcrumb-arrow"`, () => {
        const component = renderComponent({});

        expect(component.find('a').length).toBe(2);
        expect(component.find('div.breadcrumb-item').length).toBe(2);
        expect(component.find('div.breadcrumb-arrow').length).toBe(1);
    });

    it('should call onClick event handler', () => {
        const onClick = jest.fn();
        const component = renderComponent({
            onClick
        });

        component
            .find('a')
            .at(1)
            .simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('trading/powerchain');
        component
            .find('a')
            .at(0)
            .simulate('click');
        expect(onClick).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenCalledWith('trading');
    });

    it('should call onKeyUp event handler', () => {
        const component = renderComponent({});
        component.instance().handleBreadcrumbEnterPress = jest.fn();
        component
            .find('a')
            .at(0)
            .simulate('keyUp', { key: 'Enter' });
        expect(component.instance().handleBreadcrumbEnterPress).toHaveBeenCalled();
    });

    it('should call onClick event handler only on enter key press', () => {
        const onClick = jest.fn();
        const component = renderComponent({
            onClick
        });

        component
            .find('a')
            .at(1)
            .simulate('keyUp', { key: 'Enter' });
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('trading/powerchain');
        component
            .find('a')
            .at(1)
            .simulate('keyUp', { key: 'Tab' });
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render icon in breadcrumbs', () => {
        const component = renderComponent({
            items: [
                {
                    id: 'trading',
                    label: 'Trading',
                    path: 'trading',
                    icon: faChartBar
                },
                {
                    id: 'powerchain',
                    label: 'PowerChain',
                    path: 'trading/powerchain',
                    icon: faBook
                },
                {
                    id: 'test1',
                    label: 'Test1',
                    path: 'trading/test1'
                }
            ]
        });
        expect(component.find(FontAwesomeIcon)).toHaveLength(4);
    });
});
