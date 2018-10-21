var mongo= require("mongoose");
mongo.connect("mongodb://localhost/mess")
var priceschema=new mongo.Schema({
  milk:{
    type:Number
  },
  icecream:{
    type:Number
  },
  sweet:{
    type:Number
  },
  electricity:{
    type:Number
  },
  rent:{
    type:Number
  },
  miscellaneous:{
    type:Number
  }
});
var prices= mongo.model("prices",priceschema);
module.exports= prices;
