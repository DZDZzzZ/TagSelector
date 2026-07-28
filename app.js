let tagData = {};

let selectedTags = [];


// ===============================
// 读取 JSON
// ===============================

fetch("./tags.json")
.then(response => {

    if(!response.ok){

        throw new Error(
            "tags.json读取失败"
        );

    }

    return response.json();

})
.then(data => {


    tagData = data;

    loadCategories();


})
.catch(error=>{


    console.error(
        error
    );


});




// ===============================
// 加载一级分类
// ===============================

function loadCategories(){


    const box =
    document.getElementById(
        "categories"
    );


    box.innerHTML="";


    Object.keys(tagData)
    .forEach(category=>{


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



        box.appendChild(
            div
        );


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



    const tagsBox =
    document.getElementById(
        "tags"
    );


    tagsBox.innerHTML="";



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


        tagsBox.appendChild(
            title
        );




        groups[group]
        .forEach(item=>{


            let english =
            Object.keys(item)[0];


            let chinese =
            item[english];



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



            tagsBox.appendChild(
                btn
            );



        });


    });



    // 切换分类后恢复已选择状态

    refreshButtons();


}







// ===============================
// 选择 / 取消 tag
// ===============================

function toggleTag(
    tag,
    chinese,
    element
){


    let index =
    selectedTags.findIndex(
        item =>
        item.tag === tag
    );



    if(index !== -1){


        selectedTags.splice(
            index,
            1
        );


        element.classList.remove(
            "selected"
        );


    }
    else{


        selectedTags.push({

            tag: tag,

            chinese: chinese

        });



        element.classList.add(
            "selected"
        );


    }



    updateSelected();



}







// ===============================
// 更新右侧列表
// ===============================

function updateSelected(){


    const box =
    document.getElementById(
        "selected-tags"
    );


    box.innerHTML="";



    selectedTags.forEach(item=>{


        let div =
        document.createElement(
            "div"
        );



        div.className =
        "selected-item";



        // 显示中文

        div.innerText =
        item.chinese;



        // 点击删除

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



        box.appendChild(
            div
        );



    });



    document.getElementById(
        "count"
    )
    .innerText =
    selectedTags.length;



}







// ===============================
// 更新中间按钮状态
// ===============================

function refreshButtons(){


    document
    .querySelectorAll(
        ".tag"
    )
    .forEach(btn=>{


        let exists =
        selectedTags.some(
            item =>
            item.tag ===
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


    let prompt =
    selectedTags
    .map(item => {


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
        prompt
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
