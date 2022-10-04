import { Element } from "../models/element";

export async function getElementById(id: number): Promise<Element | null> {
    let element = await Element.findOne({
        where: {
            id: id
        }
    });

    if (!element) return null;

    return element;
}