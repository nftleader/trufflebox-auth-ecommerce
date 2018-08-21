import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { browserHistory } from 'react-router'
import store from '../../../store'

const contract = require('truffle-contract')

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const OWNER_LOGGED_IN = 'OWNER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

function ownerLoggedIn(data) {
  return {
    type: OWNER_LOGGED_IN,
    payload: data
  }
}

export function loginUser() {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
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

          // Attempt to login user.
          authenticationInstance.login({from: coinbase})
          .then(function(result) {
            // If no error, login user.
            const [ name, email, phoneNumber, profilePicture, userType, userState ] = result;
            let userTypes = ["Buyer", "Seller", "Arbiter", "Owner"];
            let userStatus = ["Pending", "Approved"];
            let obj = {
              name: web3.toUtf8(name),
              email: web3.toUtf8(email),
              phoneNumber: web3.toUtf8(phoneNumber),
              profilePicture: web3.toUtf8(profilePicture),
              userType: userTypes[userType.toNumber()],
              userState: userStatus[userState.toNumber()]
            };
            console.log(obj);
            dispatch(userLoggedIn(obj));
            if( obj.userType === "Buyer"){
              //dispatch(userLoggedIn(obj));
            }else if( obj.userType === "Seller"){
              //dispatch(userLoggedIn(obj));
            }else if( obj.userType === "Arbiter"){
              //dispatch(userLoggedIn(obj));
            }else if( obj.userType === "Owner"){
              //dispatch(userLoggedIn(obj));
              let OwnerObj = {
                data:'test data'
              };
              dispatch(ownerLoggedIn(OwnerObj));
            }

            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query)
            {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }

            return browserHistory.push('/dashboard')
          })
          .catch(function(result) {
            // If error, go to signup page.
            console.error('Wallet ' + coinbase + ' does not have an account!')

            return browserHistory.push('/signup')
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
