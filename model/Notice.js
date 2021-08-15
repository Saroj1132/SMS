var mongoose=require("mongoose")
var schema=mongoose.Schema
var noticeschema=mongoose.Schema({
    
    Notice_Type:{
        type:schema.Types.ObjectId,
        ref:'notice_templates'
    },
    Notice_For:{
        type:String,
        require:true
    },
    Read:{
        type:String,
        require:true
    },
    CreatedDate:{
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


var notice=mongoose.model("notice", noticeschema)

module.exports=notice