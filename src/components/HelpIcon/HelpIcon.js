import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle';

import './HelpIcon.css';

const HelpIcon = props => {
    const { text } = props;
    const tooltipId = `help-text-${Date.now()}`;

    return (
        <span className="help-icon">
            <div id={tooltipId} role="tooltip" aria-live="assertive" className="help-tooltip">
                {text}
            </div>
            <FontAwesomeIcon icon={faQuestionCircle} aria-label="help icon" aria-describedby={tooltipId} />
        </span>
    );
};

HelpIcon.propTypes = {
    text: PropTypes.string
};

export default HelpIcon;
