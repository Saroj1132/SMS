var mongoose=require("mongoose")
var schema=mongoose.Schema
var noticetschema=mongoose.Schema({
    
    Type:{
        type:String,
        require:true
    },
    Description:{
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


var notice_templates=mongoose.model("notice_templates", noticetschema)

module.exports=notice_templates