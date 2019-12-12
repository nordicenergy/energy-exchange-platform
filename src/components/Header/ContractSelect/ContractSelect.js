import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SelectField from '../../SelectField';
import './ContractSelect.css';

class ContractSelect extends Component {
    handleChange({ value }) {
        const { onChange } = this.props;
        onChange && onChange(value);
    }

    render() {
        const { className, label, contracts, selectedContractId, noContractsMessage } = this.props;
        const classes = classNames('contract-select', className);

        return (
            <div className={classes}>
                {!!contracts.length ? (
                    <SelectField
                        assistiveLabel={label}
                        className="select-field--contract"
                        options={contracts.map(({ id }) => ({ value: id, label: `${label} #${id}` }))}
                        value={selectedContractId}
                        onChange={data => this.handleChange(data)}
                        supportEmptyValue
                        disabled={!selectedContractId}
                    />
                ) : (
                    <p className="contract-select-no-contracts-alert">{noContractsMessage}</p>
                )}
            </div>
        );
    }
}

ContractSelect.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    noContractsMessage: PropTypes.string,
    contracts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string
        })
    ).isRequired,
    selectedContractId: PropTypes.string,
    onChange: PropTypes.func
};

ContractSelect.defaultProps = {
    contracts: [],
    noContractsMessage: 'No contracts',
    onChange: f => f
};

export default ContractSelect;
