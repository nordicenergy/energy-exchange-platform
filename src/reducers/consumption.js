export const initialState = {
    meterReadingsHistory: { data: { readings: [], count: 0 }, error: null, loading: false },
    meterNumber: { data: {}, error: null, loading: false },
    submittedMeterReading: { data: {}, error: null, loading: false }
};

export function consumptionReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_METER_READINGS_HISTORY': {
            const { payload, meta } = action;
            const [page] = meta;

            return {
                ...state,
                meterReadingsHistory: {
                    data: payload
                        ? {
                              ...payload,
                              readings: page
                                  ? [...state.meterReadingsHistory.data.readings, ...payload.readings]
                                  : payload.readings
                          }
                        : state.meterReadingsHistory.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }

        case 'GET_METER_NUMBER': {
            const { payload } = action;

            return {
                ...state,
                meterNumber: {
                    data: payload ? payload : state.meterNumber.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }

        case 'SUBMIT_METER_READING': {
            const { payload } = action;

            return {
                ...state,
                submittedMeterReading: {
                    data: payload ? payload : state.submittedMeterReading.data,
                    loading: action.loading,
                    error: action.error
                }
            };
        }

        default:
            return state;
    }
}
