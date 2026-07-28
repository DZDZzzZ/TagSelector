let tagData = {};

let selectedTags = [];



// 加载 JSON

fetch("./tags.json")

.then(response => response.json())

.then(data => {


    tagData = data;

    loadCategories();


})

.catch(error=>{

    console.error(
        "tags.json读取失败:",
        error
    );

});





// 加载一级分类

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


        div.className="category";

        div.innerText=category;


        div.onclick=()=>{

            showCategory(category);

        };


        box.appendChild(div);



    });



}





// 显示分类内容

function showCategory(category){



    document.getElementById(
        "category-title"
    )
    .innerText=category;



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


        title.style.width="100%";

        title.innerText=group;


        tagsBox.appendChild(title);




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


            btn.className="tag";


            btn.innerText=chinese;



            btn.dataset.tag=
            english;



            btn.onclick=()=>{


                toggleTag(
                    english,
                    btn
                );


            };



            tagsBox.appendChild(btn);



        });


    });


}





// 添加/删除tag

function toggleTag(tag, element){



    let index =
    selectedTags.indexOf(tag);



    if(index!==-1){


        selectedTags.splice(
            index,
            1
        );


        element.classList.remove(
            "selected"
        );


    }

    else{


        selectedTags.push(tag);


        element.classList.add(
            "selected"
        );


    }



    updateSelected();


}





// 更新右侧

function updateSelected(){



    const box =
    document.getElementById(
        "selected-tags"
    );



    box.innerHTML="";



    selectedTags.forEach(tag=>{


        let div =
        document.createElement(
            "div"
        );


        div.className=
        "selected-item";


        div.innerText=tag;



        div.onclick=()=>{


            selectedTags.splice(
                selectedTags.indexOf(tag),
                1
            );


            updateSelected();


            refreshButtons();


        };



        box.appendChild(div);



    });



    document.getElementById(
        "count"
    )
    .innerText=
    selectedTags.length;


}




// 刷新中间按钮状态

function refreshButtons(){


    document
    .querySelectorAll(".tag")
    .forEach(btn=>{


        if(
            selectedTags.includes(
                btn.dataset.tag
            )
        ){

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






// 复制

document
.getElementById(
    "copy-btn"
)
.onclick=()=>{


    navigator.clipboard.writeText(

        selectedTags.join(", ")

    );


};





// 清空

document
.getElementById(
    "clear-btn"
)
.onclick=()=>{


    selectedTags=[];


    updateSelected();


    refreshButtons();


};
