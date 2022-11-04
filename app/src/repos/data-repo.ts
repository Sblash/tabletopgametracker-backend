import { Data } from "../models/data";

export async function getDataById(id: number): Promise<Data | null> {
    let data = await Data.findOne({
        where: {
            id: id
        }
    });

    if (!data) return null;

    return data;
}