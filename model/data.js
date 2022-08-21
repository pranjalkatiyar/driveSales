const mongoose=require('mongoose');
// const Schema=mongoose.Schema;

const driveSales=new mongoose.Schema({
    id:String,
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    startDateTime:{
        type:Date,
        required:true
    },
    endDateTime:{
        type:Date,
        required:true
    },
    priority:{
        type:Number,
        required:true,
        unique:true
    },
    status:{
        type:Boolean,
        required:true
    }
});

module.exports=mongoose.model('drivesale',driveSales);

