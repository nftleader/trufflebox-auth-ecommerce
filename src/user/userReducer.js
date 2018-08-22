
//seller, buyer, owner, admin

const initialState = {
  data:{
    userType:'',
  },
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'USER_LOGGED_IN' || action.type === 'USER_UPDATED')
  {
    return {...state, data:action.payload}
  }

  if (action.type === 'USER_LOGGED_OUT')
  {
    return Object.assign({}, state, {
      data:{ userType: ''}
    })
  }

  return state
}

export default userReducer
