function getRenderHtmlTemplate(id, name) {
    return (
        `<div id="${id}" class="poke_Container"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/` +
        id +
        `.gif">` +
        `<div class="name_Info">` +
        `#` +
        id +
        `  ` +
        name +
        `</div></div>`
    );
}
