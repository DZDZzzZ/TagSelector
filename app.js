let data={};


let selected=[];


let currentPath=[];


let searchIndex=[];





fetch("./tags.json")

.then(r=>r.json())

.then(json=>{


data=json;


buildSearch();


loadRoot();


loadRandom();



});







// =====================
// 判断是否tag集合
// =====================


function isTagObject(obj){


return Object.values(obj)
.every(
v=>typeof v==="string"
);


}







// =====================
// 左侧一级
// =====================


function loadRoot(){


let box=document
.getElementById(
"categories"
);


box.innerHTML="";


Object.keys(data)
.forEach(k=>{


let div=document.createElement(
"div"
);


div.className="item folder";


div.innerText=k;


div.onclick=()=>{


showChildren(
data[k]
);


};


box.appendChild(div);


});


}








// =====================
// 显示下一层
// =====================


function showChildren(obj){


let sub=document
.getElementById(
"subcategories"
);


let tags=document
.getElementById(
"tags"
);



sub.innerHTML="";

tags.innerHTML="";





if(isTagObject(obj)){


showTags(obj);


return;


}





Object.entries(obj)
.forEach(
([key,value])=>{


let div=document.createElement(
"div"
);


div.className="item";



div.innerText=key;



div.onclick=()=>{


showChildren(value);


};



sub.appendChild(div);



});


}








// =====================
// 显示tag
// =====================


function showTags(obj){


let box=document
.getElementById(
"tags"
);


box.innerHTML="";



Object.entries(obj)
.forEach(
([tag,chinese])=>{


createTag(
tag,
chinese,
box
);


});


}






function createTag(
tag,
chinese,
box
){


let div=document.createElement(
"div"
);


div.className="item tag";


div.innerText=chinese;


div.onclick=()=>{


addTag(
tag,
chinese
);


};



box.appendChild(div);


}









// =====================
// 添加
// =====================


function addTag(tag,chinese){


if(
selected.some(
x=>x.tag===tag
)
)
return;



selected.push({

tag,

chinese

});



refreshSelected();


}







function refreshSelected(){


let box=document
.getElementById(
"selected-tags"
);


box.innerHTML="";



selected.forEach(x=>{


let div=document.createElement(
"div"
);


div.className=
"selected-item";


div.innerText=x.chinese;



div.onclick=()=>{


selected=
selected.filter(
a=>a.tag!==x.tag
);


refreshSelected();


};



box.appendChild(div);


});



document
.getElementById(
"count"
)
.innerText=
selected.length;


}









// =====================
// 搜索
// =====================


function buildSearch(){


searchIndex=[];


scan(
data
);


}



function scan(obj){


Object.entries(obj)
.forEach(
([k,v])=>{


if(
typeof v==="string"
){


searchIndex.push({

tag:k,

chinese:v

});


}

else{


scan(v);


}


});


}




document
.getElementById(
"search-input"
)
.oninput=function(){


let box=document
.getElementById(
"search-results"
);


box.innerHTML="";


let key=this.value;



if(!key)
return;



searchIndex
.filter(
x=>x.chinese.includes(key)
)
.slice(0,30)
.forEach(x=>{


let div=document.createElement(
"div"
);


div.className="item";


div.innerText=x.chinese;



div.onclick=()=>{


addTag(
x.tag,
x.chinese
);


};



box.appendChild(div);



});


};








// =====================
// 复制
// =====================


document
.getElementById(
"copy-btn"
)
.onclick=()=>{


let text=
selected
.map(
x=>x.tag.replaceAll(
"_",
" "
)
)
.join(", ");



navigator.clipboard.writeText(
text
);


};









// =====================
// 清空
// =====================


document
.getElementById(
"clear-btn"
)
.onclick=()=>{


selected=[];


refreshSelected();


};









// =====================
// 随机
// =====================


function loadRandom(){


let box=document
.getElementById(
"random-categories"
);


Object.keys(data)
.forEach(k=>{


let label=document.createElement(
"label"
);



label.innerHTML=
`
<input type="checkbox"
value="${k}">
${k}
<br>
`;



box.appendChild(label);


});


}



function collectTags(obj,arr){


if(isTagObject(obj)){


Object.entries(obj)
.forEach(
([tag,chinese])=>{


arr.push({

tag,

chinese

});


});


}

else{


Object.values(obj)
.forEach(
v=>
collectTags(v,arr)
);


}


}




document
.getElementById(
"random-btn"
)
.onclick=()=>{


let checked=
[
...document.querySelectorAll(
"#random-categories input:checked"
)
];



checked.forEach(c=>{


let arr=[];


collectTags(
data[c.value],
arr
);



if(arr.length){


let r=
arr[
Math.floor(
Math.random()*arr.length
)
];



addTag(
r.tag,
r.chinese
);


}


});


};
