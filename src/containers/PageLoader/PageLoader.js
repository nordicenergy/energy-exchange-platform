import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from '../../components';
import './PageLoader.css';

export class PageLoader extends Component {
    static mapStateToProps({ App }) {
        const pageLoaders = App.loader.data;
        return {
            shouldShowLoader: [...Object.getOwnPropertySymbols(pageLoaders), ...Object.keys(pageLoaders)]
                .map(key => pageLoaders[key])
                .reduce((loading, next) => loading || next, false)
        };
    }

    render() {
        const { shouldShowLoader } = this.props;
        return (
            <div className="page-loader">
                <Loader show={shouldShowLoader} />
            </div>
        );
    }
}

PageLoader.propTypes = {
    shouldShowLoader: PropTypes.bool
};
PageLoader.defaultProps = {
    shouldShowLoader: false
};

export default connect(PageLoader.mapStateToProps)(PageLoader);
