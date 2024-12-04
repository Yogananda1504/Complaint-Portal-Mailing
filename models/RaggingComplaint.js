import { model,Schema } from "mongoose";


const raggingComplaint=new Schema({
    scholarNumber:{
        type:String,
        required:[true,"Student ID is required!"]
    },
    studentName:{
        type:String,
        required:[true,"Student name is required!"],
        trim:true
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

raggingComplaint.index({scholarNumber:1});
raggingComplaint.index({createdAt:1});

const RaggingComplaint=model('RaggingComplaints',raggingComplaint);
export default RaggingComplaint;