import Axios from 'axios';
import { LIMIT, SESSION_API_URL } from '../../constants';

export function getMeterReadingsHistory(page) {
    return Axios.get(`${SESSION_API_URL}/consumption/meterReadings`, {
        params: { limit: LIMIT, offset: page * LIMIT }
    });
}

export function submitMeterReading(meterReading) {
    return Axios.post(`${SESSION_API_URL}/consumption/saveMetering`, {
        readingValue: meterReading.meterReadings,
        readAt: meterReading.date
    });
}

export function getMeterNumber() {
    return Axios.get(`${SESSION_API_URL}/consumption/getMeterNumber`).then(res => {
        return { data: res.data };
    });
}
