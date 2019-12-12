import { getDocuments, downloadDocument } from '../services/api/documents';

import { dispatcher } from '../store';

export function performGetDocuments(page) {
    dispatcher.dispatchPromise(getDocuments, 'GET_DOCUMENTS', state => state.Documents.documentsList.loading, [page]);
}

export function performDownloadDocument(url, name) {
    dispatcher.dispatchPromise(downloadDocument, 'DOWNLOAD_DOCUMENT', state => state.Documents.download.loading, [
        url,
        name
    ]);
}
