import React from 'react';
import { mount } from 'enzyme';
import DocumentsList from '../DocumentsList';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Spinner from '../../Loader/Spinner';

const DOCUMENTS_MOCKS = [
    { id: 1, type: 'invoice', date: 1521911833, name: 'Invoice.pdf', description: 'Annual bill', url: 'test1.pdf_url' },
    {
        id: 2,
        type: 'archivedDocument',
        date: 1521211833,
        name: 'Monthly Installment.pdf',
        description: 'Annual bill',
        url: 'test2.pdf'
    },
    { id: 3, type: 'invoice', date: 1523911833, name: 'Annual bill.pdf', description: 'Annual bill', url: 'test3.pdf' },
    {
        id: 4,
        type: 'invoice',
        date: 1521941833,
        name: 'Monthly Installment.pdf',
        description: 'Annual bill'
    },
    {
        id: 5,
        type: 'invoice',
        date: 1521511833,
        name: 'Monthly Installment.pdf',
        description: 'Annual bill',
        url: 'test5.pdf'
    },
    {
        id: 6,
        type: 'invoice',
        date: 1521961833,
        name: 'Monthly Installment.pdf',
        description: 'Annual bill',
        url: 'test6.pdf'
    },
    {
        id: 7,
        type: 'archivedDocument',
        date: 1521711833,
        name: 'Monthly Installment.pdf',
        description: 'Annual bill',
        url: 'test7.pdf'
    },
    { id: 8, type: undefined, date: undefined, name: undefined, description: undefined, url: null }
];

function renderComponent(
    { loading = false, pagination = false, documents = [], download = () => {} } = {},
    renderer = mount
) {
    return renderer(
        <DocumentsList documents={documents} loading={loading} pagination={pagination} download={download} />
    );
}

describe('<DocumentsList /> Component', () => {
    it(`should contains following elements: 
        - <table /> element;
        - <tbody /> element;
        - <FontAwesomeIcon /> elements;
    `, () => {
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS
        });
        expect(component.find('table')).toHaveLength(1);
        expect(component.find('tbody')).toHaveLength(1);
        expect(component.find('tr')).toHaveLength(8);
        expect(component.find('td')).toHaveLength(24);
        expect(component.find(FontAwesomeIcon)).toHaveLength(8);
        expect(component.find('.document-list-row--disabled')).toHaveLength(2);
    });

    it('should show spinner when loading and pagination are enabled', () => {
        const component = renderComponent();
        expect(component.find(Spinner)).toHaveLength(0);

        component.setProps({ pagination: true, loading: true });

        expect(component.find(Spinner)).toHaveLength(1);
    });

    it('should display correct data in table', () => {
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS
        });
        const rowData = component.find('td');
        let count = 0;

        expect(rowData.at(count++).text()).toEqual('Mar 24, 2018');
        expect(rowData.at(count++).text()).toEqual('Invoice.pdf');

        const iconTd = rowData.at(count);
        const link = iconTd.find('a').at(0);
        expect(
            link
                .find('a')
                .at(0)
                .props().onClick
        ).toEqual(expect.any(Function));
    });

    it('should display correct data in table when some properties are undefined', () => {
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS
        });
        const row = component.find('tr').at(7);
        const rowData = row.find('td');
        let count = 0;

        expect(rowData.at(count++).text()).toEqual('-');
        expect(rowData.at(count++).text()).toEqual('-');

        const iconTd = rowData.at(count);
        const link = iconTd.find('a').at(0);
        expect(
            link
                .find('a')
                .at(0)
                .props().onClick
        ).toEqual(expect.any(Function));
    });

    it('should call "download" method when click by name', () => {
        const downloadSpy = jest.fn();
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS,
            download: downloadSpy
        });
        const row = component.find('tr').at(0);
        const rowData = row.find('td');

        const nameTd = rowData.at(1);
        const link = nameTd.find('a').at(0);
        link
            .find('a')
            .at(0)
            .simulate('click');

        expect(downloadSpy).toHaveBeenCalledWith('test1.pdf_url', 'Invoice.pdf');
    });

    it('should call "download" method when click by icon', () => {
        const downloadSpy = jest.fn();
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS,
            download: downloadSpy
        });
        const row = component.find('tr').at(0);
        const rowData = row.find('td');

        const iconTd = rowData.at(2);
        const link = iconTd.find('a').at(0);
        link
            .find('a')
            .at(0)
            .simulate('click');

        expect(downloadSpy).toHaveBeenCalledWith('test1.pdf_url', 'Invoice.pdf');
    });
});
