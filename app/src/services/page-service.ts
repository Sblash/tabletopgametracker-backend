import { Game } from "../models/game";
import { Page } from "../models/page";
import { Structure } from "src/interfaces/Structure";
import { createElementsFromStructure, updateElementsFromStructure, deleteElementsFromStructure } from '../services/element-service';

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

export async function updatePage(page: Page, name: string, structure: Structure) {
    page.update({
        name: name,
        structure: structure
    });

    await createElementsFromStructure(page.slug, structure);
    await updateElementsFromStructure(page.slug, structure);
    await deleteElementsFromStructure(page.slug, structure);

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