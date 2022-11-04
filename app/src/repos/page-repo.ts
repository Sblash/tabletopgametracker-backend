import { Page } from "../models/page";

export async function getPageById(id: number): Promise<Page | null> {
    let page = await Page.findOne({
        where: {
            id: id
        }
    });

    if (!page) return null;

    return page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    let page = await Page.findOne({
        where: {
            slug: slug
        }
    });

    if (!page) return null;

    return page;
}