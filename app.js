let data = {};

let currentMain = null;

fetch("tags.json")
  .then((res) => res.json())

  .then((json) => {
    data = json;

    loadMainCategory();
  });

function loadMainCategory() {
  let box = document.getElementById("category");

  box.innerHTML = "";

  Object.keys(data).forEach((main) => {
    let div = document.createElement("div");

    div.className = "category";

    div.innerText = main;

    div.onclick = () => {
      currentMain = main;

      showSubCategory(main);
    };

    box.appendChild(div);
  });
}

function showSubCategory(main) {
  let box = document.getElementById("tags");

  box.innerHTML = "";

  Object.keys(data[main]).forEach((sub) => {
    let title = document.createElement("h3");

    title.innerText = sub;

    box.appendChild(title);

    data[main][sub].forEach((item) => {
      let tag = Object.keys(item)[0];

      let cn = item[tag];

      let btn = document.createElement("div");

      btn.className = "tag";

      btn.innerText = cn;

      btn.onclick = () => {
        navigator.clipboard.writeText(tag);

        alert("复制:\n" + tag);
      };

      btn.onmouseenter = () => {
        showPreview(tag, cn);
      };

      box.appendChild(btn);
    });
  });
}

function showPreview(tag, cn) {
  let box = document.getElementById("preview-content");

  let html = `

<b>${tag}</b>

<br><br>

${cn}

<br><br>

`;

  let img = "images/" + tag + ".jpg";

  html += `

<img src="${img}"
onerror="this.style.display='none'">

`;

  box.innerHTML = html;
}
