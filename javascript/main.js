
var _pageData;

window.onload = function () {
    if (true) {
        loadJSON("pages.json", populatePage);
    }
    else {
        populatePage(JSON.parse(window.localStorage.getItem("pages")));
        loadPageData();
    }
}

function loadPageData() {
    loadJSON("page_data.json", function (res) {
        _pageData = res;
        document.querySelector("#version").innerHTML = ", Build v" + _pageData.version;
        if (window.localStorage.getItem("pageData") == null) {
            window.localStorage.setItem("pageData", JSON.stringify(res));
        }
        else {
            if (res.version != JSON.parse(window.localStorage.getItem("pageData")).version) {
                window.localStorage.setItem("pageData", JSON.stringify(res));
                loadJSON("pages.json", function (resp) {
                    window.localStorage.setItem("pages", JSON.stringify(resp));
                    location.reload();
                });
            }
        }
    });
}

function populatePage(res) {
    window.localStorage.setItem("pages", JSON.stringify(res));
    var target;
    if (location.search.indexOf("&") != -1)
        target = location.search.substring(location.search.indexOf("=") + 1, location.search.indexOf("&"));
    else
        target = location.search.substring(location.search.indexOf("=") + 1);
    target = target.replace("%20", " ");
    if (target == "") {
        target = "home";
    }
    for (let link of document.querySelectorAll(".nav a")) {
        if (link.href.substring(link.href.indexOf("?page=") + 6).replace("'", "").replace("%20", " ") == target)
            link.style.color = "#fbab1a";
    }
    var foundPage = false;
    for (var page of res) {
        if (page.title.toLowerCase() == target) {
            foundPage = true;
            for (var key in page) {
                try {
                    if (Array.isArray(page[key])) {
                        for (var i = 0; i < page[key].length; i++) {
                            if (page[key][i]["sub-content"].charAt(0) == "%" && page[key][i]["sub-content"].charAt(page[key][i]["sub-content"].length - 1) == "%") {
                                var onloadStr = page[key][i]["sub-content"].substring(1, page[key][i]["sub-content"].length - 1);
                                onloadStr = onloadStr.substring(0, onloadStr.length - 1) + ", 'id-" + key.replace(/ /g, "") + "')";
                                document.querySelector(`#${key}`).innerHTML += `<div><h2>${page[key][i]["sub-title"]}</h2><div id="id-${key.replace(/ /g, "")}"></div></div>`;
                                eval(onloadStr);
                            }
                            else {
                                document.querySelector(`#${key}`).innerHTML += `<div><h2>${page[key][i]["sub-title"]}</h2><article id="id-${key.replace(/ /g, "")}">${page[key][i]["sub-content"]}</article></div>`;
                            }
                        }
                    }
                    else {
                        document.querySelector(`#${key}`).innerHTML = page[key];
                    }
                }
                catch (error) {
                    console.log(error);
                    console.error(`We could not find an element labeled '${key}' to put ${page[key]}`);
                }
            }
        }
    }
    if (target == "sponsor") {
        populateSponsor(location.search);
    }
    if (!foundPage) {
        document.querySelector("#header").innerHTML = "Hmm... Error?";
        document.querySelector("#articles").innerHTML = `<article>Sorry for this inconvenience but we cannot find a page with a reference key of '${target}'. It is possible that this page no longer exists or we have failed to update one of our redirect URLs if you continue having issues contact one of our website admins and they'll help you sort out the problem as quickly as they can. Thank you for understanding... We can only develop these webpages and debug so fast ya know... <br><br><img src='images/error.gif'>`;
    }
}

function createTable(jFile, container) {
    loadJSON(jFile, function (jsonData) {
        if (jsonData.length == 0) {
            document.querySelector("#" + container).innerHTML += "<article>No information availible at this time</article>";
            return;
        }
        var id = randomID();
        var row = 1;
        var table = "<table id='" + id + "' class='table'><tr>";
        for (var key of Object.keys(jsonData[0])) {
            table += ("<th>" + key + "</th>");
        }
        table += "</tr>";
        for (var object of jsonData) {
            table += "<tr>";
            for (var key of Object.keys(object)) {
                if (typeof (object[key]) == "object") {
                    table += "<td id='" + id + "-row-" + row + "-" + key + "' ondblclick='objEdit()'>" + JSON.stringify(object[key]) + "</td>";
                }
                else {
                    table += "<td id='" + id + "-row-" + row + "-" + key + "' ondblclick='editTable(this.id)'>" + object[key] + "</td>";
                }
            }
            table += "</tr>";
            row++;
        }
        table += "</table>"
        document.querySelector("#" + container).innerHTML += table;
    });
}


function eventPlacer(jFile, container) {
    loadJSON(jFile, function (jsonData) {
        for (var article of jsonData) {
            var update = "<div>";
            update += `<h2 style="text-decoration: underline;">${article.title}</h2>`;
            for (var subArticle of article.articles) {
                update += `<h3 style="color: darkblue">${subArticle["sub-title"]}`;
                update += `<p style="color: darkgoldenrod">${subArticle["text"]}</p>`;
            }
            update.innerHTML += "</div>";
            document.querySelector("#" + container).innerHTML += update;
        }
    });
}

function loadJSON(file, callback) {
    fetch(file).then(res => {
        return res.json();
    }).then(res => {
        callback(res);
    });
}

function randomID() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var str = "";
    for (var i = 0; i < 10; i++) {
        str += (chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return str;
}

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

function toSponsorData(file) {
    fetch(file).then(res => { return res.json() }).then(res => {
        var sponsorData = {};
        res = res["Sheet1"];
        for (var row of res) {
            for (var col of Object.keys(row)) {
                var sponsorType = col;
                if (sponsorData[sponsorType] == undefined)
                    sponsorData[sponsorType] = [];
                sponsorData[sponsorType].push(row[col]);
            }
        }
        console.log(JSON.stringify(sponsorData, 2));
    }
    );
}

function sponsors(file, target) {
    document.querySelector('hr').remove();
    window["__ta"] = target;
    fetch('./sponsors.json').then(res => { return res.json() }).then(res => {
        window["__sponsor_data"] = res;
        var target = document.querySelector(`#${__ta}`);
        target.classList += " sponsor-lists";
        for (let sponsorType of Object.keys(res)) {
            target.innerHTML += `<h3>${sponsorType}</h3><hr>`;
            for (let sponsor of res[sponsorType]) {
                if (sponsor.website == 'na')
                    target.innerHTML += `<li>${sponsor.name}</li>`;
                else
                    target.innerHTML += `<li><a href="${sponsor["website"]}">${sponsor.name}</a></li>`;
            }
        }
    }
    );
}

function populateSponsor(query) {
    document.querySelector("#articles").classList = "sponsor-specific";
    query = query.substring(14);
    query = query.split("&");
    var type = query[0].substring(5).replace(/%20/g, " ");
    var name = query[1].substring(5).replace(/%20/g, " ");
    var imgSrc = query[2].substring(5);
    var web = query[3].substring(5);
    document.querySelector("#header").innerHTML = name + "<br><h1 class='sponsor-type'>Sponsor Level: " + type + "</h1>";
    var as = document.querySelector("#articles");
    if (imgSrc != "na") { as.children[0].children[1].innerHTML = `<img src="${imgSrc}">`; }
    else { as.children[0].children[0].innerHTML = "<h3>Sponsor Logo</h3>"; as.children[0].children[1].innerHTML = `No logo is registered in our system for ${name}, if this is an issue contact us and we would be happy to fix the problem.`; }
    if (web != "na") { as.children[1].children[1].innerHTML = `<a target="_blank" href="${web}">Click here to visit ${web}</a>`; }
    else { as.children[1].children[1].innerHTML = `No website is registered in our system for ${name}, if this is an issue contact us and we would be happy to fix the problem.`; }
}

window.onresize = function () {
    document.querySelector(".nav").setAttribute("active", "true");
    evalNavbar();
}