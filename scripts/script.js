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
  await loadFinalPoke();
  displayedCount = 0;
  renderNextPokemons();
  renderLoadMoreButton();
}

async function loadFinalPoke() {
  const contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  if (!localStorage.getItem("pokemon")) {
    const poke = await fetchDataJson(
      "https://pokeapi.co/api/v2/pokemon?limit=40&offset=0"
    );
    await getPokeResults(poke);
  } else {
    allPokemon = getFromLocalStorage();
  }
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
  let id = 0;
  id = i > 0 ? (id = i - 1) : (id = i);
  overlayRef.innerHTML = "";
  overlayRef.innerHTML = toggleOverlayTemplate(
    myArr[i].id,
    myArr[id].type,
    myArr[i].name,
    myArr.length,
    i,
    myArr[i].stats,
    myArr[i]
  );
  renderInfoPokeTemplate(i);
}

function toggleOverlay(id) {
  let overlayRef = document.getElementById("overlay");
  let myArr = getFromLocalStorage();
  id = id > 0 ? (id = id - 1) : (id = id);
  overlayRef.innerHTML = "";
  overlayRef.innerHTML = toggleOverlayTemplate(
    id + 1,
    myArr[id].type,
    myArr[id].name,
    myArr.length,
    id
  );
  renderInfoPokeTemplate(id);
  toggleClose();
}

async function getPokeResults(poke) {
  try {
    hideLoader();
    const spinnerTimer = new Promise((resolve) => setTimeout(resolve, 2000));
    await spinnerTimer;
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
        species: await getSpeciesResults(data.species.url),
      });
    }
    saveToLocalStorage(result);
    hideLoader();
  } catch (error) {
    console.error("error:", error);
  }
}

async function getSpeciesResults(speciesUrl) {
  const res = await fetch(speciesUrl);
  const data = await res.json();
  return data.flavor_text_entries[0].flavor_text;
}

function filterPokemons() {
  let filterWord = document.getElementById("searchInput");
  let allPokemon = getFromLocalStorage();
  const contentRef = document.getElementById("content");
  if (filterWord.value.length >= 3) {
    currentPokemons = allPokemon.filter(
      (element) =>
        element.name == searchFindName(element.name.match(filterWord.value))
    );
    document.getElementById("load-more-btn").style.display = "none";
    contentRef.innerHTML = "";
    contentRef.innerHTML = renderHtmlContent(currentPokemons);
  } else {
    if (filterWord.value != "") {
      alert(
        "Mindestens drei Zeichen, es sind/ist aktuell " +
          filterWord.value.length
      );
    } else {
      alert("Bitte mach eine Eingabe!");
    }
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
