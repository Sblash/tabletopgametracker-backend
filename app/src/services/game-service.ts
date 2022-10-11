import { Game } from "../models/game";
import { Group } from "../models/group";

export function createGame(name: string, group_id: number) {
    let slug: string = getSlug(name);

    let game = Game.create({
        name: name,
        slug: slug,
        group_id: group_id
    });

    return game;
}

export function updateGame(game: Game, name: string) {
    game.update({
        name: name
    });

    return game;
}

export function getGamesByGroup(group: Group) {
    return group.games;
}

export function deleteGame(group_id: number) {
    return Game.destroy({
        where: {
            id: group_id
        }
    });
}

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace("/ /gi", "_");

    return slug;
}