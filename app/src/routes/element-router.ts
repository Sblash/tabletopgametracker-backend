import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createElement, updateElement, deleteElement, createElementsFromStructure } from "../services/element-service";
import { getElementById, getElementBySlug } from "../repos/element-repo";
import { Element } from '@models/element';
import { Structure } from 'src/interfaces/Structure';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';
import { EventEmitter } from 'stream';
import { User } from '@models/user';
import { logElement } from '../services/log-service';

// Constants
export const elementRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;
const CREATE_EL = "create";
const UPDATE_EL = "update";

let eventsEmitter = new EventEmitter.EventEmitter();

eventsEmitter.on('log_element', (user: User, entity: Element, action: string) => {
    logElement(user, entity, action);
});

// Paths
const p = {
    // list: '/',
    get: '/element/:el_slug',
    create: "/create",
    create_from_structure: "/create-from-structure",
    update: "/update",
    delete: "/delete"
};

//Get list elements
// elementRouter.get(p.list, async (_: Request, res: Response) => {
//     const elements = await getElements();
//     return res.status(OK).json({ success: true, elements: elements});
// });

//Get element
elementRouter.get(p.get, async (_: Request, res: Response) => {
    const el_slug = _.params.el_slug;
    const element = await getElementBySlug(el_slug);

    if (!element) return res.status(OK).json({ success:false, message: "The element doesn't exists."});

    return res.status(OK).json({ success: true, element: element});
});

//Create element
elementRouter.post(p.create, async (_: Request, res: Response) => {
    const name: string = _.body.name;
    const type: string = _.body.type;
    const page_slug: string = _.body.page_slug;

    const element = await createElement(name, type, page_slug);

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    eventsEmitter.emit('log_element', user, element, CREATE_EL);

    return res.status(CREATED).json({ success: true, element: element })
});

//Create elements from structure
elementRouter.post(p.create_from_structure, async (_: Request, res: Response) => {
    const structure: Structure = _.body.structure;
    const page_slug: string = _.body.page_slug;

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    const elements = await createElementsFromStructure(page_slug, structure);

    for (let i = 0; i < elements.length; i++) {
        eventsEmitter.emit('log_element', user, elements[i], CREATE_EL);
    }

    return res.status(CREATED).json({ success: true, elements: elements })
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

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    element = await updateElement(element, name);

    eventsEmitter.emit('log_element', user, element, UPDATE_EL);

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