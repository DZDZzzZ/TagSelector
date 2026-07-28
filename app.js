let tagData={};

let selectedTags=[];

let searchIndex=[];







// =====================
// 加载JSON
// =====================


fetch("./tags.json")

.then(r=>r.json())

.then(data=>{


    tagData=data;


    buildSearchIndex();


    loadTree();



    loadRandomCategories();



});









// =====================
// 判断是否tag节点
// =====================

function isTagNode(obj){


    if(
        typeof obj!=="object"
        ||
        Array.isArray(obj)
    ){

        return false;

    }



    return Object.values(obj)
    .every(
        v =>
        typeof v==="string"
    );

}










// =====================
// 建立搜索索引
// =====================


function buildSearchIndex(){


    searchIndex=[];


    recursiveSearch(
        tagData,
        []
    );


}



function recursiveSearch(
    obj,
    path
){


    Object.entries(obj)
    .forEach(([key,value])=>{


        if(
            typeof value==="string"
        ){


            searchIndex.push({

                tag:key,

                chinese:value,

                path:path

            });


        }


        else{


            recursiveSearch(

                value,

                [
                    ...path,
                    key
                ]

            );


        }


    });



}









// =====================
// 加载文件夹树
// =====================

function loadTree(){


    let box =
    document.getElementById(
        "categories"
    );


    box.innerHTML="";



    createTreeNode(

        tagData,

        box

    );


}






function createTreeNode(
    obj,
    parent
){


    Object.entries(obj)
    .forEach(
    ([key,value])=>{


        let div =
        document.createElement(
            "div"
        );



        div.className=
        "tree-item";



        if(
            typeof value==="string"
        ){


            div.className=
            "tree-tag";


            div.innerText=
            value;



            div.onclick=()=>{


                addTag(

                    key,

                    value

                );


            };



            parent.appendChild(div);



        }

        else{


            let folder =
            document.createElement(
                "div"
            );


            folder.className=
            "tree-folder";


            folder.innerText=
            "📁 "+key;



            let children =
            document.createElement(
                "div"
            );


            children.className=
            "tree-children";


            children.style.display=
            "none";



            folder.onclick=()=>{


                children.style.display =
                children.style.display==="none"
                ?
                "block"
                :
                "none";


            };



            parent.appendChild(folder);


            parent.appendChild(children);



            createTreeNode(

                value,

                children

            );


        }



    });



}









// =====================
// 添加tag
// =====================


function addTag(
    tag,
    chinese
){


    if(
        selectedTags.some(
            x=>x.tag===tag
        )
    ){

        return;

    }



    selectedTags.push({

        tag:tag,

        chinese:chinese

    });



    updateSelected();


}









// =====================
// 右侧显示
// =====================

function updateSelected(){


    let box =
    document.getElementById(
        "selected-tags"
    );


    box.innerHTML="";



    selectedTags.forEach(item=>{


        let div =
        document.createElement(
            "div"
        );


        div.className=
        "selected-item";



        div.innerText=
        item.chinese;



        div.onclick=()=>{


            selectedTags =
            selectedTags.filter(
                x=>
                x.tag!==item.tag
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
    selectedTags.length;



}









// =====================
// 搜索
// =====================


document
.getElementById(
"search-input"
)
.addEventListener(
"input",
e=>{


    let key =
    e.target.value.trim();


    let box =
    document.getElementById(
    "search-results"
    );


    box.innerHTML="";



    if(!key)
        return;



    searchIndex

    .filter(
        x=>
        x.chinese.includes(key)
    )

    .slice(0,50)

    .forEach(item=>{


        let div =
        document.createElement(
        "div"
        );


        div.className=
        "search-item";


        div.innerText=
        item.chinese;



        div.onclick=()=>{


            addTag(

                item.tag,

                item.chinese

            );


        };



        box.appendChild(div);



    });



});









// =====================
// 复制
// =====================


document
.getElementById(
"copy-btn"
)
.onclick=()=>{


    let text =
    selectedTags

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








// =====================
// 清空
// =====================


document
.getElementById(
"clear-btn"
)
.onclick=()=>{


    selectedTags=[];

    updateSelected();


};









// =====================
// 随机
// =====================

function loadRandomCategories(){


    let box =
    document.getElementById(
    "random-categories"
    );


    box.innerHTML="";



    Object.keys(tagData)
    .forEach(key=>{


        let label =
        document.createElement(
        "label"
        );


        label.className=
        "random-item";



        label.innerHTML=
        `
        <input type="checkbox"
        value="${key}">
        ${key}
        `;



        box.appendChild(label);


    });


}




document
.getElementById(
"random-btn"
)
.onclick=()=>{


    let checked =
    [
    ...document.querySelectorAll(
    "#random-categories input:checked"
    )
    ];



    checked.forEach(c=>{


        let list=[];



        recursiveCollect(

            tagData[c.value],

            list

        );



        if(list.length){


            let item =
            list[
            Math.floor(
            Math.random()*list.length
            )
            ];



            addTag(

                item.tag,

                item.chinese

            );


        }



    });



};






function recursiveCollect(
obj,
arr
){


    Object.entries(obj)
    .forEach(([k,v])=>{


        if(
            typeof v==="string"
        ){


            arr.push({

                tag:k,

                chinese:v

            });


        }

        else{


            recursiveCollect(
                v,
                arr
            );


        }


    });


}
