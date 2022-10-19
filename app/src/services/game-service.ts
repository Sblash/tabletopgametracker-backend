import { Page } from "../models/page";
import { Game } from "../models/game";
import { getGroupBySlug } from "./group-service";

export async function createGame(name: string, group_slug: string) {
    const group: any = await getGroupBySlug(group_slug);

    let slug: string = getSlug(name);

    let game = Game.create({
        name: name,
        slug: slug,
        group_id: group.id
    });

    return game;
}

export function updateGame(game: Game, name: string) {
    game.update({
        name: name
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

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace(/ /gi, "_");

    return slug;
}