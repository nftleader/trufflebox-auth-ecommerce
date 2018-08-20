import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth,VisibleOnlySeller, VisibleOnlyBuyer, VisibleOnlyOwner, VisibleOnlyAdmin } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Home</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/orders" className="pure-menu-link">Orders</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlySellerLinks = VisibleOnlySeller(()=>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">SellerHome</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Sellermenu1</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Sellermenu2</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Sellermenu3</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyBuyerLinks = VisibleOnlyBuyer(()=>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">BuyerHome</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Buyermenu1</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Buyerrmenu2</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Buyermenu3</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyOwnerLinks = VisibleOnlyOwner(()=>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">OwnerHome</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Ownermenu1</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Ownermenu2</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Ownermenu3</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyAdminLinks = VisibleOnlyAdmin(()=>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">AdminHome</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Adminmenu1</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Adminmenu2</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Adminmenu3</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
            <OnlySellerLinks/>
            <OnlyBuyerLinks/>
            <OnlyOwnerLinks/>
            <OnlyAdminLinks/>
          </ul>
          <Link  className="pure-menu-heading pure-menu-link">markEth</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

export default App
