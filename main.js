
//-------------------------------------
// user code of the thunkified request
//-------------------------------------


var thunkRequest = thunkify(getRequest)


function mainCode() {
	
	var beforeTime = Date.now()
	
	var thunkGetUser1 = thunkRequest('users/user1', 'get')
	var thunkGetUser2 = thunkRequest('users/user2', 'post')
	
	
	thunkGetUser1(function user1Got(user1) {
		thunkGetUser2(function user2Got(user2) {
			console.trace(user1, user2)
			var afterTime = Date.now()
			console.log('time took', afterTime - beforeTime, user1.ms, user2.ms)
		})
	})
	
}

mainCode()






//---------------------------
// thunkified reqyest thingy
//---------------------------




/*
	Intermediate function I wrote first, in order to write the thunkify function

function thunkRequest(url, method) {
	var userFnPtr = null
	var data = null
	var returnFn =  function thunkRequestInner(userFn) {
		if(data != null) {
			userFn(data)
		} else {
			userFnPtr = userFn
		}
	}
	
	getRequest(url, method, function requestCallbackInsideThunkWrapper(requestData) {
		if(userFnPtr != null) {
			userFnPtr(requestData)
		} else {
			data = requestData
		}
	})
	
	return returnFn
}
*/

function newArr(arr) {
	return Array.prototype.slice.call(arr, 0)
}

function thunkify(callbackFn) {
	
	var userFnPointer = null
	var callbackResult = null
	
	var callbackFnCallbackFn
	var userCallable
	
	callbackFnCallbackFn = function thunkifiedCallback(result) {
		if(userFnPointer != null) {
			userFnPointer(result)
		} else {
			callbackResult = result
		}
	}
	
	
	userCallable = function userCallable(userFn) {
		if(callbackResult != null) {
			userFn(callbackResult)
		} else {
			userFnPointer = userFn
		}
	}
	
	
	
	var thunkifiedFn = function thunkified() {
		var argsArr = newArr(arguments)
		var fixedArgs = argsArr.concat(callbackFnCallbackFn)
		
		callbackFn.apply(this, fixedArgs)
		
		return userCallable
	}
	
	return thunkifiedFn
}





//------------------------------------
// Classic callback style thingymajig 
//------------------------------------
var staticDummyUsers = [
	{
		userName: 'mike',
		id: 42,
		points: 5000
	},
	{
		userName: 'John',
		id: 2,
		points: 1250
	},
]

function getRequest(url, method, callback) {
	var ms = Math.floor( Math.random() * 1000 )
	
	setTimeout(function requestDone() {
		callback({data: staticDummyUsers[Math.random() * 2 | 0], url: url, method: method, ms: ms})
	}, ms)
}



