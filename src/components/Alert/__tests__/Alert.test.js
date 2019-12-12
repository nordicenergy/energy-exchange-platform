import React from 'react';
import { mount } from 'enzyme';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Alert from '../Alert';

jest.useFakeTimers();

const children = (
    <span>
        Lorem <strong>ipsum</strong> dolor sit amet, consectetur adipisicing elit.
    </span>
);
function renderComponent(props = {}, mountFn = mount) {
    return mountFn(<Alert {...props}>{children}</Alert>);
}

describe('<Alert /> component', () => {
    it('should render with necessary elements and children', () => {
        const alert = renderComponent();

        jest.runAllTimers();

        expect(alert.contains(<FontAwesomeIcon className="alert-icon" icon={Alert.defaultProps.icon} />)).toBeTruthy();
        expect(alert.contains(children)).toBeTruthy();
    });
});
