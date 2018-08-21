const initialState = {
    data: null
}
  
const OwnerReducer = (state = initialState, action) => {
    if (action.type === 'OWNER_LOGGED_IN')
    {
        console.log('track_1');
        console.log(action);
        return Object.assign({}, state, {
            data: action.payload
        })
    }
    return state
}

export default OwnerReducer
  