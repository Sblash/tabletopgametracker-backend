import { Game } from "../models/game";

export async function getGameById(id: number): Promise<Game | null> {
    let game = await Game.findOne({
        where: {
            id: id
        }
    });

    if (!game) return null;

    return game;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
    let game = await Game.findOne({
        where: {
            slug: slug
        }
    });

    if (!game) return null;

    return game;
}