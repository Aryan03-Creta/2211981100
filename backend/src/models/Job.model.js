const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
title:{
type:String,
required:true
},

companyName:{
type:String,
required:true
},

companyLogo:{
type:String
},

description:{
type:String,
required:true
},

qualifications:{
type:String,
required:true
},

responsibilities:{
type:String,
required:true
},

location:{
type:String,
required:true
},

salary:{
type:String,
required:true
},

salaryNumber:{
type:Number
},

category:{
type:String
},

type:{
type:String,
enum:["Full-time","Part-time","Remote","Internship"]
},

employer:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}

},
{timestamps:true}
);

module.exports = mongoose.model("Job",jobSchema);