import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createElement, updateElement, getElements, deleteElement } from "../services/element-service";
import { getElementById } from "../repos/element-repo";
import { Element } from '@models/element';

// Constants
export const elementRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list elements
elementRouter.get(p.list, async (_: Request, res: Response) => {
    const elements = await getElements();
    return res.status(OK).json({ success: true, elements: elements});
});

//Create element
elementRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const page_id: number = _.body.page_id;
    const element = await createElement(name, page_id);
    return res.status(CREATED).json({ success: true, element: element })
});

//Update element
elementRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let element_id: number = _.body.element_id;

    let element: Element | null = await getElementById(element_id);

    if (!element) {
        return res.status(BAD_REQUEST).json({
            "message": "element not found."
        })
    }

    element = await updateElement(element, name);
    return res.status(OK).json({ success: true, element: element })
});

//Delete element
elementRouter.delete(p.delete, async (_: Request, res: Response) => {
    const element_id: number = _.body.element_id;

    try {
        if (!element_id) return res.status(OK).json({ success: false, message: "element_id can't be null." });
        const result = await deleteElement(element_id);
        
        if (result) {
            return res.status(OK).json({ success: true, message: "Element deleted." });
        } else {
            return res.status(OK).json({ success: false, message: "Element not found." });
        }
        
    } catch(e) {
        return res.status(OK).json({ success: false, message: e });
    }
});