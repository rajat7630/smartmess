var mongo= require("mongoose");
mongo.connect("mongodb://localhost/mess");
var studentschema= new mongo.Schema({
  name:{
    type:String
  },
  number:{
    type:Number
  },
  phone:{
    type:Number
  },
  milk:{
    type:Number,
    default: 0
  },
  icecream:{
    type:Number,
    default:0
  },
  sweet:{
    type:Number,
    default:0
  },
  rebate:{
    type:Number,
    default:0
  },
  total:{
    type:Number,
    default:0
  }
});
var student= mongo.model("student", studentschema);
module.exports=student;
