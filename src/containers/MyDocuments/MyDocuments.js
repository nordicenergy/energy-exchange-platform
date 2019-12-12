import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { DocumentsList } from '../../components';
import { Documents as messages } from '../../services/translations/messages';
import { performSetupLoaderVisibility } from '../../action_performers/app';
import { performPushNotification } from '../../action_performers/notifications';
import { performGetUserData } from '../../action_performers/users';
import { performGetDocuments, performDownloadDocument } from '../../action_performers/documents';

import AppPage from '../__shared__/AppPage';

import './MyDocuments.css';

export class MyDocuments extends AppPage {
    constructor(props, context) {
        super(props, context);

        this.state = { page: 0 };
    }

    static mapStateToProps(state) {
        const { data: docData } = state.Documents.documentsList;

        return {
            loading:
                state.Documents.documentsList.loading ||
                state.Documents.download.loading ||
                state.Users.profile.loading,
            user: state.Users.profile.data.user,
            documentsLoading: state.Documents.documentsList.loading,
            hasNextDocuments: docData.numberOfDocuments > docData.documents.length,
            documents: docData.documents,
            error: state.Documents.documentsList.error || state.Documents.download.error
        };
    }

    componentDidMount() {
        performGetUserData();
        performGetDocuments(this.state.page);

        const loadCondition = () => {
            const { hasNextDocuments, documentsLoading } = this.props;
            return hasNextDocuments && !documentsLoading;
        };
        const loadCallback = () => {
            this.setState(state => ({
                page: state.page + 1
            }));
        };
        this.setupScrollHandler(loadCondition, loadCallback);
    }

    componentDidUpdate(prevProps, prevState) {
        const { formatMessage } = this.context.intl;
        const { loading, error, user } = this.props;

        if (prevProps.user !== user) {
            if (this.state.page === 0) {
                performGetDocuments(this.state.page);
            } else {
                this.setState({ page: 0 });
            }
        }

        if (prevState.page !== this.state.page) {
            performGetDocuments(this.state.page);
        }

        if (!loading && error && error !== prevProps.error) {
            performPushNotification({ message: formatMessage(messages.loadingErrorMessage), type: 'error' });
        }

        if (prevProps.loading !== loading) {
            performSetupLoaderVisibility(this.pageId, loading);
        }
    }

    componentWillUnmount() {
        this.removeScrollHandler();
        this.scrollToTop();
    }

    render() {
        const { formatMessage } = this.context.intl;
        const { documents = [], documentsLoading, loading } = this.props;
        const hasDocuments = documents.length > 0;

        return (
            <section className="my-documents-page" aria-busy={loading}>
                <h1>{formatMessage(messages.header)}</h1>
                <section>
                    {hasDocuments ? (
                        <DocumentsList
                            documents={documents}
                            loading={documentsLoading}
                            pagination
                            download={performDownloadDocument}
                        />
                    ) : (
                        <p className="no-documents-title">{formatMessage(messages.noDocumentsMessage)}</p>
                    )}
                </section>
            </section>
        );
    }
}

MyDocuments.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};
MyDocuments.propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.object,
    documentsLoading: PropTypes.bool,
    documentsList: PropTypes.object
};
MyDocuments.defaultProps = {
    loading: false,
    documentsLoading: false,
    documentsList: {},
    error: null
};

export default connect(MyDocuments.mapStateToProps)(MyDocuments);
