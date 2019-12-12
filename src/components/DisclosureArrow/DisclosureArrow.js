import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './DisclosureArrow.css';
import { KEYBOARD_KEY_VALUES } from '../../constants';

class DisclosureArrow extends React.Component {
    handleArrowEnterPress(event) {
        const { onClick } = this.props;
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            onClick && onClick();
        }
    }

    render() {
        const { expanded, onClick } = this.props;
        return (
            <svg
                tabIndex={-1}
                role="button"
                aria-label="Disclosure control. It is reveal and hide information."
                className={classNames('disclosure-arrow', { 'disclosure-arrow--expanded': expanded })}
                onClick={onClick}
                onKeyUp={event => this.handleArrowEnterPress(event)}
                width="40px"
                height="40px"
                viewBox="0 0 40 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g className="disclosure-arrow-border">
                    <g transform="translate(3, 3)">
                        <circle strokeWidth="2" fill="#FFFFFF" opacity="0.3" cx="17" cy="17" r="17" />
                        <g
                            className="disclosure-arrow-chevron"
                            transform="translate(16, 13.5)"
                            strokeLinecap="square"
                            strokeWidth="2"
                        >
                            <path d="M0.5,0.5 L3.54138127,3.54138127" />
                            <path
                                d="M0.5,3.5 L3.54138127,6.54138127"
                                transform="translate(2, 5) scale(1, -1) translate(-2, -5)"
                            />
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

DisclosureArrow.propTypes = {
    expanded: PropTypes.bool,
    onClick: PropTypes.func
};

export default DisclosureArrow;
