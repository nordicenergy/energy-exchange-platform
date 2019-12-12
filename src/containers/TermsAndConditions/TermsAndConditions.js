import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TermsAndConditions as messages } from '../../services/translations/messages';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';

import './TermsAndConditions.css';

export class TermsAndConditions extends AppPage {
    static mapStateToProps(state) {
        return {
            paragraphs: state.App.localization.data.termsAndConditions,
            error: state.App.localization.error.termsAndConditions,
            loading: state.App.localization.loading.termsAndConditions
        };
    }

    componentDidMount() {
        const { error, loading } = this.props;
        if (!loading && error) {
            this.showError();
        }
    }

    componentDidUpdate(prevProps) {
        const { error, loading } = this.props;

        if (!loading && error && error !== prevProps.error) {
            this.showError();
        }
    }

    showError() {
        const { formatMessage } = this.context.intl;
        performPushNotification({ message: formatMessage(messages.error), type: 'error' });
    }

    render() {
        const { formatMessage } = this.context.intl;
        const dangerouslyHtmlParagraphs = this.props.paragraphs.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ));

        return (
            <div className="terms-and-conditions-page">
                <h1>{formatMessage(messages.header)}</h1>
                <div className="terms-and-conditions-info-container">{dangerouslyHtmlParagraphs}</div>
            </div>
        );
    }
}

TermsAndConditions.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

TermsAndConditions.propTypes = {
    paragraphs: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default connect(TermsAndConditions.mapStateToProps)(TermsAndConditions);
