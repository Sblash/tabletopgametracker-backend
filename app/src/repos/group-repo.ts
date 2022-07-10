import { Group } from "../models/group";

export async function getGroupById(id: number): Promise<Group | null> {
    let group = await Group.findOne({
        where: {
            id: id
        }
    });

    if (!group) return null;

    return group;
}