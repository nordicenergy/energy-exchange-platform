import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { About as messages } from '../../services/translations/messages';
import { performPushNotification } from '../../action_performers/notifications';

import AppPage from '../__shared__/AppPage';

import './About.css';

export class About extends AppPage {
    static mapStateToProps(state) {
        return {
            paragraphs: state.App.localization.data.aboutUs,
            error: state.App.localization.error.aboutUs,
            loading: state.App.localization.loading.aboutUs
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
        return (
            <div className="about-page">
                <h1>{formatMessage(messages.header)}</h1>
                <div className="about-info-container">
                    {this.props.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
            </div>
        );
    }
}

About.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

About.propTypes = {
    paragraphs: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default connect(About.mapStateToProps)(About);
