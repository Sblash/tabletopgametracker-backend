import { Game } from "../models/game";
import { Page } from "../models/page";
import { User } from "../models/user";
import { getPagesByUserAndGame } from "../repos/page-repo";
import { Structure } from "src/interfaces/Structure";
import { createElementsFromStructure, updateElementsFromStructure, deleteElementsFromStructure } from '../services/element-service';
import { getSlug, sanitizeText, validate, sanitizeSlug } from "../services/base-service";

export async function createPage(name: string, game_slug: string, is_private: boolean, user: User, structure: Structure) {
    const game: any = await Game.findOne({
        where: {
            slug: game_slug
        }
    });

    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 30 characters."); 

    let slug: string = getSlug(name);
    structure = sanitizeStructure(structure);

    let page = await Page.create({
        name: name,
        slug: slug,
        is_private: is_private,
        structure: structure,
        game_id: game.id,
        created_by: user.id
    });

    return page;
}

export async function updatePage(page: Page, name: string, is_private: boolean, structure: Structure) {
    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 30 characters.");
    
    structure = sanitizeStructure(structure);

    if (!validateStructure(structure)) throw new Error("There is at least one element's name that exceeds the limit of 30 characters.");

    page.update({
        name: name,
        is_private: is_private,
        structure: structure
    });

    await createElementsFromStructure(page.slug, structure);
    await updateElementsFromStructure(page.slug, structure);
    await deleteElementsFromStructure(page.slug, structure);

    return page;
}

export async function getPages(user: User, game: Game) {
    return await getPagesByUserAndGame(user, game);
}

export function deletePage(page_id: number) {
    return Page.destroy({
        where: {
            id: page_id
        }
    });
}

function sanitizeStructure(structure: Structure) {
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
                if (element_name.length > 30) return false;
            }
        }
    }

    return true;
}