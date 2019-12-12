import React from 'react';
import { shallow } from 'enzyme';
import ContractModal from '../ContractModal';
import focusManager from 'focus-manager';

const labelsMock = {
    contractMessage: 'contractMessage',
    noContractMessage: 'noContractMessage',
    selectLabel: 'selectLabel'
};

function renderComponent({ labels = labelsMock, ...otherProps } = {}, mountFn = shallow) {
    return mountFn(<ContractModal labels={labels} {...otherProps} />);
}

describe('<ContractModal /> component', () => {
    it('should renders without errors', () => {
        const modal = renderComponent({ contracts: [{ id: '10020' }] });

        expect(modal.find('strong.contract-modal-message').text()).toBe(labelsMock.contractMessage);
        expect(modal.find('SelectField').props().label).toBe(labelsMock.selectLabel);

        modal.setProps({ show: true, contracts: [] });
        expect(modal.find('strong.contract-modal-message').text()).toBe(labelsMock.noContractMessage);
        expect(modal.find('SelectField')).toHaveLength(0);
        expect(modal.hasClass('contract-modal-container--show')).toBeTruthy();
    });

    it('should calls onSelect callback', () => {
        const onSelectStub = jest.fn();
        const modal = renderComponent({ contracts: [{ id: '10020' }], onSelect: onSelectStub });

        modal
            .find('SelectField')
            .at(0)
            .props()
            .onChange('testArg');
        expect(onSelectStub).toHaveBeenCalledWith('testArg');
    });

    it('should correctly manage focus for the modal window', () => {
        jest.spyOn(focusManager, 'capture').mockImplementation(jest.fn);
        jest.spyOn(focusManager, 'release').mockImplementation(jest.fn);

        const modal = renderComponent({ show: false });
        expect(focusManager.capture).toHaveBeenCalledTimes(0);
        expect(focusManager.release).toHaveBeenCalledTimes(0);

        modal.setProps({ show: true });

        expect(focusManager.capture).toHaveBeenCalledTimes(1);
        expect(focusManager.release).toHaveBeenCalledTimes(0);

        modal.setProps({ show: false });

        expect(focusManager.capture).toHaveBeenCalledTimes(1);
        expect(focusManager.release).toHaveBeenCalledTimes(1);

        focusManager.capture.mockRestore();
        focusManager.release.mockRestore();
    });
});
