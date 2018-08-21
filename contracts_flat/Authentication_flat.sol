pragma solidity ^0.4.24;

// File: contracts\zeppelin\ownership\Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner, "Sender is not the contract owner");
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

// File: contracts\zeppelin\lifecycle\Killable.sol

/*
 * Killable
 * Base contract that can be killed by owner. All funds in contract will be sent to the owner.
 */
contract Killable is Ownable {
  function kill() onlyOwner {
    selfdestruct(owner);
  }
}

// File: contracts\ReentryProtector.sol

/// @title help avoid recursive-call attacks.
contract ReentryProtector {

    // true if we are inside an external function
    bool reentryProtector;

    // Mark contract as having entered an external function.
    // Throws an exception if called twice with no externalLeave().
    // For this to work, Contracts MUST:
    //  - call externalEnter() at the start of each external function
    //  - call externalLeave() at the end of each external function
    //  - never use return statements in between enter and leave
    //  - never call an external function from another function
    // WARN: serious risk of contract getting stuck if used wrongly.
    // TODO: use revert or require, need to check
    function externalEnter() internal {
        if (reentryProtector) {
            revert();
        }
        reentryProtector = true;
    }

    // Mark contract as having left an external function.
    // Do this after each call to externalEnter().
    function externalLeave() internal {
        reentryProtector = false;
    }

}

// File: contracts\zeppelin\SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    uint256 c = _a * _b;
    require(c / _a == _b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    require(_b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    require(_b <= _a);
    uint256 c = _a - _b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
    uint256 c = _a + _b;
    require(c >= _a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    return a % b;
  }
}

// File: contracts\Escrow.sol

/** @title Escrow Contract - used to control money release on a market. */
contract Escrow  {
    
    using SafeMath for uint256;

    address public buyer;
    address public seller;
    address public arbiter;
    address public owner;

    uint public productId;
    uint public amount;   // price per product
    uint public releaseCount;
    uint public refundCount;

    mapping(address => bool) releaseAmount;
    mapping(address => bool) refundAmount;
    mapping(address => uint) pendingWithdraws;

    bool public fundsDisbursed;
    
    
    event LogReleaseAmountToSeller(string message, address caller, uint releaseCount, uint amount);
    event LogRefundAmountToBuyer(string message, address caller, uint refundCount, uint amount);
    
    
    constructor (
        uint _productId,
        address _buyer,
        address _seller,
        address _arbiter
    ) 
        public 
        payable
    {
        productId = _productId;
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        fundsDisbursed = false;
        amount = msg.value;
        owner = msg.sender;
    }
    
    
    function escrowDetails() public view returns (address, address, address, bool, uint, uint) {
        return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
        
    }
    
    
    function releaseAmountToSeller(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((_caller == buyer || _caller == seller || _caller == arbiter) && releaseAmount[_caller] != true) {
            releaseAmount[_caller] = true;
            releaseCount = releaseCount.add(1);
        }
        
        // two parties have participated of the process, so the money can be released
        if (releaseCount == 2) {
            pendingWithdraws[seller] = pendingWithdraws[seller].add(amount);
            // seller.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogReleaseAmountToSeller("Amount released to Seller", _caller, releaseCount, amount);
    }
    
    
    function refundAmountToBuyer(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((_caller == buyer || _caller == seller || _caller == arbiter) && releaseAmount[_caller] != true) {
            refundAmount[_caller] = true;
            refundCount = refundCount.add(1);
        }
        
        // two parties have participated of the process, so the money can be released
        if (refundCount == 2) {
            pendingWithdraws[buyer] = pendingWithdraws[buyer].add(amount);
            // buyer.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogRefundAmountToBuyer("Amount refunded to Buyer", _caller, refundCount, amount);
    }

    /** @dev user effectivelly request withdraw
     */
    function withdraw(address _caller) public 
    {
        require(pendingWithdraws[_caller] > 0);
        require(msg.sender == owner);
        require(fundsDisbursed == true);

        uint pendingAmount = pendingWithdraws[_caller];
        pendingWithdraws[_caller] = 0;
        _caller.transfer(pendingAmount);
    }


}

// File: contracts\Ecommerce.sol

/** @title Ecommerce Contract */
contract Ecommerce is ReentryProtector {
    
    using SafeMath for uint256;

    function  addStore(
        bytes32 _name, 
        bytes32 _email,
        address _arbiter,
        bytes32 _storeFrontImage,
        address _selleraddress
    )
        external 
        payable
        returns (bool)
    {
        externalEnter();
        storesAccount[_selleraddress] = Store(_selleraddress, _name, _email, _arbiter, _storeFrontImage, 0/*msg.value*/, 0);
        externalLeave();
        return true;
    }

    // ===================================================
    // Fallback
    // ===================================================        
    // this contract will accept any deposit from any person/contract as a donnation when user is creating a store
    // the balance will be added to the EcommerceFactory balance
    function () public payable {
        emit LogDonnationReceived(msg.sender, msg.value);
    }
    
    mapping (address => Store) public storesAccount;             // Stores by addresses
    mapping (address => uint) public storesProductCount;         // product count by store
    mapping (address => mapping(uint => Product)) public stores; // products by stores
    mapping (uint => address) public storesByProductId;               // seller product id 
    mapping (uint => address) public productsEscrow;             // product escrow control
    

    struct Store {
        address storeAddress;
        bytes32 name;
        bytes32 email;
        address arbiter;
        bytes32 storeFrontImage;
        uint balance;
        uint productCount;
    }

    enum ProductCondition {New , Used}
    enum ProductState {ForSale, Sold, Shipped, Received, Deleted}
    struct Product {
        uint id;
        bytes32 name;
        bytes32 category;
        bytes32 imageLink;
        bytes32 descLink;
        uint startTime;
        uint price;
        address buyer;
        ProductCondition productCondition;
        ProductState productState;
        bool exists;
    }
    
    modifier onlyStoreOwner() { require(storesAccount[msg.sender].storeAddress == msg.sender, "You are not the store owner!" );  _;}
    modifier requireProductName(bytes32 _name) { require(!(_name == 0x0), "Product name is mandatory"); _;}
    modifier requireProductCategory(bytes32 _productCategory) { require(!(_productCategory == 0x0), "Product category is mandatory"); _;}
    modifier requireDescLink(bytes32 _descLink) { require(!(_descLink == 0x0), "Product description is mandatory"); _;}
    modifier requireImageLink(bytes32 _imageLink) { require(!(_imageLink == 0x0), "Product image is mandatory"); _;}
    modifier requireStartTime(uint _startTime) { require(_startTime > 0 , "Listing start time is mandatory"); _;}
    modifier requirePrice(uint _price) { require(_price > 0 , "Product price is mandatory"); _;}
    modifier productExists(uint _id) { require( stores[storesByProductId[_id]][_id].exists, "Product not found."); _; }
    modifier verifyCaller (address _caller) { require(msg.sender == _caller, "Caller not authorized to use this function."); _;}
    
    modifier validProductCondition(uint _productCondition) { 
        require(ProductCondition(_productCondition) == ProductCondition.New || ProductCondition(_productCondition) == ProductCondition.Used, "Product name is mandatory"); 
        _;
    }
    modifier forSale (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.ForSale, "Product not on Sale state"); 
        _; 
    }
    modifier sold (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Sold, "Product not on Sold State"); 
        _;
    }
    modifier shipped (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Shipped, "Product not on Shipped state"); 
        _;
    }
    modifier received (uint _id) { 
        require(stores[storesByProductId[_id]][_id].productState == ProductState.Received, "Product not on Received state"); 
        _;
    }
    modifier paidEnough(uint _price) { 
        require(msg.value >= _price, "Not paid enough for the product"); 
        _;
    }
    modifier checkValue(uint _id) {
        // refund buyer in case msg.value > product price
        _;
        uint _price = stores[storesByProductId[_id]][_id].price;
        uint _amountToRefund = msg.value.sub(_price);
        stores[storesByProductId[_id]][_id].buyer.transfer(_amountToRefund);
        emit LogCheckValue("Amount to refund", _amountToRefund);
    }

    
    event LogProductRemoved(bytes32 message, uint productCount);
    event LogDonnationReceived(address sender, uint value);
    event LogForSale(bytes32 message, uint id);
    event LogSold(bytes32 message, uint id);
    event LogShipped(bytes32 message, uint id);
    event LogReceived(bytes32 message, uint id);
    event LogCheckValue(bytes32 message, uint _amount);
    event LogEscrowCreated(uint id, address buyer, address seller, address arbiter);
    event LogReleaseAmountToSeller(bytes32 message, uint productId, address caller);
    event LogRefundAmountToBuyer(bytes32 message, uint productId, address caller);
    event LogWithdraw(bytes32 message, uint productId, address caller);


   /** @dev Add product to stores mapping - imageLink and descLink are initialized with blanks,
      * @dev this function should be used in conjunt with addProductDetail, to update imageLink and descLink
      * @param _name product name
      * @param _category product category
      * @param _startTime listing start time
      * @param _price product price in Wei 
      * @param _productCondition product condition
      * @return product index
      */    
    function addProduct(
        bytes32 _name, 
        bytes32 _category, 
        uint _startTime, 
        uint _price, 
        uint _productCondition
    ) 
        external 
        onlyStoreOwner
        requireProductName(_name)
        requireProductCategory(_category)
        requireStartTime(_startTime)
        requirePrice(_price)
        validProductCondition(_productCondition)
    {
        externalEnter();
        Product memory product = Product(
            storesProductCount[msg.sender], 
            _name, 
            _category, 
            "", 
            "", 
            _startTime, 
            _price, 
            0, 
            ProductCondition(_productCondition),  
            ProductState.ForSale,
            true
        );

        stores[msg.sender][storesProductCount[msg.sender]] = product;
        storesByProductId[storesProductCount[msg.sender]] = msg.sender;
        storesProductCount[msg.sender] = storesProductCount[msg.sender].add(1);        
        emit LogForSale("Product for Sale:", storesProductCount[msg.sender]);
        externalLeave();
    }

     /** @dev Update product image
      * @param _id  product Id
      * @param _imageLink IFPS address of the image
      */    
    function updateProductImage(
        uint _id,
        bytes32 _imageLink
    ) 
        external 
        onlyStoreOwner
        productExists(_id)
        requireImageLink(_imageLink)
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].imageLink = _imageLink;
        emit LogForSale("Product image updated:", storesProductCount[msg.sender]);
        externalLeave();
    }

     /** @dev Update product description
      * @param _id  product Id
      * @param _descLink IFPS address of product description
      */    
    function updateProductDesc(
        uint _id,
        bytes32 _descLink
    ) 
        external 
        onlyStoreOwner
        productExists(_id)
        requireDescLink(_descLink)
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].descLink = _descLink;
        emit LogForSale("Product description updated:", storesProductCount[msg.sender]);
        externalLeave();
    }


    /** @dev Update product state to Deleted
      * @param _id product id
      */    
    function removeProduct(uint _id) 
        external 
        onlyStoreOwner
        productExists(_id)
        forSale(_id)
    {
        externalEnter();
        stores[msg.sender][_id].productState = ProductState.Deleted;
        storesProductCount[msg.sender] = storesProductCount[msg.sender].sub(1);
        emit LogProductRemoved("Product removed:", _id);
        externalLeave();
    }
    
    
    /** @dev Get product details 
      * @param _id product index
      * @return Product struct
      */    
    function getProduct(uint _id) 
        external 
        productExists(_id)
        view 
        returns(
            uint id, 
            bytes32 name, 
            bytes32 category, 
            uint startTime, 
            uint price, 
            address buyer, 
            ProductCondition condition,
            ProductState productState
        ) 
    {
        Product memory product = stores[storesByProductId[_id]][_id]; // load product from memory
        return (
            product.id, 
            product.name, 
            product.category, 
            product.startTime,
            product.price, 
            product.buyer, 
            product.productCondition,
            product.productState
        );
    }


    /** @dev Get product IFPS addresses for details 
      * @param _id product index
      * @return Product image link , product Desciption link
      */    
    function getProductDetails(uint _id) 
        external 
        productExists(_id)
        view 
        returns(
            bytes32 imageLink, 
            bytes32 descLink
        ) 
    {
        Product memory product = stores[storesByProductId[_id]][_id]; // load product from memory
        return (
            product.imageLink, 
            product.descLink
        );
    }

    
    /** @dev Buy a product 
      * @param _id product name
      * @return product index
      */    
    function buyProduct(uint _id) 
        external 
        payable 
        productExists(_id)
        forSale(_id)
        paidEnough(stores[storesByProductId[_id]][_id].price)
        checkValue(_id)

    {
        externalEnter();
        Product memory product = stores[storesByProductId[_id]][_id]; // load product

        product.buyer = msg.sender; // set de buyer 
        product.productState = ProductState.Sold;
        stores[storesByProductId[_id]][_id] = product; // update the product
        emit LogSold("Product sold", _id);
        
        initEscrow(_id, msg.value, msg.sender); // create Escrow contract       

        externalLeave();
    }


    /** @dev set product state to Shipped
     * @param _id product index
     */ 
    function shipItem(uint _id) 
        external 
        sold(_id) 
        productExists(_id) 
        verifyCaller(storesByProductId[_id]) 
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].productState = ProductState.Shipped;
        emit LogShipped("Product shipped", _id);
        externalLeave();
    }

    /** @dev set product state to Received
     * @param _id product index
     */ 
    function receiveItem(uint _id) 
        external 
        shipped(_id) 
        productExists(_id) 
        verifyCaller(stores[storesByProductId[_id]][_id].buyer) 
    {
        externalEnter();
        stores[storesByProductId[_id]][_id].productState = ProductState.Received;
        emit LogReceived("Product received", _id);
        externalLeave();
    }
    
    
    /** @dev get product escrow details
      * @param _id product index
      * @return Escrow contract details
      */    
    function escrowDetails(uint _id)
        external
        productExists(_id)
        view 
        returns (address, address, address, bool, uint, uint)
    {
        return Escrow(productsEscrow[_id]).escrowDetails();
    }
    
    
    /** @dev Function to release amount to the seller
      * @param _id product index
      */      
    function releaseAmountToSeller(uint _id) 
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).releaseAmountToSeller(msg.sender);
        emit LogReleaseAmountToSeller("Amount released to Seller", _id, msg.sender);
        externalLeave();
    }


    /** @dev Function to refund amount to buyer
      * @param _id product index
      * @return product index
      */      
    function refundAmountToBuyer(uint _id)
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).refundAmountToBuyer(msg.sender);
        emit LogRefundAmountToBuyer("Amount refunded to Buyer", _id, msg.sender);
        externalLeave();
    }
    
    /** @dev Function to refund amount to buyer
      * @param _id product index
      * @return product index
      */      
    function withdraw(uint _id)
        external 
        productExists(_id)
    {
        externalEnter();
        Escrow(productsEscrow[_id]).withdraw(msg.sender);
        emit LogWithdraw("Withdraw request", _id, msg.sender);
        externalLeave();
    }

    /** @dev internal function to instantiate a escrow contract for the purchased product
     * @param _id product index
     * @param _value product value
     * @param _buyer buyer address
     */ 
    function initEscrow(uint _id, uint _value, address _buyer)
        internal
    {
        externalEnter();
        // create escrow contract
        Escrow escrow = (new Escrow).value(_value)(
            _id, 
            _buyer,
            storesByProductId[_id],  //seller
            storesAccount[storesByProductId[_id]].arbiter //load arbiter from the Store
        );
        productsEscrow[_id] = escrow;
        
        emit LogEscrowCreated(_id, _buyer, storesByProductId[_id], storesAccount[storesByProductId[_id]].arbiter);

        externalLeave();
    }




    
}

// File: contracts\Authentication.sol

/** @title Authentication contract */
contract Authentication is Ownable, Killable, ReentryProtector {
    using SafeMath for uint256;

    Ecommerce ecommerce;

    constructor(address ecommerceAddress) public payable{
        ecommerce = Ecommerce(ecommerceAddress);
    }

    // ===================================================
    // Fallback
    // ===================================================        
    // this contract will accept any deposit from any person/contract as a donnation when user is creating a store
    // the balance will be added to the EcommerceFactory balance
    function () public payable {
        emit LogDonnationReceived(owner, msg.value);
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
        returns (bool) 
    {
        externalEnter();
        
        //address newStoreAddress = (new Ecommerce).value(msg.value)(_name, _email, _arbiter, _storeImage);
        bool addStoreResult = ecommerce.addStore(_name, _email, _arbiter, _storeImage, msg.sender);
        if(addStoreResult == false)
            return false;
        storesCount = storesCount.add(1);
        //storesBySellers[msg.sender] = newStoreAddress;
        storesBySellers[msg.sender] = msg.sender;   //value doesn't matter
        emit LogCreateStore("New store created", msg.sender, msg.sender);
        externalLeave();

        return true;
    }

}
