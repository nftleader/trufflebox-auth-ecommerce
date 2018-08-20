import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'

// Layout Component Wrappers

export const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.data,
  redirectAction: routerActions.replace,
  failureRedirectPath: '/', // '/login' by default.
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const UserIsNotAuthenticated = UserAuthWrapper({
  authSelector: state => state.user,
  redirectAction: routerActions.replace,
  failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/dashboard',
  wrapperDisplayName: 'UserIsNotAuthenticated',
  predicate: user => user.data === null,
  allowRedirectBack: false
})

// UI Component Wrappers

export const VisibleOnlyAuth = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyAuth',
  predicate: user => user.data,
  FailureComponent: null
})

export const HiddenOnlyAuth = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'HiddenOnlyAuth',
  predicate: user => user.data === null,
  FailureComponent: null
})

export const VisibleOnlySeller = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlySeller',
  predicate: user => user.usertype === 'seller',
  FailureComponent: null
})

export const VisibleOnlyBuyer = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyBuyer',
  predicate: user => user.usertype === 'buyer',
  FailureComponent: null
})

export const VisibleOnlyOwner = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyOwner',
  predicate: user => user.usertype === 'owner',
  FailureComponent: null
})

export const VisibleOnlyAdmin = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyAdmin',
  predicate: user => user.usertype === 'admin',
  FailureComponent: null
})
