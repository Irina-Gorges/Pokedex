function getRenderHtmlTemplate(id, name, type) {
    return (
        `<div id="${id}" class="poke_Container">` +
        `<img class="${type}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png">` +
        `<div class="name_Info">#${id} &nbsp; ${name}</div>` +
        `</div>`
    );
}
