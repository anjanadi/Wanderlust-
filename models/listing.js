const mongoose=require("mongoose");
const Schema =mongoose.Schema;
const listingSchema=new Schema({
title:{
    type:String,
    required:true,
},
description:String,
image:{
    type:String,
    default:"https://images.unsplash.com/photo-1752861680950-95de10209572?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D",//it is where we not given image
    set: (v)=> v===""? "https://images.unsplash.com/photo-1752861680950-95de10209572?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D": v,//it is where the user send the empty image link
},
price:Number,
location:String,
country:String, 
reviews:[
    {
        type:Schema.Types.ObjectId, 
        ref:"Review",
    }
],
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;     