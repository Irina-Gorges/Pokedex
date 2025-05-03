function init() {
    fetchDataJson("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0");
}

async function fetchDataJson(pokeUrl) {
    const response = await fetch(pokeUrl);
    const responseAsJson = await response.json();
    await renderHtml(responseAsJson);
}

function saveToLocalStorage(pokeList) {
    localStorage.setItem("pokemon", JSON.stringify(pokeList));
}

async function renderHtml(poke) {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    const allPokemon = [];

    for (let i = 0; i < poke.results.length; i++) {
        const res = await fetch(poke.results[i].url);
        const data = await res.json();

        allPokemon.push({
            id: data.id,
            name: data.name,
            type: data.types[0].type.name, // nur der erste Typ
            url: data.forms[0].url,
        });
    }

    saveToLocalStorage(allPokemon);

    for (let i = 0; i < allPokemon.length; i++) {
        contentRef.innerHTML += getRenderHtmlTemplate(
            allPokemon[i].id,
            allPokemon[i].name,
            allPokemon[i].type
        );
    }
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("pokemon")) || [];
}

// function renderHtml(poke) {
//     saveToLocalStorage(poke.results);
//     let contentRef = document.getElementById("content");
//     contentRef.innerHTML = "";
//     const pokeMon = getFromLocalStorage();
//     for (i = 0; i < pokeMon.length; i++) {
//         contentRef.innerHTML += getRenderHtmlTemplate(
//             pokeMon[i].id,
//             pokeMon[i].name,
//             pokeMon[i].types
//         );
//     }
// }

// function saveToLocalStorage(poke) {
//     let id = "";
//     for (i = 0; i < poke.length; i++) {
//         id = poke[i].url.match(/\/pokemon\/(.*)\//);
//         poke[i] = {
//             id: `${id[1]}`,
//             name: `${poke[i].name}`,
//             url: `${poke[i].url}`,
//             types: `${poke[i].types.type.name}`,
//         };
//         localStorage.setItem(id[1], JSON.stringify(poke[i]));
//     }
// }

// function getFromLocalStorage() {
//     let myArr = [];
//     for (i = 0; i < localStorage.length; i++) {
//         myArr[i] = JSON.parse(localStorage.getItem(i + 1));
//     }
//     return myArr;
// }
