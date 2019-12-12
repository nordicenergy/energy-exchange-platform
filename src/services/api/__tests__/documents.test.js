import Axios from 'axios';
import { getDocuments, downloadDocument } from '../documents';

describe('Documents API Service', () => {
    const setAttributeSpy = jest.fn();
    const clickSpy = jest.fn();
    const appendChildSpy = jest.fn();
    const removeChildSpy = jest.fn();

    beforeAll(() => {
        jest.spyOn(Axios, 'get').mockImplementation(jest.fn);
        jest.spyOn(document, 'createElement').mockReturnValue({ setAttribute: setAttributeSpy, click: clickSpy });
        document.body.appendChild = appendChildSpy;
        document.body.removeChild = removeChildSpy;
    });

    afterAll(() => {
        Axios.get.mockRestore();
        document.mockRestore();
        document.body.appendChild.mockRestore();
        document.body.removeChild.mockRestore();
    });

    afterEach(() => {
        Axios.get.mockClear();
    });

    it('should provide method for getting documents', async () => {
        Axios.get.mockReturnValue(
            Promise.resolve({
                data: {
                    documents: [
                        {
                            id: 1,
                            date: 1521911833,
                            name: 'Invoice.pdf'
                        },
                        {
                            id: 2,
                            date: 1521211833,
                            name: 'Monthly Installment.pdf'
                        }
                    ]
                }
            })
        );

        const documents = await getDocuments(2);

        expect(Axios.get).toHaveBeenCalledWith('/api/documents', { params: { limit: 15, offset: 30 } });

        expect(documents).toEqual({
            data: {
                documents: [
                    {
                        date: 1521911833,
                        id: 1,
                        name: 'Invoice.pdf',
                        url: '/api/documents/download?documentId=1'
                    },
                    {
                        date: 1521211833,
                        id: 2,
                        name: 'Monthly Installment.pdf',
                        url: '/api/documents/download?documentId=2'
                    }
                ]
            }
        });
    });

    it('should provide method for download document', async () => {
        Axios.get.mockReturnValue(Promise.resolve({ data: 'file' }));

        const documents = await downloadDocument('url', 'name');

        expect(Axios.get).toHaveBeenCalledWith('url', { responseType: 'blob' });
        expect(Blob).toHaveBeenCalledWith(['file'], { type: 'application/pdf' });

        expect(documents).toEqual(undefined);

        expect(setAttributeSpy).toHaveBeenCalledTimes(2);
        expect(setAttributeSpy.mock.calls).toEqual([['href', undefined], ['download', 'name.pdf']]);
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        expect(clickSpy).toHaveBeenCalledTimes(1);
        expect(removeChildSpy).toHaveBeenCalledTimes(1);
    });
});
