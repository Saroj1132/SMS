var mongoose=require("mongoose")
var schema=mongoose.Schema
var Subjectschema=mongoose.Schema({
    Subject:{
        type:String,
        require:true
    },
    CreateDate:{
        type:Date,
        default:Date.now()
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


var Subject=mongoose.model("subject", Subjectschema)

module.exports=Subject