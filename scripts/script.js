let allPokemon = [];
let displayedCount = 0;
const PAGE_SIZE = 20;

function init() {
    //fetchDataJson("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0");
    renderHtml();
}

async function fetchDataJson(pokeUrl) {
    const response = await fetch(pokeUrl);
    const responseAsJson = await response.json();
    return responseAsJson;
}

function saveToLocalStorage(pokeList) {
    localStorage.setItem("pokemon", JSON.stringify(pokeList));
}

async function renderHtml() {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    if (!localStorage.getItem("pokemon")) {
        const poke = await fetchDataJson(
            "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0"
        );

        for (let i = 0; i < poke.results.length; i++) {
            const res = await fetch(poke.results[i].url);
            const data = await res.json();

            allPokemon.push({
                id: data.id,
                name: data.name,
                type: data.types,
                url: data.forms[0].url,
                stats: data.stats,
                height: data.height,
                weight: data.weight,
                base_experience: data.base_experience,
                abilities: data.abilities,
            });
        }

        saveToLocalStorage(allPokemon);
    } else {
        allPokemon = getFromLocalStorage();
    }

    displayedCount = 0;
    renderNextPokemons();
    renderLoadMoreButton();
}


function renderNextPokemons() {
    const contentRef = document.getElementById("content");
    const end = Math.min(displayedCount + PAGE_SIZE, allPokemon.length);

    for (let i = displayedCount; i < end; i++) {
        contentRef.innerHTML += getRenderHtmlTemplate(
            allPokemon[i].id,
            allPokemon[i].name,
            allPokemon[i].type
        );
    }

    displayedCount = end;

    // Wenn alle angezeigt sind, Button ausblenden
    if (displayedCount >= allPokemon.length) {
        document.getElementById("load-more-btn").style.display = "none";
    }
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("pokemon")) || [];
}

function readArray(myArr) {
    let result = "";

    for (i = 0; i < myArr.length; i++) {
        result += myArr[i].stat.name + ": " + myArr[i].base_stat + "<br>";
    }
    return result;
}

function renderLoadMoreButton() {
    let button = document.getElementById("load-more-btn");
    if (!button) {
        button = document.createElement("button");
        button.id = "load-more-btn";
        button.className = "load-more-button";
        button.textContent = "Mehr anzeigen";
        button.onclick = renderNextPokemons;

        const wrapper = document.createElement("div");
        wrapper.id = "load-more-wrapper";
        wrapper.appendChild(button);

        const contentRef = document.getElementById("content");
        contentRef.parentNode.insertBefore(wrapper, contentRef.nextSibling);
    }
}


