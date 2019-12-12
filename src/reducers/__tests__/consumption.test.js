import { consumptionReducer, initialState } from '../consumption';

const { ACTIONS } = fixtures();

describe('Consumption reducer:', () => {
    describe('Pending cases:', () => {
        it('should handle GET_METER_READINGS_HISTORY', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterReadingsHistory.pending);
            expect(result.meterReadingsHistory.loading).toBeTruthy();
            expect(result.meterReadingsHistory.error).toBeNull();
            expect(result.meterReadingsHistory.data).toEqual({
                readings: [],
                count: 0
            });
        });
        it('should handle GET_METER_NUMBER', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterNumber.pending);
            expect(result.meterNumber.loading).toBeTruthy();
            expect(result.meterNumber.error).toBeNull();
            expect(result.meterNumber.data).toEqual(initialState.meterNumber.data);
        });
        it('should handle SUBMIT_METER_READING', () => {
            const result = consumptionReducer(initialState, ACTIONS.submitMeterReading.pending);
            expect(result.submittedMeterReading.loading).toBeTruthy();
            expect(result.submittedMeterReading.error).toBeNull();
            expect(result.submittedMeterReading.data).toEqual(initialState.submittedMeterReading.data);
        });
    });

    describe('Error cases:', () => {
        it('should handle GET_METER_READINGS_HISTORY', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterReadingsHistory.fail);
            expect(result.meterReadingsHistory.loading).toBeFalsy();
            expect(result.meterReadingsHistory.error).toEqual(ACTIONS.getMeterReadingsHistory.fail.error);
            expect(result.meterReadingsHistory.data).toEqual({
                readings: [],
                count: 0
            });
        });
        it('should handle GET_METER_NUMBER', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterNumber.fail);
            expect(result.meterNumber.loading).toBeFalsy();
            expect(result.meterNumber.error).toEqual(ACTIONS.getMeterNumber.fail.error);
            expect(result.meterNumber.data).toEqual(initialState.meterNumber.data);
        });
        it('should handle SUBMIT_METER_READING', () => {
            const result = consumptionReducer(initialState, ACTIONS.submitMeterReading.fail);
            expect(result.submittedMeterReading.loading).toBeFalsy();
            expect(result.submittedMeterReading.error).toEqual(ACTIONS.submitMeterReading.fail.error);
            expect(result.submittedMeterReading.data).toEqual(initialState.submittedMeterReading.data);
        });
    });

    describe('Success cases:', () => {
        it('should handle GET_METER_READINGS_HISTORY', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterReadingsHistory.success);
            expect(result.meterReadingsHistory.loading).toBeFalsy();
            expect(result.meterReadingsHistory.error).toBeNull();
            expect(result.meterReadingsHistory.data).toEqual(ACTIONS.getMeterReadingsHistory.success.payload);
        });
        it('should handle GET_METER_NUMBER', () => {
            const result = consumptionReducer(initialState, ACTIONS.getMeterNumber.success);
            expect(result.meterNumber.loading).toBeFalsy();
            expect(result.meterNumber.error).toBeNull();
            expect(result.meterNumber.data).toEqual(ACTIONS.getMeterNumber.success.payload);
        });
        it('should handle SUBMIT_METER_READING', () => {
            const result = consumptionReducer(initialState, ACTIONS.submitMeterReading.success);
            expect(result.submittedMeterReading.loading).toBeFalsy();
            expect(result.submittedMeterReading.error).toBeNull();
            expect(result.submittedMeterReading.data).toEqual(ACTIONS.submitMeterReading.success.payload);
        });
    });
});

function fixtures() {
    const ACTIONS = {
        getMeterReadingsHistory: {
            success: {
                type: 'GET_METER_READINGS_HISTORY',
                payload: {
                    readings: [
                        {
                            id: '17007',
                            date: '2018-09-30',
                            value: '123456.0000'
                        },
                        {
                            id: '17008',
                            date: '2018-09-27',
                            value: '123456.0000'
                        }
                    ],
                    count: 7
                },
                error: null,
                loading: false,
                meta: [1]
            },
            fail: {
                type: 'GET_METER_READINGS_HISTORY',
                payload: null,
                error: { message: 'Response error' },
                loading: false,
                meta: [1]
            },
            pending: {
                type: 'GET_METER_READINGS_HISTORY',
                payload: null,
                error: null,
                loading: true,
                meta: [1]
            }
        },
        getMeterNumber: {
            success: {
                type: 'GET_METER_NUMBER',
                payload: {
                    meterNumber: 321 // TODO: Change it after explore real data from server
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'GET_METER_NUMBER',
                payload: null,
                error: { message: 'Response error' },
                loading: false
            },
            pending: {
                type: 'GET_METER_NUMBER',
                payload: null,
                error: null,
                loading: true
            }
        },
        submitMeterReading: {
            success: {
                type: 'SUBMIT_METER_READING',
                payload: {
                    status: 'OK' // TODO: Change it after explore real data from server
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'SUBMIT_METER_READING',
                payload: null,
                error: { message: 'Response error' },
                loading: false
            },
            pending: {
                type: 'SUBMIT_METER_READING',
                payload: null,
                error: null,
                loading: true
            }
        }
    };
    return { ACTIONS };
}
