function getRenderHtmlTemplate(id, name, type, stats) {
    return `<div id="${id}" class="poke_Container">
        <img class="${
            type[0].type.name
        } photo" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png">
        <div class="name_Info">#${id} &nbsp; ${name}&nbsp; ${stats}</div>
        <div id="photo_Type">${getRenderTypeTemplate(type)}</div> 
        </div>`;
}

function getRenderTypeTemplate(type) {
    if (type.length == 2) {
        return `<img src="img/${type[0].type.name}.webp" alt=""><img src="img/${type[1].type.name}.webp" alt=""></img>`;
    } else {
        return `<img src="img/${type[0].type.name}.webp" alt="">`;
    }
}
