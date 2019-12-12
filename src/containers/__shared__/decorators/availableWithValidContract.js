import React from 'react';
import PropTypes from 'prop-types';

import contractStatusMixin from '../mixins/contractStatus';

const availableWithValidContract = WrappedComponent => {
    return class extends contractStatusMixin(React.Component) {
        static get contextTypes() {
            return {
                router: PropTypes.shape({
                    history: PropTypes.shape({
                        push: PropTypes.func.isRequired
                    })
                })
            };
        }

        static get propTypes() {
            return {
                user: PropTypes.object.isRequired
            };
        }

        static get defaultProps() {
            return {
                user: {}
            };
        }

        componentDidUpdate() {
            const { user = {} } = this.props;
            const { router = { history: { push: f => f } } } = this.context;

            if (user.contract.statusCode && !this.validateContractStatus(user.contract.statusCode)) {
                router.history.push('/');
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default availableWithValidContract;
