let displayedCount = 0;
const PAGE_SIZE = 20;

function init() {
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
        getPokeResults(poke);
    } else {
        allPokemon = getFromLocalStorage();
    }
    displayedCount = 0;
    renderNextPokemons();
    renderLoadMoreButton();
}

function renderNextPokemons() {
    const contentRef = document.getElementById("content");
    const allPokemon = getFromLocalStorage();
    const end = Math.min(displayedCount + PAGE_SIZE, allPokemon.length);

    for (let i = displayedCount; i < end; i++) {
        contentRef.innerHTML += getRenderHtmlTemplate(
            allPokemon[i].id,
            allPokemon[i].name,
            allPokemon[i].type,
            allPokemon[i].stats
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

function toggleClose() {
    let overlayRef = document.getElementById("overlay");
    overlayRef.classList.toggle("d_none");
}

function bubblingprotection(event) {
    event.stopPropagation();
}

function back(i) {
    if (i == 0) {
        i = allPokemon.length - 1;
        updateDialog(i);
    } else {
        i--;
        updateDialog(i);
    }
}

function forward(i) {
    if (i == allPokemon.length - 1) {
        i = 0;
        updateDialog(i);
    } else {
        i++;
        updateDialog(i);
    }
}

function updateDialog(i) {
    let overlayRef = document.getElementById("overlay");
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = toggleOverlayTemplate(
        getFromLocalStorage()[i].id,
        getFromLocalStorage()[i - 1].type,
        getFromLocalStorage()[i].name,
        getFromLocalStorage().length,
        i,
        getFromLocalStorage()[i].stats,
        getFromLocalStorage()[i]
    );
    renderInfoPokeTemplate(i);
}

function toggleOverlay(id) {
    let overlayRef = document.getElementById("overlay");
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = toggleOverlayTemplate(
        id,
        getFromLocalStorage()[id - 1].type,
        getFromLocalStorage()[id - 1].name,
        getFromLocalStorage().length,
        id - 1,
        getFromLocalStorage()[id].stats,
        getFromLocalStorage()[id]
    );
    renderInfoPokeTemplate(id - 1);
    toggleClose();
}

async function getPokeResults(poke) {
    let result = [];
    for (let i = 0; i < poke.results.length; i++) {
        const res = await fetch(poke.results[i].url);
        const data = await res.json();
        result.push({
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
    saveToLocalStorage(result);
}
