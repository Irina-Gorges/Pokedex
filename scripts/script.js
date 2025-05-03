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
    let allPokemon = [];
    if (localStorage.getItem("pokemon").length == null) {
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

    for (let i = 0; i < allPokemon.length; i++) {
        contentRef.innerHTML += getRenderHtmlTemplate(
            allPokemon[i].id,
            allPokemon[i].name,
            allPokemon[i].type
            // readArray(allPokemon[i].stats)
        );
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

