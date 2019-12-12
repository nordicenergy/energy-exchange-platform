import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter';
import faTimesCircle from '@fortawesome/fontawesome-free-regular/faTimesCircle';
import FilterCheckbox from './FilterCheckbox';
import './ProducersFilter.css';

class ProducersFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsIsVisible: false
        };
    }

    render() {
        const { className, labels, options, onChange } = this.props;
        const { props: { value }, state: { optionsIsVisible } } = this;
        const classes = classNames('producers-filter', className);
        const backdropClasses = classNames(
            'producers-filter-backdrop',
            optionsIsVisible && 'producers-filter-backdrop--visible'
        );

        return (
            <aside className={classes}>
                <div className="producers-filter-meta">
                    <strong>{labels.helpMessage}:</strong>
                    <button
                        className="producers-filter-open-button"
                        onClick={() => this.setState({ optionsIsVisible: true })}
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        {labels.helpMessage}
                    </button>
                </div>
                <div className={backdropClasses}>
                    <button
                        className="producers-filter-close-button"
                        onClick={() => this.setState({ optionsIsVisible: false })}
                    >
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                    <div className="producers-filter-options">
                        <FilterCheckbox
                            className="producers-filter-option"
                            label={labels.defaultOption}
                            type="default"
                            name="reset"
                            checked={!value}
                            onChange={() => onChange(null)}
                        />
                        {options.map(({ name, label, type }) => {
                            const isSelected = value === name;
                            return (
                                <FilterCheckbox
                                    key={name}
                                    className="producers-filter-option"
                                    label={label}
                                    type={type}
                                    name={name}
                                    checked={isSelected}
                                    onChange={({ target: { name } = {} } = {}) => onChange(name)}
                                />
                            );
                        })}
                    </div>
                </div>
            </aside>
        );
    }
}

ProducersFilter.propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    labels: PropTypes.shape({
        helpMessage: PropTypes.string,
        defaultOption: PropTypes.string
    }),
    onChange: PropTypes.func,
    value: PropTypes.any
};
ProducersFilter.defaultProps = {
    labels: {
        helpMessage: 'Filter by',
        defaultOption: 'All'
    },
    value: null,
    onChange: () => {}
};

export default ProducersFilter;
