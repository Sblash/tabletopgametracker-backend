import { Game } from "../models/game";
import { Page } from "../models/page";
import { Structure } from "src/interfaces/Structure";
import { createElementsFromStructure, updateElementsFromStructure, deleteElementsFromStructure } from '../services/element-service';
import { getSlug, sanitizeText, validate, sanitizeSlug } from "../services/base-service";

export async function createPage(name: string, game_slug: string, structure: Structure) {
    const game: any = await Game.findOne({
        where: {
            slug: game_slug
        }
    });

    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 15 characters."); 

    let slug: string = getSlug(name);
    structure = sanitizeStructure(structure, true);

    let page = await Page.create({
        name: name,
        slug: slug,
        structure: structure,
        game_id: game.id
    });

    return page;
}

export async function updatePage(page: Page, name: string, structure: Structure) {
    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 15 characters.");
    
    structure = sanitizeStructure(structure, false);

    if (!validateStructure(structure)) throw new Error("There is at least one element's name that exceeds the limit of 15 characters.");

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

function sanitizeStructure(structure: Structure, is_create: boolean) {
    for (let r = 0; r < structure.rows.length; r++) {
        for (let c = 0; c < structure.rows[r].cols.length; c++) {
            for (let e = 0; e < structure.rows[r].cols[c].elements.length; e++) {
                let element_name = structure.rows[r].cols[c].elements[e].name;
                element_name = sanitizeText(element_name);
                structure.rows[r].cols[c].elements[e].name = element_name;
                
                let element_slug = structure.rows[r].cols[c].elements[e].slug;
                element_slug = sanitizeSlug(element_slug);
                structure.rows[r].cols[c].elements[e].slug = element_slug;
            }
        }
    }

    return structure;
}

function validateStructure(structure: Structure) {
    for (let r = 0; r < structure.rows.length; r++) {
        for (let c = 0; c < structure.rows[r].cols.length; c++) {
            for (let e = 0; e < structure.rows[r].cols[c].elements.length; e++) {
                let element_name = structure.rows[r].cols[c].elements[e].name;
                if (element_name.length > 15) return false;
            }
        }
    }

    return true;
}