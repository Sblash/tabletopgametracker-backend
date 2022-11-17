import { Game } from "../models/game";
import { Group } from "../models/group";
import { User } from "../models/user";
import { User as UserInterface } from '../interfaces/User';
import { UserGroup } from "../models/user-group";
import { getSlug, sanitizeText, validate } from "../services/base-service";

export async function createGroup(name: string, user: User, profile_pic: string) {
    const created_by: number = user.id;
    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 15 characters."); 

    let slug: string = getSlug(name);

    let group = await Group.create({
        name: name,
        slug: slug,
        profile_pic: profile_pic,
        created_by: created_by
    });

    //add the owner to members
    group.$add("user", user);

    return group;
}

export function updateGroup(group: Group, name: string, profile_pic: string) {
    name = sanitizeText(name);

    if (!validate(name)) throw new Error("The name exceeds the limit of 15 characters."); 
    
    group.update({
        name: name,
        profile_pic: profile_pic
    });

    return group;
}

export function getGroups(user: User) {
    // return Group.findAll();
    //return all groups where the user is a member
    return user.$get("groups");
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

export async function updateMembers(group: Group, members: Array<UserInterface>) {
    //for new members
    for (let i = 0; i < members.length; i++) {
        let member: User | null = await User.findOne({
            where: {
                id: members[i].id
            },
        });

        if (!member) continue;

        let is_member_in_group: UserGroup | null = await UserGroup.findOne({
            where: {
                user_id: member.id,
                group_id: group.id
            }
        })

        if (is_member_in_group) continue;

        group.$add("user", member);
    }

    let existing_members = group.users;

    for (let em = 0; em < existing_members.length; em++) {
        let to_delete = true;
        
        for (let m = 0; m < members.length; m++) {
            if (existing_members[em].id == members[m].id) {
                to_delete = false;
                break;
            }
        }

        if (to_delete) {
            group.$remove("user", existing_members[em]);
        }
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