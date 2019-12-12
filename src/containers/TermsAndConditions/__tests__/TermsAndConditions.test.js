import React from 'react';
import TermsAndConditionsContainer, { TermsAndConditions } from '../TermsAndConditions';
import { mountWithIntl } from '../../../services/intlTestHelper';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as notificationActions from '../../../action_performers/notifications';

const context = {
    intl: {
        formatMessage: jest.fn()
    }
};

const mockStore = configureMockStore();
const store = mockStore({
    App: {
        localization: {
            data: {
                termsAndConditions: ['Terms & Conditions', 'Privacy Policy']
            },
            loading: {
                termsAndConditions: false
            },
            error: {
                termsAndConditions: null
            }
        }
    }
});

const defaultProps = {
    paragraphs: ['p1', 'text <a href="link" target="https://powerchain.nordicenergy.co/energy-trading/terms-and-conditions.pdf">link</a> Terms & Conditions'],
    error: null,
    loading: false
};

function renderContainer(mountFn = mountWithIntl) {
    return mountFn(
        <Provider store={store}>
            <TermsAndConditionsContainer context={context} />
        </Provider>
    );
}

function renderComponent(mountFn = mountWithIntl, props = defaultProps) {
    return mountFn(<TermsAndConditions {...props} context={context} />);
}

describe('<TermsAndConditions /> Component', () => {
    it(`should contains following controls:
        - <div> with class "terms-and-conditions-page";
        - 1 <h1>;
        - 2 <p>`, () => {
        const component = renderContainer();

        expect(component.find('.terms-and-conditions-page')).toHaveLength(1);
        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('p')).toHaveLength(2);
    });

    it('should returns correct props map', () => {
        const stateDummy = {
            App: {
                localization: {
                    data: {
                        termsAndConditions: 'test_data'
                    },
                    loading: { termsAndConditions: false },
                    error: { termsAndConditions: null }
                }
            }
        };
        const props = TermsAndConditions.mapStateToProps(stateDummy);
        expect(props).toEqual({
            paragraphs: 'test_data',
            loading: false,
            error: null
        });
    });

    it('should call performPushNotification on componentDidUpdate', () => {
        notificationActions.performPushNotification = jest.fn();
        const component = renderComponent();
        component.setProps({
            loading: false,
            error: {
                message: 'test',
                type: 'error'
            }
        });
        expect(notificationActions.performPushNotification).toHaveBeenCalledWith({
            message: 'Could not load content',
            type: 'error'
        });
    });

    it('should call performPushNotification on componentDidMount', () => {
        notificationActions.performPushNotification = jest.fn();
        renderComponent(mountWithIntl, {
            ...defaultProps,
            error: {
                message: 'test',
                type: 'error'
            }
        });
        expect(notificationActions.performPushNotification).toHaveBeenCalledWith({
            message: 'Could not load content',
            type: 'error'
        });
    });

    it(`should render correct content with dangerously html controls`, () => {
        const component = renderComponent();

        expect(component.find('.terms-and-conditions-page')).toHaveLength(1);
        expect(component.find('h1')).toHaveLength(1);
        expect(component.find('p')).toHaveLength(2);
        expect(
            component
                .find('p')
                .at(0)
                .props().dangerouslySetInnerHTML
        ).toEqual({ __html: 'p1' });
        expect(
            component
                .find('p')
                .at(1)
                .props().dangerouslySetInnerHTML
        ).toEqual({ __html: 'text <a href="link" target="_blank">link</a> text2' });
    });
});
