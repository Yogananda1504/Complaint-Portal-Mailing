import {model,Schema} from 'mongoose';

const infrastructureComplaint=new Schema({
    scholarNumber:{
        type:String,
        required:[true,"Student ID is required!"]
    },
    studentName:{
        type:String,
        required:[true,"Student name is required!"],
        trim:true
    },
    landmark : {
        type: String,
        required: [true, "Landmark is required!"],
        trim: true,
    },
    complainType:{
        type:String,
        trim:true,
        enum:["Electricity","Water","Internet","Bus","Classroom","Library","Sports","Lab","Other"]
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

infrastructureComplaint.index({scholarNumber:1});
infrastructureComplaint.index({createdAt:1});
infrastructureComplaint.index({complainType:1});

const InfrastructureComplaint=model('InfrastructureComplaints',infrastructureComplaint);
export default InfrastructureComplaint;