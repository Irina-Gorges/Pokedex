function getRenderHtmlTemplate(id, name, type) {
    return `<div onclick="toggleOverlay(${id})" id="${id}" class="poke_Container">
        <img class="${
            type[0].type.name
        } photo" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png">
        <div class="name_Info">#${id} &nbsp; ${name}&nbsp;</div>
        <div id="photo_Type">${getRenderTypeTemplate(type)}</div> 
        </div>`;
}

function getRenderTypeTemplate(type) {
    if (type.length == 2) {
        return `<img src="img/${type[0].type.name}.webp" alt"${type[0].type.name}"><img src="img/${type[1].type.name}.webp" alt"${type[0].type.name}">`;
    } else {
        return `<img src="img/${type[0].type.name}.webp" alt"${type[0].type.name}">`;
    }
}

function getRenderStatsTemplate(stats) {
    let result = "";
    for (i = 0; i < stats.length; i++) {
        result += `<p>${stats[i].stat.name} ${stats[i].base_stat}</p>`;
    }
    return result;
}

function toggleOverlayTemplate(id, type, name, menge, i, stats, pokeeinzel) {
    return `<div onclick="bubblingprotection(event)" id="dialog" class="dialog_Container flex_Container">
                <div id="photo-title">#${id} &nbsp;&nbsp; ${name}</div>
                <img
                    onclick="toggleClose()"
                    src="./img/x-circle-regular-24.png"
                    alt="x-icon"
                    class="close"
                    class="flex_Container"
                />
                <div class="${
                    type[0].type.name
                } photo_big"><img id="dialog-img" class="img_Dialog"src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png' /></div>
                <div class="type">${getRenderTypeTemplate(type)}</div>
                <div id="more_Details" class="details">
                    <button onclick="renderInfoPokeTemplate(${i})">Info</button>
                    <button onclick="rendSpecialInfo(${i})">Stats</button>
                    <button onclick="">Evo Chain</button></div>
                <div id="specialInfo"></div>
                <div id="navi_dialog"><img
                    onclick="back(${i})"
                    id="backbutton"
                    src="./img/chevron-left-solid-60.png"
                    alt=""
                />
                <div id="position">${i + 1}/${menge}</div>
                <img
                    onclick="forward(${i})"
                    id="forwardbutton"
                    src="./img/chevron-right-regular-60.png"
                    alt=""
                /></div>
            </div>`;
}

function renderInfoPokeTemplate(i) {
    let myArr = getFromLocalStorage();
    let specialInfoRef = document.getElementById("specialInfo");
    specialInfoRef.innerHTML = "";
    specialInfoRef.innerHTML = `<div><p>${myArr[i].height}</p>
            <p>${myArr[i].weight}</p>
            <p>${myArr[i].base_experience}</p>
            ${getRenderAbilitiesTemplate(myArr[i].abilities)}
            </div>`;
}

function getRenderAbilitiesTemplate(abilities) {
    let result = "";
    for (i = 0; i < abilities.length; i++) {
        result += `<span>${abilities[i].ability.name} </span>`;
    }
    return result;
}

function rendSpecialInfo(i) {
    let myArr = getFromLocalStorage();
    let specialInfoRef = document.getElementById("specialInfo");
    specialInfoRef.innerHTML = "";
    specialInfoRef.innerHTML = getRenderStatsTemplate(myArr[i].stats);
}
