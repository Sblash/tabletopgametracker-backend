import { Element } from "../models/element";

export function createElement(name: string, page_id: number) {
    let slug: string = getSlug(name);

    let page = Element.create({
        name: name,
        slug: slug,
        page_id: page_id
    });

    return page;
}

export function updateElement(element: Element, name: string) {
    element.update({
        name: name
    });

    return element;
}

export function getElements() {
    return Element.findAll();
}

export function deleteElement(element_id: number) {
    return Element.destroy({
        where: {
            id: element_id
        }
    });
}

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace(/ /gi, "_");

    return slug;
}