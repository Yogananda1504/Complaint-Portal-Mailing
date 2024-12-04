import {model,Schema} from 'mongoose';

const medicalComplaint=new Schema({
    scholarNumber:{
        type:String,
        required:[true,"Student ID is required!"]
    },
    studentName:{
        type:String,
        required:[true,"Student name is required!"],
        trim:true
    },
    complainType:{
        type:String,
        trim:true,
        enum:["Doctor","Medicine","Ambulance","Other"]
    },
    complainDescription:{
        type:String,
        trim:true
    },
    attachments:{
        type:[String]
    },
    status:{
        type:String,
        default:"Pending",
        enum:["Pending","Resolved"]
    },
    readStatus:{
        type:String,
        default:"Not viewed",
        enum:["Not viewed","Viewed"]
    }
},{
    timestamps:true
})  

medicalComplaint.index({scholarNumber:1});
medicalComplaint.index({createdAt:1});

const MedicalComplaint=model('MedicalComplaints',medicalComplaint);

export default MedicalComplaint;