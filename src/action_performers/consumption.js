import { getMeterReadingsHistory, getMeterNumber, submitMeterReading } from '../services/api/consumption';

import { dispatcher } from '../store';

export function performGetMeterReadingsHistory(page) {
    dispatcher.dispatchPromise(
        getMeterReadingsHistory,
        'GET_METER_READINGS_HISTORY',
        state => state.Consumption.meterReadingsHistory.loading,
        [page]
    );
}

export function performGetMeterNumber() {
    dispatcher.dispatchPromise(getMeterNumber, 'GET_METER_NUMBER', state => state.Consumption.meterNumber.loading);
}

export function performSubmitMeterReading(meterReading) {
    dispatcher.dispatchPromise(
        submitMeterReading,
        'SUBMIT_METER_READING',
        state => state.Consumption.submittedMeterReading.loading,
        [meterReading]
    );
}
