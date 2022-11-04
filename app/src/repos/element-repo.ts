import { Element } from "../models/element";
import { Data } from "../models/data";

export async function getElementById(id: number): Promise<Element | null> {
    let element = await Element.findOne({
        where: {
            id: id
        }
    });

    if (!element) return null;

    return element;
}

export async function getElementBySlug(slug: string): Promise<Element | null> {
    let element = await Element.findOne({
        where: {
            slug: slug
        },
        include: Data
    });

    if (!element) return null;

    return element;
}