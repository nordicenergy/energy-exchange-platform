import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import classNames from 'classnames';
import './Breadcrumbs.css';
import { KEYBOARD_KEY_VALUES } from '../../constants';

class Breadcrumbs extends React.Component {
    handleBreadcrumbEnterPress(event, path) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.props.onClick(path);
        }
    }

    renderBreadcrumbsItems() {
        const { items, onClick } = this.props;
        const [rootBreadCrumb = {}, ...breadCrumbs] = items;
        const rootBreadcrumbLabel = rootBreadCrumb.icon ? (
            <FontAwesomeIcon icon={rootBreadCrumb.icon} />
        ) : (
            rootBreadCrumb.label
        );
        const iconBreadcrumbElement = (
            <div className="breadcrumb-item" key={rootBreadCrumb.id}>
                <a
                    aria-label={rootBreadCrumb.label}
                    className="icon-breadcrumb"
                    onKeyUp={event => this.handleBreadcrumbEnterPress(event, rootBreadCrumb.path)}
                    onClick={() => {
                        onClick(rootBreadCrumb.path);
                    }}
                    tabIndex={0}
                >
                    {rootBreadcrumbLabel}
                </a>
                <div className="breadcrumb-arrow">
                    <FontAwesomeIcon icon={faAngleRight} />
                </div>
            </div>
        );
        const breadCrumbElements = breadCrumbs.map((item, index) => {
            const isLastItem = index === breadCrumbs.length - 1;
            const breadcrumbLabel = item.icon ? <FontAwesomeIcon icon={item.icon} /> : item.label;
            return (
                <div
                    className={classNames('breadcrumb-item', {
                        'current-item': isLastItem
                    })}
                    key={item.id}
                >
                    <a
                        aria-label={item.label}
                        className="breadcrumb"
                        onKeyUp={event => this.handleBreadcrumbEnterPress(event, item.path)}
                        onClick={() => onClick(item.path)}
                        tabIndex={0}
                    >
                        {breadcrumbLabel}
                    </a>
                    {!isLastItem && (
                        <div className="breadcrumb-arrow">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    )}
                </div>
            );
        });
        return breadCrumbs.length ? [iconBreadcrumbElement, ...breadCrumbElements] : null;
    }
    render() {
        return <div className="breadcrumbs">{this.renderBreadcrumbsItems()}</div>;
    }
}

Breadcrumbs.propTypes = {
    items: PropTypes.array,
    onClick: PropTypes.func
};

Breadcrumbs.defaultProps = {
    items: [],
    onClick: () => {}
};

export default Breadcrumbs;
