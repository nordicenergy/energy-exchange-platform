jest.mock('history');
import * as browserHistory from 'history';
import historySingleton from '../history';

describe('Browser History Service', () => {
    it('should create browser history singleton', () => {
        expect(browserHistory.createBrowserHistory).toHaveBeenCalled();
        expect(historySingleton).toBeFalsy(); // stub return undefined
    });
});
