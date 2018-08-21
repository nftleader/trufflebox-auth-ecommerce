import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import OwnerReducer from 'reducers/OwnerReducer'
import web3Reducer from './util/web3/web3Reducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  owner: OwnerReducer,
  web3: web3Reducer
})

export default reducer
