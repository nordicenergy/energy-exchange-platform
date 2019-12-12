/**
 * Application store dispatcher,
 * provide functionality for manage store data (models)
 */
class Dispatcher {
    /**
     * @constructor
     * @param {Object} store - Application store instance
     * that implements getState and dispatch methods
     */
    constructor(store = { getState: () => {}, dispatch: () => {} }) {
        this.store = store;
    }

    /**
     * Create pure redux/flux action
     *
     * @see https://github.com/acdlite/redux-actions
     * @see https://github.com/acdlite/flux-standard-action#actions
     *
     * @param {String} type - Action type
     * @param {*} [payload] - Some data or error details
     * @param {*} [error] - Error object
     * @param {*} [loading] - Loading indicator
     * @param {*} [meta] - Addition action information (like arguments)
     *
     * @returns {Object} New action object
     */
    createAction(type, payload, error, loading, meta) {
        return { type, payload, error, loading, meta };
    }

    /**
     * Dispatch pure action
     *
     * @param {String} type - Action type
     * @param {*} [payload] - Some data or error details
     * @param {*} [error] - Error object
     * @param {*} [loading] - Loading indicator
     * @param {*} [meta] - Addition action information (like arguments)
     *
     * @returns {*} Dispatch action
     */
    dispatchAction(type, payload, error, loading, meta) {
        const { store } = this;

        store.dispatch(this.createAction(type, payload, error, loading, meta));
    }

    /**
     * Dispatch promise
     *
     * @param {Function} operation - Function/Operation that return Promise
     * @param {String} type - Action type
     * @param {Function} isLoading - Getter for pending indicator
     * @param {Array<*>} [args] - Operation arguments
     *
     * @returns {*} Dispatch action
     */
    dispatchPromise(operation, type, isLoading, args = []) {
        const { store } = this;

        if (!isLoading(store.getState())) {
            this.dispatchAction(type, null, null, true, args);

            operation(...args)
                .then(result => this.dispatchAction(type, result && result.data, null, false, args))
                .catch(err => {
                    const { response: { status = 500, data = {} } = {} } = err || {};
                    this.dispatchAction(type, null, { ...data, status }, false, args);
                });
        }
    }

    /**
     * Dispatch async
     *
     * @param {Function} operation - Async function/operation that has first-error callback
     * @param {String} type - Action type
     * @param {Function} isLoading - Getter for pending indicator
     * @param {Array<*>} [args] - Operation arguments
     *
     * @returns {*} Dispatch action
     */
    dispatchAsync(operation, type, isLoading, args = []) {
        const { store } = this;

        if (!isLoading(store.getState())) {
            this.dispatchAction(type, null, null, true, args);

            operation(...args, (error, data) => {
                if (error) {
                    return this.dispatchAction(type, null, error, false, args);
                }
                return this.dispatchAction(type, data, null, false, args);
            });
        }
    }
}

export default Dispatcher;
