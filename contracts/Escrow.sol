pragma solidity ^0.4.24;


/** @title Escrow Contract - used to control money release on a market. */
contract Escrow  {
    
    address public buyer;
    address public seller;
    address public arbiter;
    uint public productId;
    uint public amount;   // price per product
    mapping(address => bool) releaseAmount;
    mapping(address => bool) refundAmount;
    uint public releaseCount;
    uint public refundCount;
    bool public fundsDisbursed;
    address public owner;
    
    
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
    
    
    function escrowDetails() view public returns (address, address, address, bool, uint, uint) {
        return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
        
    }
    
    
    function releaseAmountToSeller(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((_caller == buyer || _caller == seller || _caller == arbiter) && releaseAmount[_caller] != true) {
            releaseAmount[_caller] = true;
            releaseCount++;
        }
        
        // two parties have participated of the process, so the money can be released
        if (releaseCount == 2) {
            seller.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogReleaseAmountToSeller("Amount released to Seller", _caller, releaseCount, amount);
    }
    
    
     
    function refundAmountToBuyer(address _caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((_caller == buyer || _caller == seller || _caller == arbiter) && releaseAmount[_caller] != true) {
            refundAmount[_caller] = true;
            refundCount++;
        }
        
        // two parties have participated of the process, so the money can be released
        if (refundCount == 2) {
            buyer.transfer(amount);
            fundsDisbursed = true;
        }
        
        emit LogRefundAmountToBuyer("Amount refunded to Buyer", _caller, refundCount, amount);
    }

}