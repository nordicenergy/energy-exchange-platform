import React from 'react';
import { shallow } from 'enzyme';
import { PageLoader } from '../PageLoader';

function renderComponent(props = {}, mountFn = shallow) {
    return mountFn(<PageLoader {...props} />);
}

describe('<PageLoader /> container', () => {
    it(`should renders:
        - Loader;`, () => {
        const pageLoader = renderComponent();

        expect(pageLoader.find('Loader')).toHaveLength(1);
    });

    it('should return correct props', () => {
        const state = {
            App: {
                loader: {
                    data: { TEST: true }
                }
            }
        };
        const props = PageLoader.mapStateToProps(state);

        expect(props).toEqual({ shouldShowLoader: true });

        const stateWithSymbols = {
            App: {
                loader: {
                    data: { [Symbol('test')]: true }
                }
            }
        };
        const newProps = PageLoader.mapStateToProps(stateWithSymbols);

        expect(newProps).toEqual({ shouldShowLoader: true });
    });
});
