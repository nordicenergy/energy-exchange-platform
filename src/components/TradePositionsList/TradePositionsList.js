import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BackLink from '../BackLink';
import TextField from '../TextField';
import DateField from '../DateField';
import SortToolbar from '../SortToolbar';
import TradePosition, { TradePositionPropType } from './TradePosition';
import './TradePositionsList.css';

class TradePositionsList extends Component {
    render() {
        const {
            id,
            className,
            labels,
            onBackClick,
            tradeVolume,
            onTradeVolumeChange,
            dateFilter,
            onDateFilterChange,
            sortOptions,
            onSortParametersChange,
            onPerformTransaction,
            tradePositions
        } = this.props;
        const classes = classNames('trade-positions-list', className);

        // TODO define labels for each TradePosition

        return (
            <div className={classes}>
                <div className="trade-positions-list-layout">
                    <h3>
                        <BackLink onClick={onBackClick} />
                        <span>{labels.title}</span>
                    </h3>
                    <form className="trade-positions-list-toolbar" aria-controls={id}>
                        <TextField
                            label={labels.tradeVolumeField}
                            addon="kWh"
                            value={tradeVolume}
                            onChange={onTradeVolumeChange}
                        />
                        <DateField
                            label={labels.filterByDateField}
                            helperText={labels.dateHelperText}
                            dateFilter={dateFilter}
                            onChange={onDateFilterChange}
                        />
                        {sortOptions.length > 0 && (
                            <div className="trade-positions-list-sort-toolbar">
                                <SortToolbar
                                    labels={{ title: labels.sortToolbarTitle }}
                                    sortOptions={sortOptions}
                                    onChange={onSortParametersChange}
                                />
                            </div>
                        )}
                    </form>
                    {tradePositions.length > 0 && (
                        <ul id={id} className="trade-positions">
                            {tradePositions.map((tradePosition, index) => (
                                <li key={`${tradePosition.offerAddress}-${index}`}>
                                    <TradePosition
                                        tradePosition={tradePosition}
                                        onPerform={position => onPerformTransaction(position)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    }
}

TradePositionsList.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    labels: PropTypes.shape({
        title: PropTypes.string,
        tradeVolumeField: PropTypes.string,
        filterByDateField: PropTypes.string
    }),
    onBackClick: PropTypes.func,
    tradeVolume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onTradeVolumeChange: PropTypes.func,
    dateFilter: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onDateFilterChange: PropTypes.func,
    sortOptions: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ),
    onSortParametersChange: PropTypes.func,
    onPerformTransaction: PropTypes.func,
    tradePositions: PropTypes.arrayOf(TradePositionPropType)
};
TradePositionsList.defaultProps = {
    id: `trade-positions-${Date.now()}`,
    labels: {
        title: 'Open Trade Positions',
        tradeVolumeField: 'Trade Volume',
        filterByDateField: 'Filter by Date',
        dateHelperText: 'Editing format dd.mm.yyyy',
        sortToolbarTitle: 'Sort by'
    },
    onSortParametersChange: f => f,
    onPerformTransaction: f => f,
    tradeVolume: '',
    dateFilter: '',
    sortOptions: [],
    tradePositions: []
};

export default TradePositionsList;
