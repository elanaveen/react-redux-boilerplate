import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { STORAGE_KEY } from './reducers/boardReducer';

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
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
        } catch (e) { /* storage full or unavailable */ }
    });

    return store;
}
