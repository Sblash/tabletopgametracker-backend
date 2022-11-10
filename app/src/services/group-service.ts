import { Game } from "../models/game";
import { Group } from "../models/group";
import { User } from "../models/user";
import { User as UserInterface } from '../interfaces/User';

export async function createGroup(name: string, user: User) {
    const created_by: number = user.id;
    let slug: string = getSlug(name);

    let group = await Group.create({
        name: name,
        slug: slug,
        created_by: created_by
    });

    //add the owner to members
    group.$add("user", user);

    return group;
}

export function updateGroup(group: Group, name: string) {
    group.update({
        name: name
    });

    return group;
}


export async function addMembers(group: Group, members: Array<UserInterface>) {
    for (let i = 0; i < members.length; i++) {
        let member: User | null = await User.findOne({
            where: {
                id: members[i].id
            }
        });

        if (!member) continue;

        group.$add("user", member);
    }
}

export function getGroupBySlug(slug: string) {
    return Group.findOne({
        where: {
            slug: slug
        },
        include: Game
    });
}

export function deleteGroup(group_id: number) {
    return Group.destroy({
        where: {
            id: group_id
        }
    });
}

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace(/ /gi, "_");

    return slug;
}