
//seller, buyer, owner, admin

const initialState = {
    data:{
    },
    product:[
    ]
}
  
const storeReducer = (state = initialState, action) => {
    if (action.type === 'CREATE_STORE') {
        console.log('track_10');
        console.log(...state, ...action.data);
        state.data = action.data;
        let mem = state;
        mem.data = action.data;
        console.log(state);
        return {...state, ...mem}
    }
    if(action.type === 'CREATE_PRODUCT') {
        console.log('track_11')
        return { 
            ...state,
            product: state.product.concat(action.data)
        }
    }
    return state
}
  
export default storeReducer
  