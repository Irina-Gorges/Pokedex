function init() {
    fetchDataJson("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0");
}

async function fetchDataJson(pokeUrl) {
    const response = await fetch(pokeUrl);
    const responseAsJson = await response.json();
    renderHtml(responseAsJson);
}

function renderHtml(poke) {
    saveToLocalStorage(poke.results);
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    const pokeMon = getFromLocalStorage();
    for (i = 0; i < pokeMon.length; i++) {
        contentRef.innerHTML +=
            `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/` +
            pokeMon[i].id +
            `.gif">` +
            pokeMon[i].name +
            ` ` +
            pokeMon[i].url +
            `<br>`;
    }
}

function saveToLocalStorage(poke) {
    let id = "";
    for (i = 0; i < poke.length; i++) {
        id = poke[i].url.match(/\/pokemon\/(.*)\//);
        poke[i] = {
            id: `${id[1]}`,
            name: `${poke[i].name}`,
            url: `${poke[i].url}`,
        };
        localStorage.setItem(id[1], JSON.stringify(poke[i]));
    }
}

function getFromLocalStorage() {
    let myArr = [];
    for (i = 0; i < localStorage.length; i++) {
        myArr[i] = JSON.parse(localStorage.getItem(i + 1));
    }
    return myArr;
}
