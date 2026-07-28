let tagData = {};

let selectedTags = [];

let searchIndex = [];

let categoryTags = {};





// ==========================
// 加载 JSON
// ==========================

fetch("./tags.json")

.then(r=>r.json())

.then(data=>{

    tagData=data;


    buildCategoryIndex();

    buildSearchIndex();

    loadCategories();

    loadRandomCategories();


})

.catch(e=>{

    console.error(e);

});








// ==========================
// 递归解析所有tag
// ==========================

function scanTags(
    obj,
    path=[]
){

    let result=[];


    Object.entries(obj)
    .forEach(([key,value])=>{


        if(
            typeof value === "string"
        ){

            result.push({

                tag:key,

                chinese:value,

                path:path

            });


        }


        else if(
            typeof value === "object"
        ){


            result.push(
                ...scanTags(
                    value,
                    [
                        ...path,
                        key
                    ]
                )
            );


        }



    });


    return result;

}








// ==========================
// 建立分类索引
// ==========================

function buildCategoryIndex(){


    categoryTags={};



    Object.keys(tagData)
    .forEach(category=>{


        categoryTags[category] =
        scanTags(
            tagData[category],
            [
                category
            ]
        );


    });


}








// ==========================
// 左侧分类
// ==========================

function loadCategories(){


    let box =
    document.getElementById(
        "categories"
    );


    box.innerHTML="";


    Object.keys(categoryTags)
    .forEach(category=>{


        let div =
        document.createElement(
            "div"
        );


        div.className="category";


        div.innerText=
        category;


        div.onclick=()=>{


            showCategory(category);


        };


        box.appendChild(div);


    });


}









// ==========================
// 显示分类tag
// ==========================

function showCategory(category){


    document
    .getElementById(
        "category-title"
    )
    .innerText=
    category;



    let box =
    document.getElementById(
        "tags"
    );


    box.innerHTML="";



    categoryTags[category]
    .forEach(item=>{


        createTagButton(
            item.tag,
            item.chinese,
            box
        );


    });


    refreshButtons();


}









// ==========================
// 创建tag按钮
// ==========================

function createTagButton(
    tag,
    chinese,
    parent
){


    let div =
    document.createElement(
        "div"
    );


    div.className="tag";


    div.innerText=
    chinese;


    div.dataset.tag=
    tag;


    div.onclick=()=>{


        toggleTag(
            tag,
            chinese
        );


    };


    parent.appendChild(div);


}









// ==========================
// 添加/删除tag
// ==========================

function toggleTag(
    tag,
    chinese
){


    let index =
    selectedTags.findIndex(
        x=>x.tag===tag
    );


    if(index>=0){


        selectedTags.splice(
            index,
            1
        );


    }
    else{


        selectedTags.push({

            tag:tag,

            chinese:chinese

        });


    }


    updateSelected();

    refreshButtons();


}









// ==========================
// 右侧列表
// ==========================

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

            refreshButtons();


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









// ==========================
// 更新按钮状态
// ==========================

function refreshButtons(){


    document
    .querySelectorAll(
        ".tag"
    )
    .forEach(btn=>{


        let exist =
        selectedTags.some(
            x=>
            x.tag===
            btn.dataset.tag
        );


        btn.classList.toggle(
            "selected",
            exist
        );


    });


}









// ==========================
// 搜索
// ==========================

function buildSearchIndex(){


    searchIndex =
    scanTags(tagData);


}



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


                toggleTag(
                    item.tag,
                    item.chinese
                );


            };


            box.appendChild(div);



        });



    }
);









// ==========================
// 随机分类
// ==========================

function loadRandomCategories(){


    let box =
    document.getElementById(
        "random-categories"
    );


    box.innerHTML="";



    Object.keys(categoryTags)
    .forEach(category=>{


        let label =
        document.createElement(
            "label"
        );


        label.className=
        "random-item";



        label.innerHTML=
        `
        <input type="checkbox"
        value="${category}">
        ${category}
        `;


        box.appendChild(label);


    });


}







// 每个大类随机一个

document
.getElementById(
    "random-btn"
)
.onclick=()=>{


    let checked =
    [
        ...document
        .querySelectorAll(
            "#random-categories input:checked"
        )
    ];



    checked.forEach(box=>{


        let list =
        categoryTags[
            box.value
        ];



        if(!list.length)
            return;



        let item =
        list[
            Math.floor(
                Math.random()
                *
                list.length
            )
        ];



        if(
            !selectedTags.some(
                x=>
                x.tag===item.tag
            )
        ){


            selectedTags.push({

                tag:item.tag,

                chinese:item.chinese

            });


        }


    });



    updateSelected();


};









// ==========================
// 复制
// ==========================

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








// ==========================
// 清空
// ==========================

document
.getElementById(
    "clear-btn"
)
.onclick=()=>{


    selectedTags=[];


    updateSelected();

    refreshButtons();


};
