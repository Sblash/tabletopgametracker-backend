import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGame, updateGame, getGames, deleteGame } from "../services/game-service";
import { getGameById } from "../repos/game-repo";
import { Game } from '../models/game';

// Constants
export const gameRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list groups
gameRouter.get(p.list, async (_: Request, res: Response) => {
    const groups = await getGames();
    return res.status(OK).json({groups});
});

//Create group
gameRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const group_id: number = _.body.group_id;
    const group = await createGame(name, group_id);
    return res.status(CREATED).json({ group })
});

//Update group
gameRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let group_id: number = _.body.group_id;

    let group: Game | null = await getGameById(group_id);

    if (!group) {
        return res.status(BAD_REQUEST).json({
            "message": "group not found."
        })
    }

    group = await updateGame(group, name);
    return res.status(OK).json({ group })
});
