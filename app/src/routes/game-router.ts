import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGame, updateGame, getGamesByGroup, deleteGame } from "../services/game-service";
import { getGroupBySlug } from "../services/group-service";
import { getGameById } from "../repos/game-repo";
import { Game } from '../models/game';

// Constants
export const gameRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/:group_slug',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list games
gameRouter.get(p.list, async (_: Request, res: Response) => {
    const group_slug = _.params.group_slug;
    const group = await getGroupBySlug(group_slug);

    if (!group) return res.status(OK).json({ success:false, message: "The group doesn't exists."});

    const games = await getGamesByGroup(group);
    
    return res.status(OK).json({ success:true, games: games});
});

//Create game
gameRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const group_id: number = _.body.group_id;
    const game = await createGame(name, group_id);
    return res.status(CREATED).json({ success: true, game: game })
});

//Update game
gameRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let game_id: number = _.body.game_id;

    let game: Game | null = await getGameById(game_id);

    if (!game) {
        return res.status(BAD_REQUEST).json({
            "message": "game not found."
        })
    }

    game = await updateGame(game, name);
    return res.status(OK).json({ success: true, game: game })
});

//Delete game
gameRouter.delete(p.delete, async (_: Request, res: Response) => {
    const game_id: number = _.body.game_id;

    try {
        if (!game_id) return res.status(OK).json({ success: false, message: "game_id can't be null." });
        const result = await deleteGame(game_id);
        
        if (result) {
            return res.status(OK).json({ success: true, message: "Game deleted." });
        } else {
            return res.status(OK).json({ success: false, message: "Game not found." });
        }
        
    } catch(e) {
        return res.status(OK).json({ success: false, message: e });
    }
});
