export const changeType = (type,id) => ({
    type: 'CHANGE_USER_TYPE',
    data:{
        type,
        id
    }
});

export const changeState = (status,id) => ({
    type: 'CHANGE_USER_STATE',
    data:{
        status,
        id
    }
});

export function changeUserState(status,id) {
    return (dispatch) => {    
        dispatch(changeState(status,id));
    };
};

export function changeUserType(type,id) {
    return (dispatch) => {    
        dispatch(changeType(type,id));
    };
};