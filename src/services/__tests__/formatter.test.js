import { formatDate, formatDateTime } from '../formatter';

describe('Formatter Service', () => {
    const timestamp = parseInt(new Date().getTime() / 1000, 10);

    it('should return formatted date', () => {
        expect(formatDate(timestamp)).toMatch(/^\w{3} \d{2}, \d{4}$/i);
    });

    it('should return formatted datetime', () => {
        expect(formatDateTime(timestamp)).toMatch(/^\w{3} \d{2}, \d{4} \d{2}:\d{2}$/i);
    });
});
