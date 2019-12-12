import { performSetupBreadcrumbs } from '../../../action_performers/app';

const breadcrumbsMixin = Base =>
    class extends Base {
        setupBreadcrumbs(breadcrumbs) {
            if (breadcrumbs) {
                return performSetupBreadcrumbs(breadcrumbs);
            }
            performSetupBreadcrumbs();
        }
    };

export default breadcrumbsMixin;
