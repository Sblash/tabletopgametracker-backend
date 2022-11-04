import { Structure } from "src/interfaces/Structure";
import { Element } from "../models/element";
import { Page } from "../models/page";

export async function createElement(name: string, type: string, page_slug: string) {
    const page: any = await Page.findOne({
        where: {
            slug: page_slug
        }
    });

    let slug: string = getSlug(name);

    let element = Element.create({
        name: name,
        slug: slug,
        type: type,
        page_id: page.id
    });

    return element;
}

export async function createElementsFromStructure(page_slug:string, structure: Structure) {
    const page: any = await Page.findOne({
        where: {
            slug: page_slug
        }
    });

    let elements: Array<Element> = [];

    for (let r = 0; r < structure.rows.length; r++) {
        for (let c = 0; c < structure.rows[r].cols.length; c++) {
            for (let e = 0; e < structure.rows[r].cols[c].elements.length; e++) {
                let element = await Element.create({
                    name: structure.rows[r].cols[c].elements[e].name,
                    type: structure.rows[r].cols[c].elements[e].type,
                    slug: getSlug(structure.rows[r].cols[c].elements[e].name),
                    page_id: page.id
                });
                elements.push(element);
            }
        }
    }

    return elements;
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