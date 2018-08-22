const Authentication = artifacts.require('./Authentication.sol');
const Ecommerce = artifacts.require('./Ecommerce.sol');

contract('Authentication', async ([ owner, buyer, seller, arbiter ]) => {
	let authentication;
	let ecommerce;

	console.log();
	console.log('Users List:');
	console.log('=============================================================');
	console.log('Contract owner   ', owner);
	console.log('Contract buyer   ', buyer);
	console.log('Contract seller  ', seller);
	console.log('Contract arbiter ', arbiter);

	beforeEach('setup contract for each test', async () => {
		ecommerce = await Ecommerce.new();

		authentication = await Authentication.new(ecommerce.address);
		console.log(' === before each ===');
		console.log('ecommerce.address     : ', ecommerce.address);
		console.log('authentication.address: ', authentication.address);
	});

	it('contract has an owner', async () => {
		assert.equal(await authentication.owner(), owner);
	});

	it('contract is able to accept funds', async () => {
		await authentication.sendTransaction({ value: web3.toWei(1), from: owner });
		const authAddress = await authentication.address;
		assert.equal(web3.eth.getBalance(authAddress).toNumber(), web3.toWei(1));
	});

	it('login as Owner', async () => {
		const [ name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.login({
			from: owner
		});
		const expectedUserType = 3; // Owner

		assert.equal(userType.c[0], expectedUserType, 'Owner coult not log in.');
	});

	it('should sign up and log in as a Buyer', async () => {
		const expectedName = 'Buyer';
		const expectedEmail = 'buyer@test.com';
		const expetectPhoneNumber = '123456789';
		const expectedProfilePicture = 'image';
		const expectedUserType = 0; // Buyer
		const expectedUserState = 1; // Approved

		await authentication.signup(
			expectedName,
			expectedEmail,
			expetectPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: buyer }
		);

		const [ name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.login({
			from: buyer
		});

		assert.equal(expectedName, web3.toUtf8(name), 'User name does not match.');
		assert.equal(expectedEmail, web3.toUtf8(email), 'User email does not match.');
		// assert.equal(expetectPhoneNumber, web3.toBN(phoneNumber) , 'User phone number does not match.');
		assert.equal(expectedProfilePicture, web3.toUtf8(profilePicture), 'User profile picture does not match.');
		// assert.equal(expectedUserType, userType, 'User Type does not match.');
		// assert.equal(expectedUserState, userState, 'User State does not match.');
	});

	it('should sign up and log in as a Seller', async () => {
		const expectedName = 'Seller';
		const expectedEmail = 'seller@test.com';
		const expetectPhoneNumber = '987654321';
		const expectedProfilePicture = 'image';
		const expectedUserType = 1; // Seller
		const expectedUserState = 0; // Pending

		await authentication.signup(
			expectedName,
			expectedEmail,
			expetectPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: seller }
		);

		const [ name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.login({
			from: seller
		});

		console.log("^^^^^^^^^^^ name : ", name);
		console.log("^^^^^^^^^^^ email : ", email);
		console.log("^^^^^^^^^^^ phoneNumber : ", phoneNumber);
		console.log("^^^^^^^^^^^ profilePicture : ", profilePicture);
		console.log("^^^^^^^^^^^ userType : ", userType);
		console.log("^^^^^^^^^^^ userState : ", userState);

		assert.equal(expectedName, web3.toUtf8(name), 'User name does not match.');
		assert.equal(expectedEmail, web3.toUtf8(email), 'User email does not match.');
		// assert.equal(expetectPhoneNumber, web3.toBN(phoneNumber) , 'User phone number does not match.');
		assert.equal(expectedProfilePicture, web3.toUtf8(profilePicture), 'User profile picture does not match.');
		assert.equal(expectedUserType, userType.c[0], 'User Type does not match.');
		assert.equal(expectedUserState, userState.c[0], 'User State does not match.');
	});

	it('aprove Arbiter', async () => {
		const expectedName = 'Authorized Arbiter';
		const expectedEmail = 'arbiter@test.com';
		const expetectPhoneNumber = '987654321';
		const expectedProfilePicture = 'image';
		const expectedUserType = 2; // Arbiter
		const expectedUserState = 1; // Approved

		await authentication.signup(
			expectedName,
			expectedEmail,
			expetectPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: arbiter }
		);

		await authentication.updateUserState(arbiter, expectedUserState, { from: owner });

		const [ name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.users.call(
			arbiter
		);
		assert.equal(expectedUserState, userState.c[0], 'Arbiter not approved');
	});

	it('create/aprove Seller and let him create a Store', async () => {
		let expectedName = 'Authorized Seller';
		let expectedEmail = 'seller@test.com';
		let expetectPhoneNumber = '987654321';
		let expectedProfilePicture = 'image';
		let expectedUserType = 1; // Seller
		let expectedUserState = 1; // Approved

		await authentication.signup(
			expectedName,
			expectedEmail,
			expetectPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: seller }
		);
		await authentication.updateUserState(seller, expectedUserState, { from: owner });

		const userID = await authentication.usersCount.call();
		console.log("******* userID : ", userID);
		const [ address, name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.getUser(userID.toNumber());
		console.log("******* address : ", address);
		console.log("******* name : ", name);
		console.log("******* email : ", email);
		console.log("******* phoneNumber : ", phoneNumber);
		console.log("******* profilePicture : ", profilePicture);
		console.log("******* userState : ", userState);
		assert.equal(expectedUserState, userState.c[0], 'Seller not approved');

		// create an arbiter for the store
		expectedName = 'Authorized Arbiter';
		expectedEmail = 'arbiter@test.com';
		expetectPhoneNumber = '987654321';
		expectedProfilePicture = 'image';
		expectedUserType = 2; // Arbiter
		expectedUserState = 1; // Approved

		await authentication.signup(
			expectedName,
			expectedEmail,
			expetectPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: arbiter }
		);
		await authentication.updateUserState(arbiter, expectedUserState, { from: owner });

		// create store
		const storeName = '0x1';
		const storeEmail = '0x1';
		const storeImage = 'image';

		await authentication.createStore(storeName, storeEmail, storeImage, arbiter, { from: seller });

		const sellerAddress = await authentication.sellersById.call(1);
		assert.equal(sellerAddress, seller, 'Store not created');
	});

	it('list users', async () => {
		//let expectedName = '0x12e18';
		let expectedName = 'asdfasdfasdf';
		let expectedEmail = 'seller@test.com';
		let expectedPhoneNumber = '987654321';
		let expectedProfilePicture = 'a987654321';
		let expectedUserType = 1; // Seller
		let expectedUserState = 1; // Approved

		await authentication.signup(
			expectedName,
			expectedEmail,
			expectedPhoneNumber,
			expectedProfilePicture,
			expectedUserType,
			{ from: seller }
		);

		const usersCount = await authentication.usersCount.call();
		console.log('usersCount: ', usersCount.toNumber());

		let userTypes = ["Buyer", "Seller", "Arbiter", "Owner"];
		let userStatus = ["Pending", "Approved"];
		
		let obj = {};
		for (let i = 1; i <= usersCount; i++) {
			const [ address, name, email, phoneNumber, profilePicture, userType, userState ] = await authentication.getUser(i);
			obj = {
				id : i,
				address: address,
				name: web3.toUtf8(name),
				email: web3.toUtf8(email),
				phoneNumber:web3.toUtf8(phoneNumber),
				profilePicture: web3.toUtf8(profilePicture),
				userType: userTypes[userType.toNumber()],
				userState: userStatus[userState.toNumber()]
			};
			console.log(obj);
		}
		assert.equal(obj.name, expectedName, 'Failed on list users');
	});
});
