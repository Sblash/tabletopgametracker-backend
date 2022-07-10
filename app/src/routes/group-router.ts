import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGroup, updateGroup } from "../services/group-service";
import { getGroupById } from "../repos/group-repo";
import { Group } from '../models/group';

// Constants
export const groupRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list groups
groupRouter.get(p.list, async (_: Request, res: Response) => {
    // const users = await userService.addOne();
    // return res.status(OK).json({users});
});

//Create group
groupRouter.post(p.create, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let created_by: number = 1;
    let group = await createGroup(name, created_by);
    return res.status(CREATED).json({ group })
});

//Update group
groupRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let group_id: number = _.body.group_id;

    let group: Group | null = await getGroupById(group_id);

    if (!group) {
        return res.status(BAD_REQUEST).json({
            "message": "group not found."
        })
    }

    group = await updateGroup(group, name);
    return res.status(OK).json({ group })
});

