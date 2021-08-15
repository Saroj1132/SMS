const express=require("express")
const router=express.Router()
const tblstudent=require('../../model/Student')
const tblteacher=require('../../model/Teacher')
const tbladmin=require('../../model/Admin_login')
const tblsubject=require('../../model/Subject')
const tblnoticet=require('../../model/Notice_template')
const tblnotice=require('../../model/Notice')
var nodemailer=require('nodemailer')
const tblsubjectResult=require('../../model/Subject_Result')
var adminauth=require('../../config/auth')
const jwt = require("jsonwebtoken")

const bcrypt=require('bcryptjs')
var rn = require('random-number');

var transport=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "sarojpanigrahi719@gmail.com" ,
        pass: "7572999405"
    }
  })
  
router.get('/Dashboard', adminauth.adminauth,(req, res)=>{
    const aggregateOpts=[
        {
            $group:{_id:{Standered:"$Standered"}, count:{$sum:1}}
        },
        {
            $lookup:{
                from:'teachers',
                localField:'_id.Standered',
                foreignField:'Class',
                as:'useras'
            }
        },
        {
            $project:{
                Class:"$useras.Class",
                count:1
            }
        }
    ]
    
    tblstudent.aggregate(aggregateOpts).then(doc=>{
        res.render("Admin/Dashboard", {success: req.flash('success'), 
        errors: req.flash('errors'), Standered:doc})
    })
})

router.get('/login', (req, res)=>{
    if(req.session.admin){
        res.redirect('/Admin/Dashboard')
    }else{
        res.render("Admin/Admin_login", {result:""})
    }
})

router.post('/login', (req, res)=>{
    const  {Password, Username}=req.body
    tbladmin.findOne({Username:Username, Password:Password})
    .exec()
    .then(doc=>{
        if(doc){
            const token=jwt.sign({
                _id:doc._id
            }, "admin123")
            req.session.admin=token
            req.flash('success', "Login Succesfully")
            res.redirect('/Admin/Dashboard')
        }else{
            res.render("Admin/Admin_login", {result:"Username and Password was Incorrected"})
        }
    })
})

router.get('/Add_Student', adminauth.adminauth,(req, res)=>{
    res.render("Admin/Add_Student")
})

router.post('/Add_Student', adminauth.adminauth,(req, res)=>{
    const gen=Math.floor(Math.random(0000) * 10000);
    console.log(gen)
    const {Password, DOB, MobileNo, Name, Email, Gender, Standered, State, District}= req.body
    tblstudent.findOne({Email:Email})
    .exec()
    .then(email=>{
        if(email){
            req.flash('errors', "Email_id Already Present")
            res.redirect('/Admin/Student_list')
        }else{
            bcrypt.hash(Password, 10, (err, hash)=>{
                const student=new tblstudent({
                    Password:hash,
                    Name,
                    DOB,
                    Email,
                    MobileNo, 
                    Gender,
                    Standered,
                    State,
                    District
                })
                student.save()
                .then(doc=>{
                    var str = doc.Name
                    var result = str.substring(0, 4);
            
                    tblstudent.findByIdAndUpdate({_id:doc._id},{
                        Username:`${result}${gen}`,
                        Enrollment_Id:`${result}${doc.Standered}VIZ`
                    }).exec()
                    .then(user=>{
                        console.log(user)
                        var mailoption = {
                            from: "sarojpanigrahi719@gmail.com",
                            to: req.body.Email,
                            subject: "Regarding Students Account Details",
                            text: `your username is ${result}${gen} and Your Password is ${req.body.Password} !!! <br> Your Enrollment id is ${result}${doc.Standered}VIZ`,
                            
                        }
                        //console.log("callupdate")
                        transport.sendMail(mailoption, (req, res) => {
                            //console.log(req.body)
                            console.log("Mail send succesfully")
                        })
                        req.flash('success', "Genrated Student")
                        res.redirect('/Admin/Student_list')
                    })
                })
            
            })
        }
    })
    
})

router.get('/Student_list', adminauth.adminauth,(req, res)=>{
    tblstudent.find().sort({_id:-1})
    .exec()
    .then(doc=>{
        res.render("Admin/Student_list", {records:doc, success: req.flash('success'), 
        errors: req.flash('errors')})

    })
})

router.get('/Add_Teacher', adminauth.adminauth,(req, res)=>{
    res.render("Admin/Add_Teacher")
})

router.post('/Add_Teacher', adminauth.adminauth,(req, res)=>{
    const gen=Math.floor(Math.random(0000) * 10000);
    console.log(gen)
    const {Password, DOB, Name, Email, Gender, Class, State, District, MobileNo}= req.body
    tblteacher.findOne({Email:Email})
    .exec()
    .then(email=>{
        if(email){
            req.flash('errors', "Email_id Already Present")
            res.redirect('/Admin/Teacher_list')
        }else{
            bcrypt.hash(Password, 10, (err, hash)=>{
        
                const teacher=new tblteacher({
                    Password:hash,
                    Name,
                    DOB,
                    Email,
                    MobileNo, 
                    Gender,
                    Class,
                    State,
                    District
                })
                teacher.save()
                .then(doc=>{
                    var str = doc.Name
                    var result = str.substring(0, 4);
            
                    tblteacher.findByIdAndUpdate({_id:doc._id},{
                        Username:`${result}${gen}`,
                        Teacher_Id:`${result}${doc.Class}VIZ`
                    }).exec()
                    .then(username=>{
                        var mailoption = {
                            from: "sarojpanigrahi719@gmail.com",
                            to: req.body.Email,
                            subject: "Regarding Students Account Details",
                            text: `your username is ${result}${gen} and Your Password is ${req.body.Password} !!! <br> Your Enrollment id is ${result}${doc.Class}VIZ`,
                            
                        }
                        //console.log("callupdate")
                        transport.sendMail(mailoption, (req, res) => {
                            //console.log(req.body)
                            console.log("Mail send succesfully")
                        })
                        req.flash('success', "Genrated Teacher")
                        res.redirect('/Admin/Teacher_list')
                    })
                })
            
            })
        }
    })
})

router.get('/Teacher_list', adminauth.adminauth,(req, res)=>{
    tblteacher.find().sort({_id:-1})
    .exec()
    .then(doc=>{
        res.render("Admin/Teacher_list", {records:doc, success: req.flash('success'), 
        errors: req.flash('errors')})
    })
})

router.post('/studentdisbale/:id', adminauth.adminauth,(req, res)=>{
    tblstudent.findById({_id:req.params.id})
    .exec()
    .then(doc=>{
        console.log(doc._id)
        if(doc.IsDelete==true){
            tblstudent.findByIdAndUpdate({_id:doc._id}, {
                IsDelete:false
            }).exec()
            .then(enableaccount=>{
                            
                req.flash('success', "Account Enabled")
                    res.redirect('/Admin/Student_list')
            })
        }else{
            tblstudent.findByIdAndUpdate({_id:doc._id}, {
                IsDelete:true
            }).exec()
            .then(disbaleaccount=>{
                            
                req.flash('success', "Account Disable")
                res.redirect('/Admin/Student_list')
            })
        }
    })
})

router.post('/teacherdisbale/:id', adminauth.adminauth,(req, res)=>{
    tblteacher.findById({_id:req.params.id})
    .exec()
    .then(doc=>{
        console.log(doc._id)
        if(doc.IsDelete==true){
            tblteacher.findByIdAndUpdate({_id:doc._id}, {
                IsDelete:false
            }).exec()
            .then(enableaccount=>{
                            
                req.flash('success', "Account Enabled")
                res.redirect('/Admin/Teacher_list')
            })
        }else{
            tblteacher.findByIdAndUpdate({_id:doc._id}, {
                IsDelete:true
            }).exec()
            .then(disbaleaccount=>{
                            
                req.flash('success', "Account Disable")
                res.redirect('/Admin/Teacher_list')
            })
        }
    })
})

router.get('/Subject_list',adminauth.adminauth, (req, res)=>{
    tblsubject.find({IsDelete:false}).sort({_id:-1})
    .then(doc=>{
        res.render("Admin/Subject_list", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc})
    })
})

router.get('/Add_Subject',adminauth.adminauth, (req, res)=>{
    res.render("Admin/Add_Subject", {update:false})
})

router.post('/Add_Subject', adminauth.adminauth,(req, res)=>{
    const {Subject} = req.body

    const tblsub=new tblsubject({
        Subject
    })
    tblsub.save()
    .then(doc=>{
        req.flash('success', "Subject added sucessfully")
        res.redirect('/admin/Subject_list')
    })
    
})

router.get('/deletesub/:id', (req, res)=>{
    tblsubject.findOneAndUpdate({_id:req.params.id},{IsDelete:true})
    .then(doc=>{
        req.flash('success', "Subject deleted sucessfully")
        res.redirect('/admin/Subject_list')
    })
})

router.get('/updatesub/:id', (req, res)=>{
    tblsubject.findById({_id:req.params.id, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Add_Subject", {update:true, com:doc})
    })
})

router.post('/updatesub/:id', (req, res)=>{
    const {Subject} = req.body

    tblsubject.findByIdAndUpdate({_id:req.params.id}, {
        IsModified:true,
        ModifiedDate:Date.now(),
        Subject
    })
    .exec()
    .then(doc=>{
        req.flash('success', "Subject update sucessfully")
        res.redirect('/admin/Subject_list')    
    })
})

router.get('/Noticet_list', adminauth.adminauth,(req, res)=>{
    tblnoticet.find({IsDelete:false}).sort({_id:-1})
    .then(doc=>{
        res.render("Admin/Noticet_list", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc})
    })
})

router.get('/Add_Noticet', adminauth.adminauth,(req, res)=>{
    res.render("Admin/Add_NoticeTemplate", {update:false})
})

router.post('/Add_Noticet', adminauth.adminauth,(req, res)=>{
    const {Type, Description} = req.body

    const tblnott=new tblnoticet({
        Type,
        Description
    })
    tblnott.save()
    .then(doc=>{
        req.flash('success', "Notice Template added sucessfully")
        res.redirect('/admin/Noticet_list')
    })
    
})

router.get('/deletenoticet/:id', (req, res)=>{
    tblnoticet.findOneAndUpdate({_id:req.params.id},{IsDelete:true})
    .then(doc=>{
        req.flash('success', "Notice Template deleted sucessfully")
        res.redirect('/admin/Noticet_list')
    })
})

router.get('/Update_Noticet/:id', (req, res)=>{
    tblnoticet.findById({_id:req.params.id, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Add_NoticeTemplate", {update:true, com:doc})
    })
})

router.post('/Update_Noticet/:id', (req, res)=>{
    const {Type, Description} = req.body

    tblnoticet.findByIdAndUpdate({_id:req.params.id}, {
        IsModified:true,
        ModifiedDate:Date.now(),
        Type, Description
    })
    .exec()
    .then(doc=>{
        req.flash('success', "Notice Template update sucessfully")
        res.redirect('/admin/Noticet_list')    
    })
})

router.get('/Notice_list',adminauth.adminauth, (req, res)=>{
    tblnotice.find({IsDelete:false}).populate("Notice_Type").sort({_id:-1})
    .then(doc=>{
        res.render("Admin/Notice_list", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc})
    })
})

router.get('/Add_Notice', adminauth.adminauth,(req, res)=>{
    tblnoticet.find({IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Add_Notice", {update:false, noticetype:doc})
    })
})

router.post('/Add_Notice',adminauth.adminauth, (req, res)=>{
    const {Notice_For, Notice_Type, Read} = req.body

    const tblnot=new tblnotice({
        Notice_For,
        Notice_Type,
        Read
    })
    tblnot.save()
    .then(doc=>{
        req.flash('success', "Notice added sucessfully")
        res.redirect('/admin/Notice_list')
    })
    
})

router.get('/deletenotice/:id', (req, res)=>{
    tblnotice.findOneAndUpdate({_id:req.params.id},{IsDelete:true})
    .then(doc=>{
        req.flash('success', "Notice deleted sucessfully")
        res.redirect('/admin/Notice_list')
    })
})

router.get('/Update_Notice/:id', (req, res)=>{
    tblnotice.findById({_id:req.params.id, IsDelete:false})
    .populate("Notice_Type")
    .then(doc=>{
        tblnoticet.find({IsDelete:false})
        .exec()
        .then(docnotice=>{
            res.render("Admin/Add_Notice", {update:true, com:doc, noticetype:docnotice})
        })
    })
})

router.post('/Update_Notice/:id', (req, res)=>{
    const {Notice_For, Notice_Type, Read} = req.body

    tblnotice.findByIdAndUpdate({_id:req.params.id}, {
        IsModified:true,
        ModifiedDate:Date.now(),
        Notice_For, Notice_Type,
        Read
    })
    .exec()
    .then(doc=>{
        req.flash('success', "Notice update sucessfully")
        res.redirect('/admin/Notice_list')    
    })
})

router.get('/Addresult', adminauth.adminauth,(req, res)=>{
    tblsubject.find({IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Add_Result", {update:false, subject:doc})
    })
})

router.post('/Addresult',adminauth.adminauth, (req, res)=>{
    const {Enrollment_Id, Subject, Mark} = req.body

    const tblsubres=new tblsubjectResult({
        Enrollment_Id,
        Subject,
        Mark
    })
    tblsubres.save()
    .then(doc=>{
        req.flash('success', "Result generate sucessfully")
        res.redirect('/admin/Dashboard')
    })
    
})

router.get('/ManageResult', adminauth.adminauth, (req, res)=>{
    res.render("Admin/Result_Standered", {success: req.flash('success'), 
        errors: req.flash('errors')})
})

router.get('/Result_Enrollment_list/:id', adminauth.adminauth, (req, res)=>{
    tblstudent.find({Standered:req.params.id, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Result_Enrollment", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc})
    })
})

router.get('/Mark_List/:Enrollment_Id', adminauth.adminauth, (req, res)=>{
    tblsubjectResult.find({IsDelete:false, Enrollment_Id:req.params.Enrollment_Id})
    .then(doc=>{
        res.render("Admin/Marksheet", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, stud:req.stud})
    })
})


router.get('/ManageStudent', adminauth.adminauth, (req, res)=>{
    res.render("Admin/Student_Standered", {success: req.flash('success'), 
        errors: req.flash('errors')})
})


router.get('/Student_Enrollment_list/:id', adminauth.adminauth, (req, res)=>{
    tblstudent.find({Standered:req.params.id, IsDelete:false})
    .exec()
    .then(doc=>{
        res.render("Admin/Student_Enrollment", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc})
    })
})

router.get('/Student_Details/:Enrollment_Id', adminauth.adminauth, (req, res)=>{
    tblstudent.find({IsDelete:false, Enrollment_Id:req.params.Enrollment_Id})
    .then(doc=>{
        res.render("Admin/Student_Details", {success: req.flash('success'), 
        errors: req.flash('errors'), record:doc, teac:req.teac})
    })
})



// router.get('/deleteresult/:id', (req, res)=>{
//     tblsubjectResult.findOneAndUpdate({_id:req.params.id},{IsDelete:true})
//     .then(doc=>{
//         req.flash('success', "Result deleted sucessfully")
//         res.redirect('/admin/ManageResult_list')
//     })
// })

// router.get('/Update_Result/:id', (req, res)=>{
//     tblsubjectResult.findById({_id:req.params.id, IsDelete:false})
//     .exec()
//     .then(doc=>{
//         tblnoticet.find({IsDelete:false})
//         .exec()
//         .then(docnotice=>{
//             res.render("Admin/Add_Notice", {update:true, com:doc, noticetype:docnotice})
//         })
//     })
// })

// router.post('/Update_Notice/:id', (req, res)=>{
//     const {Enrollment_Id, Subject, Mark} = req.body

//     tblnotice.findByIdAndUpdate({_id:req.params.id}, {
//         IsModified:true,
//         ModifiedDate:Date.now(),
//         Enrollment_Id,
//         Subject,
//         Mark
//     })
//     .exec()
//     .then(doc=>{
//         req.flash('success', "Result update sucessfully")
//         res.redirect('/admin/ManageResult_list')
//     })
// })


module.exports=router

