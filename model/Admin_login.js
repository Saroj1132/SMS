var mongoose=require("mongoose")
var schema=mongoose.Schema
var admins=mongoose.Schema({
    
    Username:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    }
})


var AdminRegistration=mongoose.model("admins", admins)

module.exports=AdminRegistration