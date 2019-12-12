import { createStore } from 'redux';
import reducers from '../reducers';

const tools = window.devToolsExtension ? window.devToolsExtension() : f => f;

const store = createStore(reducers, tools);

export default store;
