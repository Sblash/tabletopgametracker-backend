import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGroup, updateGroup, getGroups, deleteGroup } from "../services/group-service";
import { getGroupById } from "../repos/group-repo";
import { Group } from '../models/group';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';
import { User as UserInterface } from '../interfaces/User';

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
    const groups = await getGroups();
    return res.status(OK).json({ success: true, groups: groups });
});

//Create group
groupRouter.post(p.create, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let members: Array<UserInterface> = _.body.members;
    
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    if (user) {
        let group = await createGroup(name, user);
        
        await addMembers(group, members);
        
        return res.status(CREATED).json({ success: true, group: group })
    }

    return res.status(400).json({"error": true, "message": 'Unauthorized access.'});
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
    return res.status(OK).json({ success: true, group: group })
});

groupRouter.delete(p.delete, async (_: Request, res: Response) => {
    const group_id: number = _.body.group_id;

    try {
        if (!group_id) return res.status(OK).json({ success: false, message: "group_id can't be null." });
        const result = await deleteGroup(group_id);
        
        if (result) {
            return res.status(OK).json({ success: true, message: "Group deleted." });
        } else {
            return res.status(OK).json({ success: false, message: "Group not found." });
        }
        
    } catch(e) {
        return res.status(OK).json({ success: false, message: e });
    }
});

