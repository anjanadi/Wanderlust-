const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const Wanderlust="mongodb://127.0.0.1:27017/Wanderlust";
main().then(()=>{
    console.log("Database Connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(Wanderlust);
};
const initDB=async()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(      //sradha didi initData.data only werite but it gives error
  initData.data.map(item => ({     //We return ...item so we keep all the other fields exactly as they are,and then override image with the format your schema expects.
    ...item,
    image: item.image.url // take only the URL
  }))
);

   console.log("data Was intialized");
};
initDB();