const { Schema, model } = require('mongoose');

const googleSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    profilePic: { type: String, required: true },
    _id:{type:String,required:true},
},{timestamps:true});

googleSchema.index({ email: 1 }, { unique: true });

const GoogleUser = model('GoogleUser', googleSchema);

module.exports = GoogleUser;