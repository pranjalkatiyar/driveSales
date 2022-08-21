const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const data=require('./model/data');
const dateTime=require('date-and-time');
const now=new Date();
const ejs=require('ejs');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine",'ejs');



// connecting to database
mongoose.connect(`mongodb+srv://admin-Pranjal:${process.env.API_KEY}@cluster0.hegup.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser: true,
useUnifiedTopology: true}).then(()=>{
    console.log('connected to database');
}).catch(err=>{
    console.log(err);
});
 

app.get('/put',async (req,res)=>{
res.render('edit');
});

// post data to update the data
app.post('/put/:id',async (req,res)=>{
        var id={_id:req.params.id};
        const statusValue=data.findById(id);
        await data.findByIdAndUpdate(id, 
            {"endDateTime":dateTime.format(now,'YYYY-MM-DD HH:mm:ss'),"status":true})
        .then(()=>{
            console.log('updated');
            res.redirect('/');
        }
        ).catch(err=>{
            res.send(err);
        }
        );
    });
    
    // Post to delete the Task
app.post('/delete/:id',async (req,res)=>{
    var id=req.params.id;
    data.findByIdAndDelete(id)
    .then(()=>{
        console.log("delted");
        res.redirect("/");
    }
    ).catch(err=>{
        res.send(err);
    }
    );
});


// Get the add item page
app.get('/addItem',async (req,res)=>{
      res.render('addItem');
});

// Post to add the Task
app.post('/addItem',async (req,res)=>{
    const check=new data({
        id:new mongoose.Types.ObjectId().toHexString() ,
        title:req.body.title,
        description:req.body.description,
        startDateTime:dateTime.format(now,'YYYY-MM-DD HH:mm:ss'),
        endDateTime:dateTime.format(now,'YYYY-MM-DD HH:mm:ss'),
        priority:req.body.priority,
        status:req.body.status
    });
    console.log(dateTime.format(now,'YYYY-MM-DD HH:mm:ss'));
    try{
        const saved=await check.save();
        console.log("data saved");
        res.redirect('/');
    }catch(err){
        res.send(err);
    
    }});

    // post method to sort the data by priority and date
    app.post('/sort',async (req,res)=>{
        var tableRow=req.body.fieldValue;
        var sort=req.body.sort;
        // var filters=req.query;

        if(sort=='asc'){
            const sortAsc=await data.find().sort({[tableRow]:1});
            res.render('index',{data:sortAsc});
        }
        else if(sort=='desc'){
            const sortDesc=await data.find().sort({[tableRow]:-1});
            res.render('index',{data:sortDesc});
        }
        else{
            const sort=await data.find();
            res.render('index',{data:sort});
        }
    });

    // post method to search by the title and description

app.post("/search",async (req,res)=>{
    var search=req.body.search;
    const searchData=await data.find({$or:[{title:search},{description:search}]});
    if(searchData.length>0){
    res.render('index',{data:searchData});
}
else{
    res.redirect('/');
}
});


// get method to homepage

app.get('/',async (req,res)=>{  
    try{
        const value=await data.find();
        res.render('index',{data:value});
    }catch(err){
        res.send(err);
    }
});

 

app.listen('3000',()=>{
    console.log('Server started on port 3000');
}).on('error',(err)=>{
    console.log(err);
});

 