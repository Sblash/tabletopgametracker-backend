import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createPage, updatePage, getPages, deletePage } from "../services/page-service";
import { getPageById } from "../repos/page-repo";
import { Page } from '@models/page';

// Constants
export const pageRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list pages
pageRouter.get(p.list, async (_: Request, res: Response) => {
    const pages = await getPages();
    return res.status(OK).json({ success: true, pages: pages});
});

//Create page
pageRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const game_slug: string = _.body.game_slug;
    const page = await createPage(name, game_slug);
    return res.status(CREATED).json({ success: true, page: page })
});

//Update page
pageRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let page_id: number = _.body.page_id;

    let page: Page | null = await getPageById(page_id);

    if (!page) {
        return res.status(BAD_REQUEST).json({
            "message": "page not found."
        })
    }

    page = await updatePage(page, name);
    return res.status(OK).json({ success: true, page: page })
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
