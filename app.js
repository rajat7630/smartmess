var express=require("express");
var session= require("express-session");
var parser=require("body-parser");
var mongo=require("mongoose");
var app=express();
var price= require("./models/prices.js");
var twilio=require("twilio");
var date=require("date-and-time");
var students= require("./models/students.js");
mongo.connect("mongodb://localhost/mess");
const accountSid = 'ACd2d26942f60cdaaea35063647cb207d8';
const authToken = '31b9daea61934ab84c5ebd9e8a2b6401';
const client = twilio(accountSid, authToken);
app.set("views",( __dirname + "/views"));
app.set("view engine", "ejs");
//middlewares

app.use(parser.urlencoded({extended:true}));
app.use(express.static((__dirname + '/static')));
app.use(session({
  secret:"Dogs are cute.",
  resave:true,
  saveUninitialized:false,
}));
var sessionchecker= function(req, res, next){
  if(!req.session.user)
  {
    res.redirect("/");
  }
  else {
    next();
  }
};
var a1=0,a2=0,a3=0,a4=0,a5=0,a6=0;

//routes
app.get("/", function(req, res){
  res.render("login");
});
app.get("/home", sessionchecker, function(req,res){
  res.render("home");
});
app.post("/login", function(req, res){
  if(!req.body.user || !req.body.password)
  {
    res.redirect("/");
  }
  else {
    if(req.body.user==='admin')
    {
      if(req.body.password==='123456')
      {
        req.session.user=true;
        res.redirect("/home");
      }
      else{
        res.redirect("/");
      }
    }
    else{
      res.redirect("/");
    }
}
});

app.get("/student", sessionchecker, function(req, res){
  res.render("student");
})
app.post("/student",function(req, res){
  var new_student= new students({
    name:req.body.name,
    parseInt:req.body.parseInt,
    phone:req.body.phone
  });
  console.log(new_student);
    new_student.save(function(err){
      if(err) throw err;
      res.redirect("/student");
    })
  })
app.get("/expenses",sessionchecker, function(req, res){
  res.render("expenses");
});
app.get("/current",sessionchecker, function(req, res){
  res.render("current");
});
app.post("/expenses", function(req, res){
  a1= req.body.milk;
  a2=req.body.icecream;
  a3=req.body.sweet;
  a4=req.body.electricity;
  a5=req.body.rent;
  a6=req.body.miscellaneous;
  console.log(a6);
  res.redirect("/current");
});

app.post("/current", function(req, res){
  students.findOne({parseInt:req.body.search}, function(err, student){
    if(err) throw err;
    console.log(student._id);
    res.render("profile",{student:student});
  })
})
app.post("/current/:id", function(req, res){
  // var format= Date.now();
  // console.log(req.body.extra1,req.body.extra2,req.body.extra3);
  // days.findOne({date:format},function(err, founddate){
  //   if(err) throw err;
  //   if(founddate)
  //   {
      students.findOne({_id:req.params.id}, function(err, student){
        if(err) throw err;
        var eatable="";
        if(req.body.extra2)
        {
          var s=student.milk;
          eatable=eatable + "Milk ";
          students.updateOne({_id:req.params.id},{
            milk:s+1
          },function(err){
          })
        }
        if(req.body.extra1)
        {
          eatable=eatable + "Icecream ";
          var s=student.icecream;
          students.updateOne({_id:req.params.id},{
            icecream:s+1
          },function(err){
          });
        }
        if(req.body.extra3)
        {
          eatable=eatable + "Sweet ";
          var s=student.sweet;
          students.updateOne({_id:req.params.id},{
            sweet:s+1
          },function(err){
          })
        }
        console.log(student);
        client.messages.create({
       body: 'Extra items taken: '+ eatable,
       from: '(254) 277-1644',
       to: '+91'+student.phone.toString()
     }).then(message => console.log(message.sid)).done();
      })


      res.redirect("/current");
    })
    // else{
    //   var new_date = new days({
    //     date:format
    //   });
    //   new_date.save(function(err){
    //     if(err) throw err;
    //     students.findOne({_id:req.params.id}, function(err, student){
    //       if(err) throw err;
    //       if(req.body.extra2)
    //       {
    //         student.milk=student.milk+1;
    //       }
    //       if(req.body.extra1)
    //       {
    //         student.icecream=student.icecream+1;
    //       }
    //       if(req.body.extra3)
    //       {
    //         student.sweet=student.sweet+1;
    //       }
    //     })
    //   });
    //   res.redirect("/current");
//     }
//   })
// })
app.post("/rebate/:id", function(req, res){
  students.findOne({_id:req.params.id}, function(err, student){
    if(err) throw err;
    var s=student.rebate;
    students.updateOne({_id:req.params.id},{
      rebate:s+1
    },function(err){

    })
    console.log(student);
    client.messages.create({
   body: 'Rebate has been filed ',
   from: '(254) 277-1644',
   to: '+91'+student.phone.toString()
 }).then(message => console.log(message.sid)).done();
  })
  res.redirect("/current");
})
app.get("/logout", function(req, res){
  req.session.user=false;
  res.redirect("/");
})
app.get("/info", sessionchecker, function(req, res){
  students.find({},function(err, student){
    res.render("info",{student:student});
  });
})
app.post("/info",function(req, res){
  students.find({}, function(err, student){
    student.forEach(function(a){
      var x=parseInt(parseInt(a6)+ parseInt(a5)+ parseInt(a4) + parseInt(a1)*parseInt(a.milk) + parseInt(a2)*parseInt(a.icecream)+parseInt(a3)*parseInt(a.sweet));
      console.log(x);
      students.updateOne({_id:a._id},{
        total:x
    }, function(err){

    });
    })
  })
  res.redirect("/info");
})

app.listen(8000, function(){
  console.log("app started");
});
module.exports=app;
