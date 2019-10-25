window.addEventListener('load', function () {
    fetch('updates.json').then(res => res.json()).then(json => {
        showUpdates(json);
    });
});

function evalNavbar() {
    var nav = document.querySelector(".nav");
    var children = nav.children;
    var active = nav.getAttribute("active");
    var index = 0;
    for (var child of children) {
        if (active == "false" && index != 0 && index < children.length - 1) {
            nav.style.gridTemplateRows = `repeat(${children.length - 1 + 2}, 1fr)`;
            child.style.display = "block";
            child.style.gridColumn = "1 / 7";
            child.style.paddingTop = "0.25em";
            child.style.paddingBottom = "0.25em";
            child.style.gridRow = `${index + 3} / ${index + 4}`;
        }
        else if (active == "true" && index != 0 && index < children.length - 1) {
            child.removeAttribute("style");
            nav.removeAttribute("style");
        }
        index++;
    }
    if (active == "true") {
        document.querySelector(".nav").setAttribute("active", "false");
    }
    else {
        document.querySelector(".nav").setAttribute("active", "true");
    }
}

function addText(elm, text) {
    let textNode = document.createTextNode(text);
    elm.appendChild(textNode);
}

function createChild(type) {
    return document.createElement(type);
}

function createUpdate(update) {
    let div = createChild('div');
    div.className = "update";

    let thumbnail = createChild('img');
    thumbnail.className = 'thumbnail';
    thumbnail.src = update.source + ".PNG";
    let div2 = createChild('div');
    let title = createChild('h3');
    addText(title, update.title);
    let postedOn = createChild('h4');
    addText(postedOn, update['post-date']);
    let view = createChild('a');
    addText(view, 'View');
    view.setAttribute('href', `javascript:show('${update.source}')`);
    view.setAttribute('target', "_blank");
    let download = createChild('a');
    download.setAttribute('href', update.source);
    download.setAttribute('download', "");
    addText(download, 'Download');

    div.appendChild(thumbnail);
    div2.appendChild(title);
    div2.appendChild(postedOn);
    div2.appendChild(createChild('br'));
    div2.appendChild(view);
    div2.appendChild(createChild('br'));
    div2.appendChild(download);
    div.appendChild(div2);
    document.querySelector('#updates').appendChild(div);
}

function showUpdates(array) {
    for (let update of array) {
        console.log(update)
        createUpdate(update);
    }
}

function show(update) {
    document.querySelector("#document-view").src = update;
    document.querySelector(".view-container").hidden = false;
}

function closeView() {
    document.querySelector("#document-view").src = "";
    document.querySelector(".view-container").hidden = true;
}

function startSlides(elm, images, length) {
    let index = 0;
    (function () { if (index >= length) index = 0; elm.src = `${images}/${index++}.jpg`; })();
    let imgInterval = setInterval(function () {
        if (index >= length)
            index = 0;
        elm.src = `${images}/${index++}.jpg`;
    }, 5100);
}