import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import EcommerceContract from '../../../../build/contracts/Ecommerce.json'

import { browserHistory } from 'react-router'
import store from '../../../store'

const contract = require('truffle-contract')

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const COMMON_DATA = 'COMMON_DATA'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}


const PRODUCT_CONDITION = ["New", "Used"];
const PRODUCT_STATE     = ["ForSale", "Sold", "Shipped", "Received", "Deleted"];
const USER_TYPES        = ["Buyer", "Seller", "Arbiter", "Owner"];
const USER_STATUS       = ["Pending", "Approved"];


let getCommonData = async function(authenticationInstance, coinbase){
  let CommonObj = {
    type: COMMON_DATA,
    payload:{
      contractData:{
        address: "0x0",
        abi: ""
      },
      balance: 0,
      userCount: 0,
      arbiterCount: 0,
      sellerCount: 0,

      userData:[],
      productData:[],
      storeData:[],
      orderData:[],
      escrowData:[]
    }
  };

  let web3 = store.getState().web3.web3Instance;

  //contract info
  CommonObj.payload.contractData.address = authenticationInstance.address;
  CommonObj.payload.contractData.abi = authenticationInstance.abi;
  //admin balance
  await web3.eth.getBalance(coinbase, (err, res) => {
    if (err) { Promise.reject(err) }
    CommonObj.payload.balance = web3.fromWei(res.toString(10), "ether");
    Promise.resolve(res);
  });

  //get user list

  const usersCountBigNumber = await authenticationInstance.usersCount.call();
  let usersCount = usersCountBigNumber.toNumber();
  let arbiterCount = 0;
  let sellerCount = 0;
  console.log("***********  users count: ", usersCount, usersCountBigNumber);

  for(let i = 1; i <= usersCount; i++){
    try{
      const [ address, name, email, phoneNumber, profilePicture, userType, userState ] = await authenticationInstance.getUser(i);
      let obj = {
        id : i,
        address: address,
        name: web3.toUtf8(name),
        email: web3.toUtf8(email),
        phoneNumber:web3.toUtf8(phoneNumber),
        profilePicture: web3.toUtf8(profilePicture),
        userType: USER_TYPES[userType.toNumber()],
        userState: USER_STATUS[userState.toNumber()]
      };
      if(obj.userType === "Seller") sellerCount++;
      if(obj.userType === "Arbiter") arbiterCount++;
      console.log("***********  users obj: ", obj);
      CommonObj.payload.userData.push(obj);
    }catch(err){
      console.log("missing user id ", i);
      console.log("error ", err);
      continue;
    }
  }
  CommonObj.payload.userCount = usersCount;
  CommonObj.payload.sellerCount = sellerCount;
  CommonObj.payload.arbiterCount = arbiterCount;

  console.log("***********  return obj: ", CommonObj);

  //get product list

/*  let prod = {
      id: id,
      name: name,
      category: category,
      imageLink: imageLink,
      descLink: descLink,
      startTime: startTime,
      price: price,
      buyer: buyer,
      productCondition: productCondition,
      productState: productState,
      exists: exists,
  }*/
  
  const Ecommerce = contract(EcommerceContract)
  Ecommerce.setProvider(web3.currentProvider)
  const ecommerce = await Ecommerce.deployed();
  
  const productCount = (await ecommerce.productCount.call()).toNumber();

  console.log("productCount:", productCount);

  for(let i = 1; i <= productCount; i++){
    try{
      let [ id, name, category, startTime, price, buyer, productCondition, productState] = await ecommerce.getProduct(i);
      let [ imageLink, descLink] = await ecommerce.getProductDetails(i);


      let obj = {
        id: i,
        name: web3.toUtf8(name),
        category: web3.toUtf8(category),
        imageLink: web3.toUtf8(imageLink),
        descLink: web3.toUtf8(descLink),
        startTime: startTime.toNumber(),
        price: price.toNumber(),
        buyer: web3.toUtf8(buyer),
        productCondition: PRODUCT_CONDITION[productCondition],
        productState: PRODUCT_STATE[productState],
      };

      console.log("***********  product obj: ", obj);
      CommonObj.payload.productData.push(obj);
    }catch(err){
      console.log("missing product id ", i);
      console.log("error ", err);
      continue;
    }
  }

  //get store list
  const storeCount = (await ecommerce.storesCount.call()).toNumber();

  console.log("storeCount:", storeCount);

  for(let i = 1; i <= storeCount; i++){
    try{
      let [ storeAddress, name, email, arbiter, storeFrontImage, balance, productCount] = await ecommerce.storesById.call(i);
      let obj = {
        storeAddress: web3.toUtf8(storeAddress),
        name: web3.toUtf8(name),
        email: web3.toUtf8(email),
        arbiter: web3.toUtf8(arbiter),
        storeFrontImage: web3.toUtf8(storeFrontImage),
        balance: web3.fromWei(balance.toString(10), "ether"),
        productCount: productCount.toNumber()
      };
      console.log("***********  store obj: ", obj);
      CommonObj.payload.storeData.push(obj);
    }catch(err){
      console.log("missing product id ", i);
      console.log("error ", err);
      continue;
    }
  }


  for(let i = 1; i <= productCount; i++){
    try{
      let product = CommonObj.payload.productData[i];
      if(product && PRODUCT_CONDITION[product.productCondition] != "ForSale" && PRODUCT_CONDITION[product.productCondition] != "Deleted" ){
        let [buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount] = await authenticationInstance.escrowDetails(i);
        let escrowobj = {
          product_id: product.id,
          buyer: buyer,
          seller: seller,
          arbiter: arbiter,
          fundsDisbursed: fundsDisbursed,
          releaseCount: releaseCount,
          refundCount: refundCount          
        };
        console.log("***********  store obj: ", escrowobj);
        CommonObj.payload.escrowData.push(escrowobj);
      }
    }catch(err){
      console.log("error ", err);
      continue;
    }
  }

  return CommonObj;
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
          let obj = {};
          authenticationInstance.login({from: coinbase})
          .then(function(result) {
            // If no error, login user.
            const [ name, email, phoneNumber, profilePicture, userType, userState ] = result;
            let userTypes = ["Buyer", "Seller", "Arbiter", "Owner"];
            let userStatus = ["Pending", "Approved"];
            obj = {
              name: web3.toUtf8(name),
              email: web3.toUtf8(email),
              phoneNumber: web3.toUtf8(phoneNumber),
              profilePicture: web3.toUtf8(profilePicture),
              userType: userTypes[userType.toNumber()],
              userState: userStatus[userState.toNumber()]
            };
            console.log(obj);
            dispatch(userLoggedIn(obj));
            // if( obj.userType === "Buyer"){
            //   //dispatch(userLoggedIn(obj));
            // }else if( obj.userType === "Seller"){
            //   //dispatch(userLoggedIn(obj));
            // }else if( obj.userType === "Arbiter"){
            //   //dispatch(userLoggedIn(obj));
            // }else if( obj.userType === "Owner"){
            //   //dispatch(userLoggedIn(obj));
            // }
            return getCommonData(authenticationInstance, coinbase);
          }).then(function(result){ //finshed getting product
            if(result)  dispatch(result);

            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query)
            {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }
            return browserHistory.push('/profile')

/*            if( obj.userType === "Buyer"){
              return browserHistory.push('/')
            }else if( obj.userType === "Seller"){
              return browserHistory.push('/')
            }else if( obj.userType === "Arbiter"){
              return browserHistory.push('/home')
            }else if( obj.userType === "Owner"){
              return browserHistory.push('/')
            }*/
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
