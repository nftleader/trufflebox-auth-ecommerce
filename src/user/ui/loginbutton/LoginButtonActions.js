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

let getUserList = async function(authenticationInstance){
  let OwnerObj = {
    type: OWNER_LOGGED_IN,
    payload:{
      userCount: 0,
      userData:[]
    }
  };

  const usersCountBigNumber = await authenticationInstance.usersCount();
  let usersCount = usersCountBigNumber.toNumber();
  console.log("***********  users count: ", usersCount, usersCountBigNumber);
  let web3 = store.getState().web3.web3Instance;
  OwnerObj.payload.userCount = usersCount;
  for(let i = 1; i <= usersCount; i++){
    try{
      const [ address, name, email, phoneNumber, profilePicture, userType, userState ] = await authenticationInstance.getUser(i);
      let userTypes = ["Buyer", "Seller", "Arbiter", "Owner"];
      let userStatus = ["Pending", "Approved"];
      let obj = {
        id : i,
        address: address,
        name: web3.toUtf8(name),
        email: web3.toUtf8(email),
        phoneNumber:web3.toUtf8(phoneNumber),
        profilePicture: web3.toUtf8(profilePicture),
        userType: userTypes[userType.toNumber()],
        userState: userStatus[userState.toNumber()]
      };
      console.log("***********  users obj: ", obj);
      OwnerObj.payload.userData.push(obj);
    }catch(err){
      console.log("missing user id ", i);
      console.log("error ", err);
      continue;
    }
  }
  console.log("***********  return obj: ", OwnerObj);
  return OwnerObj;
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
              return getUserList(authenticationInstance);
            }

          }).then(function(result){ //finshed getting product
            if(result)  dispatch(result);

            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query)
            {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }

            return browserHistory.push('/dashboard')

          })
          .catch(function(error) {
            // If error, go to signup page.
            console.error('Wallet ' + coinbase + ' does not have an account!')
            console.error('Error obj ', error)

            return browserHistory.push('/signup')
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
