import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('web3');

if (window) {
    window.web3 = { currentProvider: 'metamask' };

    window.URL = {
        createObjectURL: jest.fn()
    };

    window.sessionStorage = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn()
    };

    window.localStorage = {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn()
    };

    window.URL = {
        createObjectURL: jest.fn(),
        revokeObjectURL: jest.fn()
    };

    window.Blob = jest.fn();
}
