import React from 'react';
import { MyDocuments } from '../MyDocuments';

import { shallowWithIntl } from '../../../services/intlTestHelper';
import { DocumentsList } from '../../../components';

import * as notificationsActionPerformers from '../../../action_performers/notifications';
import * as appActions from '../../../action_performers/app';
import * as documentsActions from '../../../action_performers/documents';
import * as usersActions from '../../../action_performers/users';

const DOCUMENTS_MOCKS = [
    { id: 1, type: 'invoice', date: 1521911833, name: 'Invoice.pdf', description: 'Annual bill' },
    { id: 2, type: 'archivedDocument', date: 1521911833, name: 'Monthly Installment.pdf', description: 'Annual bill' },
    { id: 3, type: 'invoice', date: 1521911833, name: 'Annual bill.pdf', description: 'Annual bill' },
    { id: 4, type: 'invoice', date: 1521911833, name: 'Monthly Installment.pdf', description: 'Annual bill' },
    { id: 5, type: 'invoice', date: 1521911833, name: 'Monthly Installment.pdf', description: 'Annual bill' },
    { id: 6, type: 'invoice', date: 1521911833, name: 'Monthly Installment.pdf', description: 'Annual bill' },
    { id: 7, type: 'archivedDocument', date: 1521911833, name: 'Monthly Installment.pdf', description: 'Annual bill' },
    { id: 8, type: undefined, date: undefined, name: undefined, description: undefined }
];

function renderComponent(props = {}, mountFn = shallowWithIntl) {
    return mountFn(<MyDocuments {...props} />);
}

describe('<MyDocuments /> Component', () => {
    jest.useFakeTimers();
    const mainContainerMock = document.createElement('div');

    beforeEach(() => {
        documentsActions.performGetDocuments = jest.fn();
        appActions.performSetupLoaderVisibility = jest.fn();
        documentsActions.performDownloadDocument = jest.fn();
        usersActions.performGetUserData = jest.fn();

        jest.spyOn(document, 'getElementById').mockReturnValue(mainContainerMock);
        jest.spyOn(mainContainerMock, 'addEventListener');
        jest.spyOn(mainContainerMock, 'removeEventListener');
    });

    it('should DocumentsList component with correct props', () => {
        const component = renderComponent({
            documents: DOCUMENTS_MOCKS,
            user: {},
            hasNextDocuments: false,
            documentsLoading: false
        });

        expect(documentsActions.performGetDocuments).toHaveBeenCalledTimes(1);

        expect(component.find(DocumentsList)).toHaveLength(1);
        expect(component.find(DocumentsList).props().documents).toEqual(DOCUMENTS_MOCKS);
        expect(component.find(DocumentsList).props().loading).toEqual(false);
        expect(component.find(DocumentsList).props().pagination).toEqual(true);
        expect(component.find(DocumentsList).props().download).toEqual(expect.any(Function));
    });

    it('should call "performDownloadDocument" action when click download document', () => {
        const component = renderComponent({ documents: DOCUMENTS_MOCKS, user: {} });

        component
            .find(DocumentsList)
            .props()
            .download('url', 'name');
        expect(documentsActions.performDownloadDocument).toHaveBeenCalledWith('url', 'name');
    });

    it('should map state properties', () => {
        const stateMock = {
            Documents: {
                documentsList: {
                    loading: true,
                    data: { documents: DOCUMENTS_MOCKS, numberOfDocuments: 9 },
                    error: 'Error message'
                }
            },
            Users: { profile: { data: { user: 'test_user' }, loading: false } }
        };
        const props = MyDocuments.mapStateToProps(stateMock);

        expect(props.loading).toEqual(stateMock.Documents.documentsList.loading || stateMock.Users.profile.loading);
        expect(props.documentsLoading).toEqual(stateMock.Documents.documentsList.loading);
        expect(props.hasNextDocuments).toEqual(
            stateMock.Documents.documentsList.data.numberOfDocuments >
                stateMock.Documents.documentsList.data.documents.length
        );
        expect(props.documents).toEqual(stateMock.Documents.documentsList.data.documents);
        expect(props.user).toEqual(stateMock.Users.profile.data.user);
        expect(props.error).toEqual(stateMock.Documents.documentsList.error);
    });

    it('should shows server error if smth is failed', () => {
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        const component = renderComponent();

        component.setProps({
            loading: false,
            error: { message: 'Error message' }
        });

        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            type: 'error',
            message: "Can't load documents from PowerChain web server. Please contact administrator to resolve the error."
        });

        notificationsActionPerformers.performPushNotification.mockRestore();
    });

    it('should calls performSetupLoaderVisibility when receive new loading property', () => {
        const component = renderComponent();

        component.setProps({ loading: true });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), true);
        component.setProps({ loading: false });
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledWith(expect.anything(), false);
        expect(appActions.performSetupLoaderVisibility).toHaveBeenCalledTimes(2);
    });

    it('should calls performGetDocuments when we have new page number', () => {
        const component = renderComponent();
        expect(usersActions.performGetUserData).toHaveBeenCalledTimes(1);
        expect(documentsActions.performGetDocuments).toHaveBeenCalledTimes(1);
        expect(documentsActions.performGetDocuments).toHaveBeenCalledWith(0);
        component.setState({ page: 1 });
        component.update();
        expect(documentsActions.performGetDocuments).toHaveBeenCalledTimes(2);
        expect(documentsActions.performGetDocuments).toHaveBeenCalledWith(1);

        component.setProps({ user: {} });
        component.update();
        expect(documentsActions.performGetDocuments).toHaveBeenCalledTimes(3);
        expect(documentsActions.performGetDocuments).toHaveBeenCalledWith(0);

        component.setProps({ user: {} });
        component.update();
        expect(documentsActions.performGetDocuments).toHaveBeenCalledTimes(4);
        expect(documentsActions.performGetDocuments).toHaveBeenCalledWith(0);
    });

    it('should handler scroll event', () => {
        const component = renderComponent();
        const handleScrollMock = component.instance().scrollHandler;

        expect(mainContainerMock.addEventListener).toHaveBeenCalledWith('scroll', component.instance().scrollHandler);

        component.unmount();
        expect(mainContainerMock.removeEventListener).toHaveBeenCalledWith('scroll', handleScrollMock);
    });

    it('should call scroll handler of the container', () => {
        const showTransactions = renderComponent();
        const dummyEvent = {
            target: {
                scrollTop: 10,
                clientHeight: 10,
                scrollHeight: 10
            }
        };
        showTransactions.setProps({
            hasNextDocuments: true,
            documentsLoading: false
        });
        showTransactions.instance().scrollHandler(dummyEvent);
        jest.runAllTimers();
        expect(showTransactions.state('page')).toBe(1);
    });
});
