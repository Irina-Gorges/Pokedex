// #region Basic, renderHtml

let displayedCount = 0;
const page_Size = 20;

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
    await loadFinalPoke();
    displayedCount = 0;
    const backBtnRef = document.getElementById("backBtn");
    backBtnRef.innerHTML = "";
    renderNextPokemons();
    renderLoadMoreButton();
}
// #endregion

// #region next 20 pokemons
async function loadFinalPoke() {
    const contentRef = document.getElementById("content");
    contentRef.innerHTML = "";
    let menge = 151;
    if (!localStorage.getItem("pokemon")) {
        const poke = await fetchDataJson(
            "https://pokeapi.co/api/v2/pokemon?limit=" + menge + "&offset=0"
        );
        await getPokeResults(poke);
    } else {
        let locelMenge = getFromLocalStorage();
        if (locelMenge.length != menge) {
            const poke = await fetchDataJson(
                "https://pokeapi.co/api/v2/pokemon?limit=" + menge + "&offset=0"
            );
            await getPokeResults(poke);
        } else {
            allPokemon = getFromLocalStorage();
        }
    }
}

function renderNextPokemons() {
    const contentRef = document.getElementById("content");
    const allPokemon = getFromLocalStorage();
    const end = Math.min(displayedCount + page_Size, allPokemon.length);
    for (let i = displayedCount; i < end; i++) {
        contentRef.innerHTML += getRenderHtmlTemplate(
            allPokemon[i].id,
            allPokemon[i].name,
            allPokemon[i].type,
            allPokemon[i].stats
        );
    }
    displayedCount = end;
    if (displayedCount >= allPokemon.length) {
        document.getElementById("load-more-btn").style.display = "none";
    }
}
// #endregion

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

// #region load more

function renderLoadMoreButton() {
    let button = document.getElementById("load-more-btn");
    if (!button) {
        button = createLoadMoreButton();
        const wrapper = createButtonWrapper(button);
        insertAfterContent(wrapper);
    }
}

function createLoadMoreButton() {
    const button = document.createElement("button");
    button.id = "load-more-btn";
    button.className = "load-more-button";
    button.textContent = "more...";
    button.onclick = renderNextPokemons;
    return button;
}

function createButtonWrapper(button) {
    const wrapper = document.createElement("div");
    wrapper.id = "load-more-wrapper";
    wrapper.appendChild(button);
    return wrapper;
}

function insertAfterContent(wrapper) {
    const contentRef = document.getElementById("content");
    contentRef.parentNode.insertBefore(wrapper, contentRef.nextSibling);
}
// #endregion

function toggleClose() {
    let overlayRef = document.getElementById("overlay");
    let scrollRef = document.getElementById("no_Scroll");
    overlayRef.classList.toggle("d_none");
    scrollRef.classList.toggle("no-scroll");
}

function bubblingprotection(event) {
    event.stopPropagation();
}

// #region navi/Dialog
function back(i) {
    let myArr = getFromLocalStorage();
    if (i == 0) {
        i = myArr.length - 1;
        updateDialog(i);
    } else {
        i--;
        updateDialog(i);
    }
}

function forward(i) {
    let myArr = getFromLocalStorage();
    if (i == myArr.length - 1) {
        i = 0;
        updateDialog(i);
    } else {
        i++;
        updateDialog(i);
    }
}

function updateDialog(i) {
    let overlayRef = document.getElementById("overlay");
    let myArr = getFromLocalStorage();
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = toggleOverlayTemplate(
        myArr[i].id,
        myArr[i].type,
        myArr[i].name,
        myArr.length,
        i,
        myArr[i].stats,
        myArr[i]
    );
    renderInfoPokeTemplate(i);
}
// #endregion

function toggleOverlay(id) {
    let overlayRef = document.getElementById("overlay");
    let myArr = getFromLocalStorage();
    let i = 0;
    i = id > 0 ? (i = id - 1) : (i = id);
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = toggleOverlayTemplate(
        id,
        myArr[i].type,
        myArr[i].name,
        myArr.length,
        i
    );
    renderInfoPokeTemplate(i);
    toggleClose();
}

async function getPokeResults(poke) {
    try {
        hideLoader();
        await delaySpinner(2000);
        const result = [];
        for (p = 0; p < poke.results.length; p++) {
            const pokemon = await fetchPokemonDetails(poke.results[p].url);
            result.push(pokemon);
        }
        saveToLocalStorage(result);
        hideLoader();
    } catch (error) {
        console.error("error:", error);
    }
}

function delaySpinner(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPokemonDetails(url) {
    const res = await fetch(url);
    const data = await res.json();

    return {
        id: data.id,
        name: data.name,
        type: data.types,
        url: data.forms[0].url,
        stats: data.stats,
        height: data.height,
        weight: data.weight,
        base_experience: data.base_experience,
        abilities: data.abilities,
        species: await getSpeciesResults(data.species.url),
    };
}

async function getSpeciesResults(speciesUrl) {
    const res = await fetch(speciesUrl);
    const data = await res.json();
    return data.flavor_text_entries[0].flavor_text;
}

function filterPokemons() {
    const filterWord = document.getElementById("searchInput").value;
    const allPokemon = getFromLocalStorage();
    let searchInfoRef = document.getElementById("infoSearch");
    searchInfoRef.innerHTML = "";
    if (filterWord.length >= 3) {
        handleValidSearch(filterWord, allPokemon);
    } else {
        handleInvalidSearch(filterWord);
    }
}

function handleValidSearch(filterWord, allPokemon) {
    const filtered = allPokemon.filter(
        (element) =>
            element.name === searchFindName(element.name.match(filterWord))
    );
    displayFilteredPokemons(filtered);
}

function displayFilteredPokemons(pokemons) {
    const contentRef = document.getElementById("content");
    const backBtnRef = document.getElementById("backBtn");
    let loadmoreWrapperRef = document.getElementById("load-more-wrapper");
    loadmoreWrapperRef.innerHTML = "";
    contentRef.innerHTML = renderHtmlContent(pokemons);
    backBtnRef.innerHTML = `<button class="btn_Back" onclick="renderHtml()">Back</button>`;
}

function handleInvalidSearch(input) {
    let searchInfoRef = document.getElementById("infoSearch");
    if (input !== "") {
        searchInfoRef.innerHTML =
            "Min. three characters, currently it is " + input.length;
    } else {
        searchInfoRef.innerHTML = "Please enter!";
    }
}

function searchFindName(element) {
    let result = element ? element.input : "";
    return result;
}

function renderHtmlContent(searchArr) {
    let result = "";
    for (let i = 0; i < searchArr.length; i++) {
        result += getRenderHtmlTemplate(
            searchArr[i].id,
            searchArr[i].name,
            searchArr[i].type,
            searchArr[i].stats
        );
    }
    return result;
}

function hideLoader() {
    let loaderRef = document.getElementById("loader");
    loaderRef.classList.toggle("d_none");
}

function getRenderTypeTemplate(type) {
    if (type.length == 2) {
        return `<img src="img/${type[0].type.name}.webp" alt"${type[0].type.name}"><img src="img/${type[1].type.name}.webp" alt"${type[0].type.name}">`;
    } else {
        return `<img src="img/${type[0].type.name}.webp" alt"${type[0].type.name}">`;
    }
}

function getRenderStatsTemplate(stats) {
    let result = `<div class="stats-container">`;
    for (let i = 0; i < stats.length; i++) {
        result += `
            <div class="stat-item">
                <span class="stat-name">${stats[i].stat.name}:</span>
                <span class="stat-value">${stats[i].base_stat}</span>
            </div>
        `;
    }
    result += `</div>`;
    return result;
}
