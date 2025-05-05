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
    // Wenn der Zaehler 0 ist soll wieder von hinten angefangen werden

    if (i == 0) {
        i = allPokemon.length - 1;
        updateDialog(i);
    } else {
        // Wenn nicht erstes Bild dann ein Bild zurück
        i--;
        updateDialog(i);
    }
    document.getElementById("backbutton").onclick = function () {
        back(i);
    };
    document.getElementById("forwardbutton").onclick = function () {
        forward(i);
    };
}

function forward(i) {
    // Wenn der Zaehler das Maxmimum erreicht hat soll wieder von vorne angefangen werden
    if (i == allPokemon.length - 1) {
        i = 0;
        updateDialog(i);
    } else {
        // Wenn nicht letztes Bild dann nächstes anzeigen
        i++;
        updateDialog(i);
    }

    document.getElementById("forwardbutton").onclick = function () {
        forward(i);
    };
    document.getElementById("backbutton").onclick = function () {
        back(i);
    };
}

function updateDialog(ind) {
    let allPokemon = getFromLocalStorage();
    document.getElementById("dialog-img").src =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/" +
        allPokemon[ind].id +
        ".png";
    document.getElementById("photo-title").innerHTML = allPokemon[ind].name;
    document.getElementById("position").innerHTML = "";
    document.getElementById("position").innerHTML =
        ind + 1 + "/" + allPokemon.length;
}

function toggleOverlay(id) {
    let overlayRef = document.getElementById("overlay");
    let allPokemon = getFromLocalStorage();
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = toggleOverlayTemplate(
        id,
        allPokemon[id - 1].name,
        allPokemon.length,
        id - 1
    );
    toggleClose();
}
