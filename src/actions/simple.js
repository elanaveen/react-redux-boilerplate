export const simpleAction = (values) => dispatch => {
    return new Promise((resolve, reject) => {
        if (values) {
            setTimeout(() => {
                dispatch({
                    type: 'SIMPLE_ACTION',
                    payload: 'result_of_simple_action'
                })
                dispatch({
                    type: 'GET_USER',
                    payload: values
                });
                dispatch({
                    type: 'GET_ROLE',
                    payload: values?.role ?? null
                });
                resolve(values ? 'Logged in' : 'Logged out')
            }, 2000);
        } else {
            dispatch({
                type: 'GET_USER',
                payload: values
            });
            dispatch({
                type: 'GET_ROLE',
                payload: null
            });
            resolve(values ? 'Logged in' : 'Logged out')
        }
    })
}