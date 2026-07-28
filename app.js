let tagData = {};

let selectedTags = [];




// ===============================
// 加载 JSON
// ===============================

fetch("./tags.json")

.then(response => {

    if(!response.ok){

        throw new Error(
            "tags.json加载失败"
        );

    }

    return response.json();

})

.then(data => {


    tagData = data;


    loadCategories();

    loadRandomCategories();

    buildSearchIndex();


})

.catch(error => {


    console.error(error);


});






// ===============================
// 加载一级分类
// ===============================

function loadCategories(){


    const box =
    document.getElementById(
        "categories"
    );


    box.innerHTML = "";


    Object.keys(tagData)
    .forEach(category => {


        let div =
        document.createElement(
            "div"
        );


        div.className =
        "category";


        div.innerText =
        category;



        div.onclick = ()=>{


            showCategory(
                category
            );


        };



        box.appendChild(div);


    });


}








// ===============================
// 显示分类内容
// ===============================

function showCategory(category){


    document.getElementById(
        "category-title"
    )
    .innerText =
    category;



    const box =
    document.getElementById(
        "tags"
    );


    box.innerHTML = "";



    let groups =
    tagData[category];



    Object.keys(groups)
    .forEach(group=>{


        let title =
        document.createElement(
            "h3"
        );


        title.style.width =
        "100%";


        title.innerText =
        group;


        box.appendChild(title);




        groups[group]
        .forEach(item=>{


            let english =
            Object.keys(item)[0];


            let chinese =
            item[english];



            createTagButton(
                english,
                chinese,
                box
            );


        });


    });



    refreshButtons();


}









// ===============================
// 创建TAG按钮
// ===============================

function createTagButton(
    english,
    chinese,
    parent
){


    let btn =
    document.createElement(
        "div"
    );


    btn.className =
    "tag";


    btn.innerText =
    chinese;



    btn.dataset.tag =
    english;



    btn.onclick = ()=>{


        toggleTag(
            english,
            chinese,
            btn
        );


    };



    parent.appendChild(btn);


}








// ===============================
// 选择 / 取消 TAG
// ===============================

function toggleTag(
    tag,
    chinese,
    element
){


    let index =
    selectedTags.findIndex(
        x =>
        x.tag === tag
    );



    if(index !== -1){


        selectedTags.splice(
            index,
            1
        );


    }

    else{


        selectedTags.push({

            tag: tag,

            chinese: chinese

        });


    }



    updateSelected();


    refreshButtons();


}









// ===============================
// 更新右侧
// ===============================

function updateSelected(){


    const box =
    document.getElementById(
        "selected-tags"
    );


    box.innerHTML = "";



    selectedTags.forEach(item=>{


        let div =
        document.createElement(
            "div"
        );


        div.className =
        "selected-item";



        div.innerText =
        item.chinese;



        div.onclick = ()=>{


            let index =
            selectedTags.findIndex(
                x =>
                x.tag === item.tag
            );


            if(index !== -1){

                selectedTags.splice(
                    index,
                    1
                );

            }


            updateSelected();

            refreshButtons();


        };



        box.appendChild(div);



    });



    document.getElementById(
        "count"
    )
    .innerText =
    selectedTags.length;



}









// ===============================
// 刷新按钮状态
// ===============================

function refreshButtons(){


    document
    .querySelectorAll(
        ".tag"
    )
    .forEach(btn=>{


        let exists =
        selectedTags.some(
            x =>
            x.tag ===
            btn.dataset.tag
        );



        if(exists){


            btn.classList.add(
                "selected"
            );


        }
        else{


            btn.classList.remove(
                "selected"
            );


        }



    });



}








// ===============================
// 复制 Prompt
// ===============================

document
.getElementById(
    "copy-btn"
)
.onclick = ()=>{


    let text =
    selectedTags
    .map(item=>{


        return item.tag
        .replaceAll(
            "_",
            " "
        );


    })
    .join(
        ", "
    );



    navigator.clipboard.writeText(
        text
    );


};








// ===============================
// 清空
// ===============================

document
.getElementById(
    "clear-btn"
)
.onclick = ()=>{


    selectedTags = [];


    updateSelected();


    refreshButtons();


};









// ===============================
// 随机分类选择
// ===============================

function loadRandomCategories(){


    const box =
    document.getElementById(
        "random-categories"
    );


    box.innerHTML = "";



    Object.keys(tagData)
    .forEach(category=>{


        let label =
        document.createElement(
            "label"
        );


        label.className =
        "random-item";



        let input =
        document.createElement(
            "input"
        );


        input.type =
        "checkbox";


        input.value =
        category;



        label.appendChild(
            input
        );


        label.appendChild(
            document.createTextNode(
                category
            )
        );



        box.appendChild(label);



    });


}








// ===============================
// 每个分类随机一个
// ===============================

document
.getElementById(
    "random-btn"
)
.onclick = ()=>{


    let checked =
    [
        ...
        document
        .querySelectorAll(
            "#random-categories input:checked"
        )
    ];



    if(
        checked.length === 0
    ){

        alert(
            "请选择随机分类"
        );

        return;

    }




    checked.forEach(box=>{


        let category =
        box.value;



        let groups =
        tagData[category];



        let allTags = [];



        Object.values(groups)
        .forEach(group=>{


            group.forEach(item=>{


                let tag =
                Object.keys(item)[0];


                let chinese =
                item[tag];



                allTags.push({

                    tag:tag,

                    chinese:chinese

                });


            });


        });




        if(allTags.length > 0){


            let result =
            allTags[
                Math.floor(
                    Math.random()
                    *
                    allTags.length
                )
            ];



            let exists =
            selectedTags.some(
                x =>
                x.tag === result.tag
            );



            if(!exists){


                selectedTags.push(
                    result
                );


            }


        }



    });



    updateSelected();

    refreshButtons();



};









// ===============================
// 搜索索引
// ===============================

let searchIndex = [];



function buildSearchIndex(){


    searchIndex = [];



    Object.keys(tagData)
    .forEach(category=>{


        Object.values(
            tagData[category]
        )
        .forEach(group=>{


            group.forEach(item=>{


                let tag =
                Object.keys(item)[0];


                let chinese =
                item[tag];



                searchIndex.push({

                    tag:tag,

                    chinese:chinese,

                    category:category

                });


            });


        });


    });



}








// ===============================
// 中文搜索
// ===============================

document
.getElementById(
    "search-input"
)
.addEventListener(
    "input",
    function(){


        let keyword =
        this.value.trim();



        let box =
        document.getElementById(
            "search-results"
        );


        box.innerHTML = "";



        if(!keyword){

            return;

        }



        let results =
        searchIndex.filter(
            item =>
            item.chinese
            .includes(keyword)
        )
        .slice(
            0,
            50
        );



        results.forEach(item=>{


            let div =
            document.createElement(
                "div"
            );


            div.className =
            "search-item";



            div.innerText =
            item.chinese;



            div.onclick = ()=>{


                let exists =
                selectedTags.some(
                    x =>
                    x.tag === item.tag
                );



                if(!exists){


                    selectedTags.push({

                        tag:item.tag,

                        chinese:item.chinese

                    });



                    updateSelected();

                    refreshButtons();


                }


            };



            box.appendChild(div);



        });



    }
);
