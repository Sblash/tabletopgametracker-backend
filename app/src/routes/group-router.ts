import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createGroup, updateGroup, getGroups, deleteGroup, addMembers, updateMembers } from "../services/group-service";
import { getGroupById, getGroupBySlug } from "../repos/group-repo";
import { Group } from '../models/group';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';
import { User as UserInterface } from '../interfaces/User';

// Constants
export const groupRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    list: '/',
    get: '/group/:group_slug',
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Get list groups
groupRouter.get(p.list, async (_: Request, res: Response) => {
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    if (user) {
        const groups = await getGroups(user);
        return res.status(OK).json({ success: true, groups: groups });
    }

    return res.status(400).json({"error": true, "message": 'Unauthorized access.'});
});

//Get group
groupRouter.get(p.get, async (_: Request, res: Response) => {
    const group_slug = _.params.group_slug;

    if (!group_slug) return res.status(OK).json({success: false, message: "Parameter 'group_slug' can't be null."});

    const group = await getGroupBySlug(group_slug);

    if (!group) return res.status(OK).json({ success:false, message: "The group doesn't exists."});

    return res.status(OK).json({ success: true, group: group});
});

//Create group
groupRouter.post(p.create, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let profile_pic: string = _.body.profile_pic;
    let members: Array<UserInterface> = _.body.members;

    if (!name) return res.status(OK).json({success: false, message: "Parameter 'name' can't be null."});
    
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    if (user) {
        try {
            let group = await createGroup(name, user, profile_pic);
        
            await addMembers(group, members);

            return res.status(CREATED).json({ success: true, group: group })
        } catch(e) {
            return res.status(OK).json({success: false, message: e.message});
        }
    }

    return res.status(400).json({"error": true, "message": 'Unauthorized access.'});
});

//Update group
groupRouter.put(p.update, async (_: Request, res: Response) => {
    let name: string = _.body.name;
    let group_id: number = _.body.id;
    let profile_pic: string = _.body.profile_pic;
    let members: Array<UserInterface> = _.body.members;

    if (!name) return res.status(OK).json({success: false, message: "Parameter 'name' can't be null."});
    if (!group_id) return res.status(OK).json({success: false, message: "Parameter 'group_id' can't be null."});

    let group: Group | null = await getGroupById(group_id);

    if (!group) {
        return res.status(BAD_REQUEST).json({
            "message": "group not found."
        })
    }

    try {
        group = await updateGroup(group, name, profile_pic);

        if (members) {
            await updateMembers(group, members);
        }

        return res.status(OK).json({ success: true, group: group })
    } catch(e) {
        return res.status(OK).json({success: false, message: e.message});
    }
});

groupRouter.delete(p.delete, async (_: Request, res: Response) => {
    const group_id: number = _.body.group_id;

    if (!group_id) return res.status(OK).json({success: false, message: "Parameter 'group_id' can't be null."});

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

