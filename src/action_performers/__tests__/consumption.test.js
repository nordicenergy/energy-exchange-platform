import { dispatcher } from '../../store';
import { performGetMeterReadingsHistory, performGetMeterNumber, performSubmitMeterReading } from '../consumption';
import { getMeterReadingsHistory, submitMeterReading } from '../../services/api/consumption';

describe('Consumption action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for getting meter readings history', () => {
        performGetMeterReadingsHistory(1);

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Consumption: { meterReadingsHistory: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getMeterReadingsHistory');
        expect(type).toEqual('GET_METER_READINGS_HISTORY');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([1]);
    });

    it('should call dispatch method for getting meter number', () => {
        performGetMeterNumber();

        const [[method, type, loadingFunc]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Consumption: { meterNumber: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getMeterNumber');
        expect(type).toEqual('GET_METER_NUMBER');
        expect(loading).toEqual('TEST');
    });

    it('should call dispatch method for submit meter reading', () => {
        performSubmitMeterReading();

        const [[method, type, loadingFunc]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Consumption: { submittedMeterReading: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('submitMeterReading');
        expect(type).toEqual('SUBMIT_METER_READING');
        expect(loading).toEqual('TEST');
    });
});
