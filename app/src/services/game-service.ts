import { Page } from "../models/page";
import { Game } from "../models/game";
import { getGroupBySlug } from "./group-service";
import { getSlug, sanitizeText, validate } from "../services/base-service";

export async function createGame(name: string, group_slug: string) {
    const group: any = await getGroupBySlug(group_slug);

    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 30 characters."); 

    let slug: string = getSlug(name);

    let game = Game.create({
        name: name,
        slug: slug,
        group_id: group.id
    });

    return game;
}

export function updateGame(game: Game, name: string, profile_pic: string) {
    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 30 characters."); 
    
    game.update({
        name: name,
        profile_pic: profile_pic
    });

    return game;
}

export function deleteGame(group_id: number) {
    return Game.destroy({
        where: {
            id: group_id
        }
    });
}

export function getGameBySlug(slug: string) {
    return Game.findOne({
        where: {
            slug: slug
        },
        include: Page
    });
}