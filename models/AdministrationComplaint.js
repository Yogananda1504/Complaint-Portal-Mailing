import {model,Schema} from 'mongoose';

const administrationComplaint=new Schema({
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
        enum:["Documents","Accounts","Scholarship","Details","Other"]
    },
    department:{
        type:String,
        required:[true,"Department is required!"]
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

administrationComplaint.index({scholarNumber:1});
administrationComplaint.index({createdAt:1});

const AdministrationComplaint=model('AdministrationComplaints',administrationComplaint);

export default AdministrationComplaint;