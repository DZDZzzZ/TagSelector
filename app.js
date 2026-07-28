let data={};


let selected=[];


let searchIndex=[];





fetch("./tags.json")

.then(r=>r.json())

.then(json=>{


data=json;


buildSearchIndex();


loadCategories();


loadRandom();


});









// =========================
// 判断是否tag层
// =========================

function isTagLayer(obj){


return Object.values(obj)
.every(
v=>typeof v==="string"
);


}









// =========================
// 左侧大分类
// =========================


function loadCategories(){


let box=
document.getElementById(
"categories"
);


Object.keys(data)
.forEach(key=>{


let div=
document.createElement(
"div"
);


div.className=
"item folder";


div.innerText=key;


div.onclick=()=>{


document
.getElementById(
"title"
)
.innerText=key;


renderTree(
data[key],
document.getElementById(
"content"
)
);


};


box.appendChild(div);


});


}









// =========================
// 中间递归展开
// =========================


function renderTree(
obj,
parent
){


parent.innerHTML="";



createTree(
obj,
parent
);


}






function createTree(
obj,
parent
){


Object.entries(obj)
.forEach(
([key,value])=>{


if(
typeof value==="string"
){


let div=
document.createElement(
"div"
);


div.className=
"item tag";


div.innerText=value;



div.onclick=()=>{


addTag(
key,
value
);


};



parent.appendChild(div);



}

else{


let folder=
document.createElement(
"div"
);


folder.className=
"item folder";


folder.innerText=
"▼ "+key;



parent.appendChild(folder);



let child=
document.createElement(
"div"
);


child.className=
"children";



parent.appendChild(child);



createTree(
value,
child
);



}



});


}









// =========================
// 添加选择
// =========================


function addTag(
tag,
chinese
){


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



updateSelected();


}







function updateSelected(){


let box=
document.getElementById(
"selected"
);


box.innerHTML="";



selected.forEach(x=>{


let div=
document.createElement(
"div"
);


div.className=
"selected-item";


div.innerText=
x.chinese;



div.onclick=()=>{


selected=
selected.filter(
a=>a.tag!==x.tag
);


updateSelected();


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









// =========================
// 搜索
// =========================


function buildSearchIndex(){


scan(
data,
[]
);


}



function scan(
obj,
path
){


Object.entries(obj)
.forEach(
([key,value])=>{


if(
typeof value==="string"
){


searchIndex.push({

tag:key,

chinese:value,

path:path.join(">")

});


}

else{


scan(
value,
[
...path,
key
]
);


}



});


}




document
.getElementById(
"search"
)
.oninput=function(){


let box=
document.getElementById(
"search-result"
);


box.innerHTML="";



let value=this.value.trim();


if(!value)
return;



searchIndex
.filter(
x=>x.chinese.includes(value)
)
.slice(0,30)
.forEach(x=>{


let div=
document.createElement(
"div"
);


div.className=
"search-item";


div.innerText=
x.chinese;



div.onclick=()=>{


addTag(
x.tag,
x.chinese
);


};



box.appendChild(div);



});


};









// =========================
// 复制
// =========================


document
.getElementById(
"copy"
)
.onclick=()=>{


let text=
selected
.map(
x=>
x.tag.replaceAll(
"_",
" "
)
)
.join(", ");



navigator.clipboard.writeText(
text
);


};








// =========================
// 清空
// =========================


document
.getElementById(
"clear"
)
.onclick=()=>{


selected=[];


updateSelected();


};









// =========================
// 随机
// =========================


function loadRandom(){


let box=
document.getElementById(
"random-box"
);


Object.keys(data)
.forEach(k=>{


box.innerHTML+=`

<label>

<input
type="checkbox"
value="${k}"
>

${k}

</label>

<br>

`;


});


}




function collectTags(
obj,
arr
){


if(
isTagLayer(obj)
){


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
"#random-box input:checked"
)
];



checked.forEach(c=>{


let arr=[];



collectTags(
data[c.value],
arr
);



if(arr.length){


let item=
arr[
Math.floor(
Math.random()*arr.length
)
];



addTag(
item.tag,
item.chinese
);


}



});


};
