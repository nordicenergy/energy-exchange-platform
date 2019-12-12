import { dispatcher } from '../../store';
import { performGetDocuments, performDownloadDocument } from '../documents';
import { downloadDocument } from '../../services/api/documents';

describe('Documents action performers', () => {
    beforeEach(() => {
        dispatcher.dispatchPromise = jest.fn();
    });

    it('should call dispatch method for getting documents', () => {
        performGetDocuments(3);

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Documents: { documentsList: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('getDocuments');
        expect(type).toEqual('GET_DOCUMENTS');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual([3]);
    });

    it('should call dispatch method for download document', () => {
        performDownloadDocument('url', 'name');

        const [[method, type, loadingFunc, meta]] = dispatcher.dispatchPromise.mock.calls;
        const loading = loadingFunc({
            Documents: { download: { loading: 'TEST' } }
        });

        expect(dispatcher.dispatchPromise).toHaveBeenCalledTimes(1);
        expect(method.name).toEqual('downloadDocument');
        expect(type).toEqual('DOWNLOAD_DOCUMENT');
        expect(loading).toEqual('TEST');
        expect(meta).toEqual(['url', 'name']);
    });
});
