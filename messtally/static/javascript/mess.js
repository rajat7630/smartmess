$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});
"use strict";
function addrow(){
  var table=document.getelemntbyid("ind");
  var row = table.insertRow(0);
  var cell1 = row.insertcell(0);
  var cell2 = row.insertcell(1);
  cell1.innerHTML = "New";
  cell2.innerHTML = "new";
}
