const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Data=require("./init/data.js");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Wanderlust="mongodb://127.0.0.1:27017/Wanderlust";
main().then(()=>{
    console.log("Database Connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(Wanderlust);
};
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/test",async(req,res) => {
// let sampleListing=new Listing({
//     title:"My New Vila",
//     description:"BY the Beach",
//     price:1200,
//     location:"Calanguate,goa",
//     country:"india",

// });
// await sampleListing.save();
// console.log("sample Was Saved");
// res.send("Sucess full testing");
// });
//index route
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);


if(error){
  let errorMessage= error.details.map(el=>el.message).join(",");
  throw new ExpressError(400,errorMessage);
}else{
    next();
}
}
app.get("/listings",async(req,res)=>{
   const alllisting=await Listing.find({});
  res.render("listing/index.ejs",{alllisting});
//    console.log(alllisting);
});
//new And Create route
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});
// //create route
// app.post("/listings",async(req,res,next)=>{
//     // let{title,descripion,image,price,country,location}=req.body;
// // let listing=req.body.listing;
// try{const newlisting=new Listing(req.body.listing);
// await newlisting.save();
// res.redirect("/listings");}
// catch(e){
//     next(e);
// }
// });
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
const newlisting=new Listing(req.body.listing);

   //without writing this we use the joi package for validation
   //  if(!newlisting.price){throw new ExpressError(400,"Invalid Listing Data Price is Required");
    // if(!newlisting.price) newlisting.price=0;
    // if(!newlisting.price) newlisting.price=0;
    
    // if(!newlisting.image) newlisting.image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
//with out writing this type we are using the npm package  joi for validation

await newlisting.save();
res.redirect("/listings");}

));
//Read And Show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listing/show.ejs",{listing})
}));
//new And Create route
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});
// edit and update route 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
        const listing=await Listing.findById(id); 
        res.render("listing/edit.ejs",{listing});
}));
// update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
 let {id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
   let deletedlisting= await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings");
}));
//Using ejsmate  paCKge for styling


//review handling routes post route
app.use((req, res, next) => {
  next(new ExpressError(409, "Page Not Found"));
});

// All route handlers above this

// // Catch-all route
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });
//To print names of the error we defined an middle ware



// ❗ Error-handling middleware should be last
app.use((err, req, res, next) => {
 let status = err.status || 500;
 let message = err.message || "Something went wrong!";
//   res.status(statusCode).send(message);
res.status(status).render("listing/error.ejs",{message,status});
});


app.listen(8080,()=>{
    console.log("Server Is Listening to port 8080");
});