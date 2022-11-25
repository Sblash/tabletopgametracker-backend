import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGame, updateGame, deleteGame } from "../services/game-service";
import { getGroupBySlug } from "../services/group-service";
import { getGameById, getGameBySlug } from "../repos/game-repo";
import { Game } from '../models/game';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';
import { EventEmitter } from 'stream';
import { User } from '@models/user';
import { logGame } from '../services/log-service';

// Constants
export const gameRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;
const CREATE_GAME = "create";
const UPDATE_GAME = "update";

let eventsEmitter = new EventEmitter.EventEmitter();

eventsEmitter.on('log_game', (user: User, entity: Game, action: string) => {
    logGame(user, entity, action);
});

// Paths
const p = {
    list: '/:group_slug',
    get: '/game/:game_slug',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list games
gameRouter.get(p.list, async (_: Request, res: Response) => {
    const group_slug = _.params.group_slug;
    
    if (!group_slug) return res.status(OK).json({success: false, message: "Parameter 'group_slug' can't be null."});

    const group = await getGroupBySlug(group_slug);

    if (!group) return res.status(OK).json({ success:false, message: "The group doesn't exists."});
    
    return res.status(OK).json({ success:true, games: group.games});
});

//Get game
gameRouter.get(p.get, async (_: Request, res: Response) => {
    const game_slug = _.params.game_slug;

    if (!game_slug) return res.status(OK).json({success: false, message: "Parameter 'game_slug' can't be null."});

    const game = await getGameBySlug(game_slug);

    if (!game) return res.status(OK).json({ success:false, message: "The game doesn't exists."});

    return res.status(OK).json({ success: true, game: game});
});

//Create game
gameRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const group_slug: string = _.body.group_slug;

    if (!name) return res.status(OK).json({success: false, message: "Parameter 'name' can't be null."});
    if (!group_slug) return res.status(OK).json({success: false, message: "Parameter 'group_slug' can't be null."});

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    try {
        const game = await createGame(name, group_slug);

        //fire event create group
        eventsEmitter.emit('log_game', user, game, CREATE_GAME);

        return res.status(CREATED).json({ success: true, game: game })
    } catch (e) {
        return res.status(OK).json({success: false, message: e.message});
    }
});

//Update game
gameRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let game_id: number = _.body.id;
    let profile_pic: string = _.body.profile_pic;

    if (!name) return res.status(OK).json({success: false, message: "Parameter 'name' can't be null."});
    if (!game_id) return res.status(OK).json({success: false, message: "Parameter 'game_id' can't be null."});

    let game: Game | null = await getGameById(game_id);

    if (!game) {
        return res.status(BAD_REQUEST).json({
            "message": "game not found."
        })
    }

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    try {
        game = await updateGame(game, name, profile_pic);

        //fire event create group
        eventsEmitter.emit('log_game', user, game, UPDATE_GAME);

        return res.status(OK).json({ success: true, game: game })
    } catch (e) {
        return res.status(OK).json({success: false, message: e.message});
    }
});

//Delete game
gameRouter.delete(p.delete, async (_: Request, res: Response) => {
    const game_id: number = _.body.game_id;

    if (!game_id) return res.status(OK).json({success: false, message: "Parameter 'game_id' can't be null."});

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
