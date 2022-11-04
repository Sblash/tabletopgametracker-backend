import { Game } from "../models/game";
import { Page } from "../models/page";
import { Element } from "../models/element";
import { Structure } from "src/interfaces/Structure";

export async function createPage(name: string, game_slug: string, structure: Structure) {
    const game: any = await Game.findOne({
        where: {
            slug: game_slug
        }
    });

    let slug: string = getSlug(name);

    let page = await Page.create({
        name: name,
        slug: slug,
        structure: structure,
        game_id: game.id
    });

    return page;
}

export function updatePage(page: Page, name: string) {
    page.update({
        name: name
    });

    return page;
}

export function getPages() {
    return Page.findAll();
}

export function deletePage(page_id: number) {
    return Page.destroy({
        where: {
            id: page_id
        }
    });
}

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace(/ /gi, "_");

    return slug;
}