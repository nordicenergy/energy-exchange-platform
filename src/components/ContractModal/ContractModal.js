import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import focusManager from 'focus-manager';
import SelectField from '../SelectField/SelectField';

import './ContractModal.css';

export class ContractModal extends React.Component {
    componentDidUpdate(prevProps) {
        const { show } = this.props;
        const isOpen = !prevProps.show && show;
        const isClose = prevProps.show && !show;

        if (isOpen) {
            return focusManager.capture(this.modal);
        }

        if (isClose) {
            return focusManager.release();
        }
    }

    render() {
        const { className, labels, show, selectedContractId, contracts, onSelect, ...other } = this.props;
        const classes = classNames('contract-modal-container', show && 'contract-modal-container--show', className);
        const hasContracts = !!contracts.length;

        return (
            <div
                aria-hidden={!!show ? undefined : true}
                className={classes}
                ref={modal => (this.modal = modal)}
                {...other}
            >
                <dialog className="contract-modal" open={show}>
                    <strong className="contract-modal-message">
                        {hasContracts ? labels.contractMessage : labels.noContractMessage}
                    </strong>
                    <div className="contract-modal-actions">
                        {hasContracts ? (
                            <SelectField
                                className="contract-modal-select"
                                name="working-contract"
                                label={labels.selectLabel}
                                options={contracts.map(({ id }) => ({ value: id, label: `#${id}` }))}
                                value={selectedContractId}
                                onChange={onSelect}
                                supportEmptyValue
                            />
                        ) : null}
                    </div>
                </dialog>
            </div>
        );
    }
}

ContractModal.propTypes = {
    className: PropTypes.string,
    labels: PropTypes.shape({
        contractMessage: PropTypes.string,
        noContractMessage: PropTypes.string,
        selectLabel: PropTypes.string
    }),
    show: PropTypes.bool,
    contracts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string
        })
    ),
    selectedContractId: PropTypes.string,
    onSelect: PropTypes.func
};
ContractModal.defaultProps = {
    labels: {
        contractMessage: 'To continue, please select a contract.',
        noContractMessage: 'There are no contracts available, please contact administrator to resolve the issue.',
        selectLabel: 'Select contract'
    },
    show: false,
    contracts: [],
    selectedContractId: null
};

export default ContractModal;
