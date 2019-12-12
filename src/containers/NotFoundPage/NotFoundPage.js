import React from 'react';
import PropTypes from 'prop-types';

import './NotFoundPage.css';
import { NotFoundPage as messages } from '../../services/translations/messages';

export class NotFoundPage extends React.PureComponent {
    render() {
        const { formatMessage } = this.context.intl;
        return (
            <div className="not-found-page">
                <h1>{formatMessage(messages.header)}</h1>
            </div>
        );
    }
}

NotFoundPage.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

export default NotFoundPage;
