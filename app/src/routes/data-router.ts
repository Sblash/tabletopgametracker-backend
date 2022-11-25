import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { createData, updateData, deleteData } from "../services/data-service";
import { getDataById } from "../repos/data-repo";
import { Data } from '@models/data';
import { getJwtTokenFromRequest, getUserFromJwt } from '../services/user-service';
import { EventEmitter } from 'stream';
import { User } from '@models/user';
import { logData } from '../services/log-service';

// Constants
export const dataRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;
const CREATE_DATA = "create";
const UPDATE_DATA = "update";

let eventsEmitter = new EventEmitter.EventEmitter();

eventsEmitter.on('log_data', (user: User, entity: Data, action: string) => {
    logData(user, entity, action);
});

// Paths
const p = {
    create: "/create",
    update: "/update",
    delete: "/delete"
};

//Create data
dataRouter.post(p.create, async (_: Request, res: Response) => {
    const value: JSON = _.body.value;
    const element_slug: string = _.body.element_slug;

    const data = await createData(value, element_slug);
    
    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    eventsEmitter.emit('log_data', user, data, CREATE_DATA);

    return res.status(CREATED).json({ success: true, data: data })
});

//Update data
dataRouter.put(p.update, async (_: Request, res: Response) => {
    let value: JSON = _.body.value;
    let data_id: number = _.body.data_id;

    let data: Data | null = await getDataById(data_id);

    if (!data) {
        return res.status(BAD_REQUEST).json({
            "message": "data not found."
        })
    }

    data = await updateData(data, value);

    const token = getJwtTokenFromRequest(_);
    if (!token) return res.status(401).json({"error": true, "message": 'Unauthorized access.'});
    let user = await getUserFromJwt(token);

    eventsEmitter.emit('log_data', user, data, UPDATE_DATA);

    return res.status(OK).json({ success: true, data: data })
});

//Delete data
dataRouter.delete(p.delete, async (_: Request, res: Response) => {
    const data_id: number = _.body.data_id;

    try {
        if (!data_id) return res.status(OK).json({ success: false, message: "data_id can't be null." });
        const result = await deleteData(data_id);
        
        if (result) {
            return res.status(OK).json({ success: true, message: "Data deleted." });
        } else {
            return res.status(OK).json({ success: false, message: "Data not found." });
        }
        
    } catch(e) {
        return res.status(OK).json({ success: false, message: e });
    }
});