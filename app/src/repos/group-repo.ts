import { User } from "../models/user";
import { Group } from "../models/group";
import { Game } from "../models/game";

export async function getGroupById(id: number): Promise<Group | null> {
    let group = await Group.findOne({
        where: {
            id: id
        },
        include: User
    });

    if (!group) return null;

    return group;
}

export function getGroupBySlug(slug: string) {
    return Group.findOne({
        where: {
            slug: slug
        },
        include: [
            Game,
            User
        ]
    });
}