import { Structure, Element as StructureElement } from "src/interfaces/Structure";
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
                let element_slug = structure.rows[r].cols[c].elements[e].slug;

                let element: Element | null;
                
                //check if already exists first
                element = await Element.findOne({
                    where: {
                        slug: element_slug,
                        page_id: page.id
                    }
                });

                if (!element) {
                    element = await Element.create({
                        name: structure.rows[r].cols[c].elements[e].name,
                        type: structure.rows[r].cols[c].elements[e].type,
                        slug: element_slug,
                        page_id: page.id
                    });

                    elements.push(element);
                }
            }
        }
    }

    return elements;
}

export async function updateElementsFromStructure(page_slug:string, structure: Structure) {
    const page: any = await Page.findOne({
        where: {
            slug: page_slug
        }
    });

    let existing_element: Array<Element> = [];

    existing_element = await Element.findAll({
        where: {
            page_id: page.id
        }
    });

    let structure_elements: Array<StructureElement> = [];

    for (let r = 0; r < structure.rows.length; r++) {
        for (let c = 0; c < structure.rows[r].cols.length; c++) {
            for (let e = 0; e < structure.rows[r].cols[c].elements.length; e++) {
                structure_elements.push(structure.rows[r].cols[c].elements[e]);
            }
        }
    }

    //ee stands for existing_element
    for (let ee = 0; ee < existing_element.length; ee++) {
        for (let se = 0; se < structure_elements.length; se++) {
            const element_slug = structure_elements[se].slug;

            if (element_slug == existing_element[ee].slug) {
                existing_element[ee].update({
                    name: structure_elements[se].name
                });
                break;
            }
        }
    }
}

export async function deleteElementsFromStructure(page_slug:string, structure: Structure) {
    const page: any = await Page.findOne({
        where: {
            slug: page_slug
        }
    });

    let existing_element: Array<Element> = [];

    existing_element = await Element.findAll({
        where: {
            page_id: page.id
        }
    });
    
    let structure_elements: Array<StructureElement> = [];

    for (let r = 0; r < structure.rows.length; r++) {
        for (let c = 0; c < structure.rows[r].cols.length; c++) {
            for (let e = 0; e < structure.rows[r].cols[c].elements.length; e++) {
                structure_elements.push(structure.rows[r].cols[c].elements[e]);
            }
        }
    }

    //ee stands for existing_element
    for (let ee = 0; ee < existing_element.length; ee++) {
        let to_remove = true;

        for (let se = 0; se < structure_elements.length; se++) {
            const element_slug = structure_elements[se].slug;

            if (element_slug == existing_element[ee].slug) {
                to_remove = false;
                break;
            }
        }

        if (to_remove) {
            await Element.destroy({
                where: {
                    page_id: page.id,
                    slug: existing_element[ee].slug
                }
            });
        }
    }
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