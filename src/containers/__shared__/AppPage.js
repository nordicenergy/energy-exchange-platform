import React from 'react';
import breadcrumbsMixin from './mixins/breadcrumbs';
import scrollBottomHandlingMixin from './mixins/scroll';
import labelsMixin from './mixins/labels';

const PAGE_ID = Symbol('page-id');
const Base = labelsMixin(scrollBottomHandlingMixin(breadcrumbsMixin(React.PureComponent)));

class AppPage extends Base {
    // eslint-disable-next-line
    constructor(props, context, breadcrumbs) {
        super(props, context, breadcrumbs);
        this.setupBreadcrumbs();
        this.pageId = PAGE_ID;
    }

    componentWillUnmount() {
        this.scrollToTop();
    }
}

export default AppPage;
