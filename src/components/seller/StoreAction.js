import AuthenticationContract from '../../../build/contracts/Authentication.json'
import store from 'store'

const contract = require('truffle-contract')

export const storecreate = (data) => ({
    type: 'CREATE_STORE',
    data
});

export const productcreate = (data) => ({
    type: 'CREATE_PRODUCT',
    data
})

export function CreateStore(data) {
    let web3 = store.getState().web3.web3Instance
    
    if (typeof web3 !== 'undefined') {

        return function(dispatch) {
            dispatch(storecreate(data));
            return;
          // Using truffle-contract we create the authentication object.
          const authentication = contract(AuthenticationContract)
          authentication.setProvider(web3.currentProvider)
    
          // Declaring this for later so we can chain functions on Authentication.
          var authenticationInstance
    
          // Get current ethereum wallet.
          web3.eth.getCoinbase((error, coinbase) => {
            // Log errors, if any.
            if (error) {
              console.error(error);
            }
    
            authentication.deployed().then(function(instance) {
              authenticationInstance = instance
    
              let chosenadmin = "0x0";
              authenticationInstance.createStore(data.name, data.email, data.storePicture, data.admin, {from: coinbase})
              .then(function(result) {
                dispatch(storecreate(data));
              })
              .catch(function(error) {
                console.error('Error obj ', error)
              })
            })
          })
        }
    } else {
    console.error('Web3 is not initialized.');
    }
};

export function CreateProduct(data) {
    return (dispatch) => {    
        dispatch(productcreate(data));
    };
};
