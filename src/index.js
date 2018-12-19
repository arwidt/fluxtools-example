
import view from "./view.js";
import store from "./store.js";
import gui from "./gui.js";

import "./index.scss";

String.prototype.toDOM = function(){
    var d=document
        ,i
        ,a=d.createElement("div")
        ,b=d.createDocumentFragment();
    a.innerHTML=this;
    while(i=a.firstChild)b.appendChild(i);
    return b;
};

// When document is loaded we init all part
// of the example.
document.addEventListener("DOMContentLoaded", function() {
    view.init();
    gui.init();

    // Init store last
    store.init();
});