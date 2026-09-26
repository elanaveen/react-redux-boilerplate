import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { STORAGE_KEY } from './reducers/boardReducer';
import { writeLocal } from './utils/storage';

export default function configureStore(initialState = {}) {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );

    // Persist forums, queries and users locally until a real backend exists.
    let lastBoard = store.getState().board;
    store.subscribe(() => {
        const { board } = store.getState();
        if (board === lastBoard) return;
        lastBoard = board;
        writeLocal(STORAGE_KEY, board);
    });

    return store;
}
