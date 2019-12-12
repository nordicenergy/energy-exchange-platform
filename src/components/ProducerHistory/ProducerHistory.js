import React from 'react';
import PropTypes from 'prop-types';

import './ProducerHistory.css';

class ProducerHistory extends React.Component {
    render() {
        const { title, data } = this.props;

        return (
            <table className="producer-history">
                <caption>{title}</caption>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={`${item.date}-${index}`}>
                                <td>{item.date}</td>
                                <td>{item.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

ProducerHistory.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string
};

export default ProducerHistory;
