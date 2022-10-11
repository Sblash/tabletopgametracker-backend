import { Group } from "../models/group";

export function createGroup(name: string, created_by: number) {
    let slug: string = getSlug(name);

    let group = Group.create({
        name: name,
        slug: slug,
        created_by: created_by
    });

    return group;
}

export function updateGroup(group: Group, name: string) {
    group.update({
        name: name
    });

    return group;
}

export function getGroups() {
    return Group.findAll();
}

export function getGroupBySlug(slug: string) {
    return Group.findOne({
        where: {
            slug: slug
        }
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
    slug = slug.replace("/ /gi", "_");

    return slug;
}