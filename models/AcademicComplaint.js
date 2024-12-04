import { model, Schema } from 'mongoose';

const academicComaplaint=new Schema({
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
        enum:["Faculty","Timetable","Course","other"]
    },
    stream:{
        type:String,
        required:[true,"Stream is required!"],
       
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

academicComaplaint.index({scholarNumber:1});
academicComaplaint.index({createdAt:1});
academicComaplaint.index({department:1});

const AcademicComplaint=model('AcademicComplaints',academicComaplaint);

export default AcademicComplaint;