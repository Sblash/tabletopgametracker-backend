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