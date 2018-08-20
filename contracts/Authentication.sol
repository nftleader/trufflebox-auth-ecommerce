pragma solidity ^0.4.24;

import './zeppelin/ownership/Ownable.sol';
import './zeppelin/lifecycle/Killable.sol';
import './ReentryProtector.sol';
import './zeppelin/SafeMath.sol';
import './Ecommerce.sol';


/** @title Authentication contract */
contract Authentication is Ownable, Killable, ReentryProtector {

    using SafeMath for uint256;

    // ===================================================
    // Fallback
    // ===================================================        
    // this contract will accept any deposit from any person/contract as a donnation when user is creating a store
    // the balance will be added to the EcommerceFactory balance
    function () public payable {
        emit LogDonnationReceived(owner , msg.value);
    }
    
    enum UserType {Buyer, Seller, Arbiter}
    enum UserState {Pending, Approved}
    struct User {
        bytes32 name;
        bytes32 email;
        bytes32 phoneNumber;
        bytes32 profilePicture;
        UserType userType;
        UserState userState;
        bool exists;
    }

    mapping (address => User) public users;
    mapping (address => address) public storesBySellers;
    mapping (address => uint) public pendingWithdraws;

    uint public usersCount;  
    uint public storesCount;   

    modifier onlyExistingUser(address user) { require(users[user].exists, "User is not registered"); _; }
    modifier onlyValidName(bytes32 name) { require(!(name == 0x0), "Invalid name"); _; }
    modifier onlyValidEmail(bytes32 email) { require(!(email == 0x0), "Invalid email"); _; }
    modifier onlyValidPhone(bytes32 phoneNumber) { require(!(phoneNumber == 0x0), "Invalid phone number"); _; }
    modifier onlyValidProfilePicture(bytes32 profilePicture) { require(!(profilePicture == 0x0), "Invalid profile picture"); _; }
    modifier onlyPendingState(address user) { require( users[user].userState == UserState.Pending, "User not on Pending state."); _; }
    modifier onlyApprovedState() { require( users[msg.sender].userState == UserState.Approved, "User not on Approved state."); _; }
    modifier onlySeller { require(users[msg.sender].userType == UserType.Seller, "User is not an seller."); _; }
    modifier doesNotHaveStore { require(storesBySellers[msg.sender] !=  0x0 , "User already has a store"); _; }
    modifier requireArbiter(address _arbiter) { require( users[_arbiter].userType == UserType.Arbiter , "A store require an arbiter."); _; }

    event LogDonnationReceived(address sender, uint value);
    event LogUserSignUp(address from);
    event LogUserUpdated(address from);
    event LogUpdateUserState(address userAddress , UserState userState);
    event LogUpdateUserType(address userAddress , UserType userType);
    event LogCreateStore(string message, address storeAddress, address seller);

    /** @dev Login a user an returns its data
        * @return User struct
        */   
    function login() 
        external
        view
        onlyExistingUser(msg.sender)
        returns (bytes32, bytes32, bytes32, bytes32, UserType, UserState) 
    {
        return (
            users[msg.sender].name,
            users[msg.sender].email,
            users[msg.sender].phoneNumber,
            users[msg.sender].profilePicture,
            users[msg.sender].userType,
            users[msg.sender].userState
        );
    }

    /** @dev signup function to register the user
        * @dev Check if user exists.
        * @dev If yes, return user data.
        * @dev If no, check if name was sent.
        * @dev If yes, create and return user.
        * @param _name uset name
        * @param _email  user email  
        * @param _phoneNumber  user phone number
        * @param _profilePicture  user profile picture
        * @param _userType  user type
        * @return name, email, phoneNumber, profilePicture, userType 
        */
    function signup(
        bytes32 _name,
        bytes32 _email,
        bytes32 _phoneNumber,
        bytes32 _profilePicture,
        UserType _userType
    )
        external
        payable
        onlyValidName(_name)
        onlyValidEmail(_email)
        onlyValidPhone(_phoneNumber)
        onlyValidProfilePicture(_profilePicture)
        returns (bytes32, bytes32, bytes32, bytes32, UserType, UserState) 
    {
        externalEnter();
        emit LogUserSignUp(msg.sender);
        // creates if user already exists
        if (!users[msg.sender].exists)
        {
            users[msg.sender].name = _name;
            users[msg.sender].email = _email;
            users[msg.sender].phoneNumber = _phoneNumber;
            users[msg.sender].profilePicture = _profilePicture;
            users[msg.sender].userType = _userType;

            if (_userType == UserType.Buyer) {
                users[msg.sender].userState = UserState.Approved;
            } else {
                users[msg.sender].userState = UserState.Pending;
            }
            users[msg.sender].exists = true;

            usersCount = usersCount.add(1);
        }
        externalLeave();

        return (
            users[msg.sender].name,
            users[msg.sender].email,
            users[msg.sender].phoneNumber,
            users[msg.sender].profilePicture,
            users[msg.sender].userType,
            users[msg.sender].userState
        );
    }

    /** @dev update user data
    *
    */
    function update(
        bytes32 _name,
        bytes32 _email,
        bytes32 _phoneNumber,
        bytes32 _profilePicture
    )
        external
        payable
        onlyValidName(_name)
        onlyValidEmail(_email)
        onlyValidPhone(_phoneNumber)
        onlyValidProfilePicture(_profilePicture)
        onlyExistingUser(msg.sender)
        returns (bytes32, bytes32, bytes32, bytes32) 
    {
        externalEnter();
        emit LogUserUpdated(msg.sender);
        users[msg.sender].name = _name;
        users[msg.sender].email = _email;
        users[msg.sender].phoneNumber = _phoneNumber;
        users[msg.sender].profilePicture = _profilePicture;
        externalLeave();

        return (
            users[msg.sender].name,
            users[msg.sender].email,
            users[msg.sender].phoneNumber,
            users[msg.sender].profilePicture
        );
    }

    /** @dev Update user State {Pending, Approved}
        * @param _userAddress user address to update
        * @param _userState new user State
        */    
    function updateUserState(address _userAddress, UserState _userState) 
        external 
        payable
        onlyOwner
        onlyExistingUser(_userAddress)
        onlyPendingState(_userAddress)
    {
        externalEnter();
        emit LogUpdateUserState(_userAddress , _userState);
        users[_userAddress].userState = _userState;
        externalLeave();
    }

    /** @dev Update user Type {Buyer, Seller, Arbiter}
        * @param _userAddress  user address to update
        * @param _userType new user type
        */    
    function updateUserType(address _userAddress, UserType _userType) 
        external 
        payable
        onlyOwner 
    {
        externalEnter();
        emit LogUpdateUserType(_userAddress , _userType);
        users[_userAddress].userType = _userType;
        externalLeave();
    }

    /** @dev Create new Ecommerce Contract 
      * @param _name store/market name 
      * @param _email contact email from store
      * @param _storeImage IFPS address of the image
      * @param _arbiter address of the partie which is responsible for escrows for the created store
      * @return contract address of the store just created and next store number
      */    
    function createStore(
        bytes32 _name, 
        bytes32 _email, 
        bytes32 _storeImage,
        address _arbiter
    ) 
        external 
        payable 
        onlySeller
        onlyApprovedState
        // doesNotHaveStore
        onlyValidName(_name)
        onlyValidEmail(_email)
        onlyValidProfilePicture(_storeImage)
        requireArbiter(_arbiter)
        returns (address) 
    {
        externalEnter();
        
        address newStoreAddress = (new Ecommerce).value(msg.value)(_name, _email, _arbiter, _storeImage);
        storesCount = storesCount.add(1);
        storesBySellers[msg.sender] = newStoreAddress;
        emit LogCreateStore("New store created", newStoreAddress, msg.sender);
        externalLeave();

        return newStoreAddress;
    }

    /** @dev using withdraw pattern to prevent attacks 
    *   @dev user has to request withdraw before properly transfer the value 
    */
    function requestWithdraw() 
        external 
        payable 
        onlyOwner
        returns (bool) 
    {
        if (msg.value > 0) {
            pendingWithdraws[msg.sender] = pendingWithdraws[msg.sender].add(msg.value);
            return true;
        } else {
            return false;
        }
    }

    /** @dev user effectivelly request withdraw
     */
    function withdraw() 
        external 
        payable 
        onlyOwner
    {
        uint amount = pendingWithdraws[msg.sender];
        pendingWithdraws[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

}
