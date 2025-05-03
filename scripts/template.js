function getRenderHtmlTemplate(id, name, type, stats) {
    return (
        `<div id="${id}" class="poke_Container">` +
        `<img class="${type[0].type.name} photo" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png">` +
        `<div class="name_Info">#${id} &nbsp; ${name}&nbsp; ${stats}</div>` +
        `</div>`
    );
}
