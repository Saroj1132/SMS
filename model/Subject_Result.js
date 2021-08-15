var mongoose=require("mongoose")
var schema=mongoose.Schema
var Resultschema=mongoose.Schema({
    Enrollment_Id:{
        type:String,
        require:true
    },
    Subject:{
        type:String,
        require:true
    },
    
    Mark:{
        type:String,
        require:true
    },
    IsModified:{
        type:Boolean,
        default:false
    },
    ModifiedDate:{
        type:Date

    },
    IsDelete:{
        type:Boolean,
        default:false
    },
    IsActive:{
        type:Boolean,
        default:true
    }
})


var Resultsub=mongoose.model("resultsub", Resultschema)

module.exports=Resultsub