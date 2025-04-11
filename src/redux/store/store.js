import reducer from '../Reducer';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import sagas from "@sagas";

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({ predicate: () => false });

let store = createStore(
    reducer,
    compose(applyMiddleware(sagaMiddleware, loggerMiddleware))
);

sagaMiddleware.run(sagas)

export default store;