import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Spinner from '../Loader/Spinner';
import { formatDate } from '../../services/formatter';

import './DocumentsList.css';

class DocumentsList extends React.Component {
    renderTableRows(documents) {
        const { download } = this.props;
        return documents.map(document => {
            const classes = classNames({
                'document-list-row--disabled': !document.url,
                'document-list-row': true
            });
            const downloadDocument = download.bind(null, document.url, document.name);

            return (
                <tr key={document.id} className={classes}>
                    <td>{document.date ? formatDate(document.date) : '-'}</td>
                    <td>
                        <a onClick={() => downloadDocument()}>{document.name || '-'}</a>
                    </td>
                    <td>
                        <a onClick={() => downloadDocument()}>
                            <div className="document-download-icon">
                                <FontAwesomeIcon icon={faDownload} />
                            </div>
                        </a>
                    </td>
                </tr>
            );
        });
    }

    render() {
        const { pagination, loading, documents } = this.props;

        return (
            <div className="document-list-container">
                <table>
                    <tbody>{this.renderTableRows(documents)}</tbody>
                </table>
                {pagination && (
                    <div role="progressbar" aria-hidden={!!loading ? undefined : true} className="document-list-loader">
                        {loading && <Spinner size="sm" color="#30acc1" />}
                    </div>
                )}
            </div>
        );
    }
}

DocumentsList.propTypes = {
    documents: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.number,
            name: PropTypes.string,
            description: PropTypes.string,
            id: PropTypes.number.required
        })
    ),
    pagination: PropTypes.bool,
    download: PropTypes.func,
    loading: PropTypes.bool
};

DocumentsList.defaultProps = {
    documents: [],
    pagination: false,
    loading: false,
    download: () => {}
};

export default DocumentsList;
