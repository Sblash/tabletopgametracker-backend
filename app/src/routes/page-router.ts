import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createPage, updatePage, getPages, deletePage } from "../services/page-service";
import { getGameBySlug } from "../services/game-service";
import { getPageById, getPageBySlug } from "../repos/page-repo";
import { Page } from '@models/page';
import { Structure } from 'src/interfaces/Structure';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';

// Constants
export const pageRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/:game_slug',
    get: '/page/:page_slug',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list pages
pageRouter.get(p.list, async (_: Request, res: Response) => {
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    if (!user) return res.status(400).json({"error": true, "message": 'Unauthorized access.'});

    const game_slug = _.params.game_slug;
    const game = await getGameBySlug(game_slug);

    if (!game) return res.status(OK).json({ success:false, message: "The game doesn't exists."});

    const pages = await getPages(user, game);

    return res.status(OK).json({ success: true, pages: pages});
});

//Get page
pageRouter.get(p.get, async (_: Request, res: Response) => {
    const page_slug = _.params.page_slug;
    const page = await getPageBySlug(page_slug);

    if (!page) return res.status(OK).json({ success:false, message: "The page doesn't exists."});

    return res.status(OK).json({ success: true, page: page});
});

//Create page
pageRouter.post(p.create, async (_: Request, res: Response) => {
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);
    
    const name: string = _.body.name;
    const game_slug: string = _.body.game_slug;
    const is_private: boolean = _.body.is_private;
    const structure: Structure = _.body.structure;

    if (user) {
        try {
            const page = await createPage(name, game_slug, is_private, user, structure);
            return res.status(CREATED).json({ success: true, page: page })
        } catch(e) {
            return res.status(OK).json({success: false, message: e.name});
        }
    }

    return res.status(400).json({"error": true, "message": 'Unauthorized access.'});
});

//Update page
pageRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let page_id: number = _.body.id;
    let is_private: boolean = _.body.is_private;
    const structure: Structure = _.body.structure;

    let page: Page | null = await getPageById(page_id);

    if (!page) {
        return res.status(BAD_REQUEST).json({
            "message": "page not found."
        })
    }

    try {
        page = await updatePage(page, name, is_private, structure);
        return res.status(OK).json({ success: true, page: page })
    } catch(e) {
        return res.status(OK).json({success: false, message: e.message});
    }
});

//Delete page
pageRouter.delete(p.delete, async (_: Request, res: Response) => {
    const page_id: number = _.body.page_id;

    try {
        if (!page_id) return res.status(OK).json({ success: false, message: "page_id can't be null." });
        const result = await deletePage(page_id);
        
        if (result) {
            return res.status(OK).json({ success: true, message: "Page deleted." });
        } else {
            return res.status(OK).json({ success: false, message: "Page not found." });
        }
        
    } catch(e) {
        return res.status(OK).json({ success: false, message: e });
    }
});
