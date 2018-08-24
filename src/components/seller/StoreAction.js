export const storecreate = (data) => ({
    type: 'CREATE_STORE',
    data
});

export const productcreate = (data) => ({
    type: 'CREATE_PRODUCT',
    data
})

export function CreateStore(data) {
    return (dispatch) => {    
        dispatch(storecreate(data));
    };
};

export function CreateProduct(data) {
    return (dispatch) => {    
        dispatch(productcreate(data));
    };
};
