var mongoose = require('mongoose');
const bycrpt = require('bcrypt-nodejs');
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    username:{type: String,
    required: true},
    gender:{type: String},
    image:{type: String},
    social_id:String,
    password: { type: String, default: null },
    email:{type: String, default: null}
  });

//-----------------------------------bycrpt password ---------------------------
userSchema.methods.encryptpass = function (password) {
  return bycrpt.hashSync(password,bycrpt.genSaltSync(10),null);
}

//--------------------------------- compare password with the hash ----------------
userSchema.methods.validpassword = function(password){
  return bycrpt.compareSync(password, this.password);

}
  var User = mongoose.model('users',userSchema);
  module.exports={User};


  //   userSchema.methods.findOrCreate = function(data, callback){
//   findOne({'social_id': data.id}, function(err, user){
//     if(err) { return callback(err); }
//     if(user){
//       return callback(err, user);
//     } else {
//       var userData = {
//         username: data.displayName,
//         social_id: data.id,
//         image: data.photos[0].value || null,
//         gender:data.gender
//       };

//       // // To avoid expired Facebook CDN URLs
//       // // Request user's profile picture using user id 
//       // // @see http://stackoverflow.com/a/34593933/6649553
//       // if(data.provider == "facebook" && userData.picture){
//       //   userData.picture = "http://graph.facebook.com/" + data.id + "/picture?type=large";
//       // }

//       create(userData, function(err, newUser){
//         callback(err, newUser);
//       });
//     }
//   });
// };
