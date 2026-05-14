const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

job:{
type:mongoose.Schema.Types.ObjectId,
ref:"Job"
},

applicant:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

name:String,
email:String,
phone:String,

city:String,
country:String,

experience:String,
currentCompany:String,

expectedSalary:String,
noticePeriod:String,

skills:String,
coverLetter:String,

resume:String,

status:{
type:String,
default:"applied",
enum:["applied","accepted","rejected"]
}

},{timestamps:true});

module.exports = mongoose.model("Application",applicationSchema);