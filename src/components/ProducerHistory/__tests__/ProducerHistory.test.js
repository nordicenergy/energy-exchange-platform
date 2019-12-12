import React from 'react';
import ProducerHistory from '../ProducerHistory';
import { mount } from 'enzyme';

const props = {
    title: 'Test',
    data: [
        {
            date: 'testDate',
            value: 'testValue'
        },
        {
            date: 'testDate',
            value: 'testValue'
        }
    ]
};

function renderComponent(props) {
    return mount(<ProducerHistory {...props} />);
}

describe('<ProducerInfo /> Component', () => {
    it(`should contains following controls:
        - 1 <table>;
        - 1 <tbody>;
        - 1 <caption>;
        - 2 <tr>;
        - 4 <td>;`, () => {
        const component = renderComponent(props);

        expect(component.find('table').length).toEqual(1);
        expect(component.find('tbody').length).toEqual(1);
        expect(component.find('caption').length).toEqual(1);
        expect(component.find('td').length).toEqual(4);
        expect(component.find('tr').length).toEqual(2);

        const td = component.find('td');
        expect(td.at(0).text()).toEqual(`${props.data[0].date}`);
        expect(td.at(1).text()).toEqual(`${props.data[0].value}`);
        expect(td.at(2).text()).toEqual(`${props.data[1].date}`);
        expect(td.at(3).text()).toEqual(`${props.data[1].value}`);
    });
});
