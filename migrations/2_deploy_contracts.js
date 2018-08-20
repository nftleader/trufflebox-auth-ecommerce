/*
var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var ReentryProtector = artifacts.require("./ReentryProtector.sol");
var Authentication = artifacts.require("./Authentication.sol");
var Ecommerce = artifacts.require("./Ecommerce.sol");
var Escrow = artifacts.require("./Escrow.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.autolink();
  deployer.deploy(Killable);
  deployer.autolink();
  deployer.deploy(SafeMath);
  deployer.autolink();
  deployer.deploy(ReentryProtector);
  deployer.autolink();
  deployer.deploy(Authentication);
  deployer.autolink();
  deployer.deploy(Ecommerce);
  deployer.autolink();
  deployer.deploy(Escrow);
};
*/

var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol');
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol');
var Authentication = artifacts.require('./Authentication.sol');

module.exports = function(deployer) {
	deployer.deploy(Ownable);
	deployer.link(Ownable, Killable);
	deployer.deploy(Killable);
	deployer.link(Killable, Authentication);
	deployer.deploy(Authentication);

};

/*
var Authentication_flat = artifacts.require('../contracts_flat/Authentication_flat.sol');

module.exports = function(deployer) {
	deployer.deploy(Authentication_flat);
}
*/