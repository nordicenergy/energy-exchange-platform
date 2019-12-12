import store from './singletonStore';
import Dispatcher from './dispatcher';

const dispatcher = new Dispatcher(store);

export { dispatcher, store };
