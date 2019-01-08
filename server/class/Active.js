class Active{
	constructor(){
		this.active=[];
	}
	addUser(id,username,room_id,image){
		var user ={id,username,room_id,image};
		this.active.push(user);
		return user;
	};
	removeUser(id){
		console.log('from rmove');
		var user = this.getUser(id);
		if (user) {
		   this.active = this.active.filter((user)=>user.id != id);
		}
		return user;
	};
	getUser(id){
		return this.active.filter((user)=>user.id == id)[0];
	};
	getUserList(room_id){
		var userrs = this.active.filter((user)=>user.room_id == room_id);
		//get the names only into array 
		var namesarr = userrs.map((user)=>user);
		return namesarr;
	};

}
module.exports={Active}