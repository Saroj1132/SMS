var mongoose=require("mongoose")
var Teacherschema=mongoose.Schema({
    Teacher_Id:{
        type:String,
        require:true
    },
    Username:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Name:{
        type:String,
        require:true
    },
    DOB:{
        type:Date,
        require:true
    },
    Gender:{
        type:String,
        require:true
    },
    Class:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    MobileNo:{
        type:String,
        require:true
    },
    State:{
        type:String,
        require:true
    },
    District:{
        type:String,
        require:true
    },
    Registraion_Date:{
        type:Date,
        default:Date.now()
    },
    IsDelete:{
        type:Boolean,
        default:false
    },
    IsActive:{
        type:Boolean,
        default:true
    },
    IsModified:{
        type:Boolean,
        default:false
    },
    ModifiedDate:{
        type:Date

    }
})


var TeacherRegistration=mongoose.model("teachers", Teacherschema)

module.exports=TeacherRegistration