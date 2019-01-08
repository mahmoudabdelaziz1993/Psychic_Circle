var uniqid = require('uniqid');
class Room {
    constructor() {
            this.rooms = [];
        }
        //add  gwt rooms list  room 
    addRoom(name, author, author_id) {

    	// check is the room name is't exist
    	var x = this.getRoomByName(name);
    	if (x) {
    		return false ;
    	}
        var id = uniqid();
        var room = {
            id : uniqid(),
            author : author,
            name : name,
            author_id: author_id
        };
        this.rooms.push(room);
        return true;
    };
    getRoomsList(){
    	return this.rooms.map((room)=>room);
    };
    getRoomByName(name){
    	// fetch the first room which name equal the name
    	return this.rooms.filter((room)=>room.name==name)[0];
    };

    getRoomByID(id){
        // fetch the first room which name equal the name
        var exist = this.rooms.filter((room)=>room.id==id)[0];
        if (exist) {
            return true;
        }else{
            return false;
        }


    };








}
module.exports = {
    Room
}