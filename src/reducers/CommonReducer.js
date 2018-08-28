const initialState = {
    data: null
}

const CommonReducer = (state = initialState, action) => {
    console.log('track_commonreducer_1')
    console.log(state)
    if (action.type === 'COMMON_DATA'){
        console.log('track_1');
        console.log(action);
        //When back-end is ready it will be removed
        action.payload.productData = state.data.productData
        return { ...state, ...{data:action.payload}}  
    }
    
    if (action.type === 'CHANGE_USER_STATE') {
        let mem = state;
        const mindex = 0;
        mem.data.userData.forEach((key, index) => {
            if(key.id === action.data.id) mindex = index;
        })
        mem.data.userData[mindex].userState = action.data.status;
        console.log('mem');
        console.log(mem);
        return {...state, ...mem };
    }

    if (action.type === 'CHANGE_USER_TYPE') {
        let mem = state;
        const mindex = 0;
        mem.data.userData.forEach((key, index) => {
            if(key.id === action.data.id) mindex = index;
        })
        mem.data.userData[mindex].userType = action.data.type;
        console.log('type');
        console.log(mem);
        return {...state, ...mem };
    }

    if(action.type === 'ESCROW_RELEASE'){
        let newstate = {...state};
        newstate.data.escrowData[action.data.id].release_count ++;
        if(newstate.data.escrowData[action.data.id].release_count == 2){
            newstate.data.escrowData[action.data.id].fundsDisbursed = true;
        }
        return newstate;
    }

    if(action.type === 'BUY_PRODUCT'){
        let newstate = {...state};
        newstate.data.productData[action.data.id] = action.data;
        return newstate;
    }

    return state
}

export default CommonReducer
