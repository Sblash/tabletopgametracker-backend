import { Page } from "../models/page";

export function createPage(name: string, game_id: number) {
    let slug: string = getSlug(name);

    let page = Page.create({
        name: name,
        slug: slug,
        game_id: game_id
    });

    return page;
}

export function updatePage(page: Page, name: string) {
    page.update({
        name: name
    });

    return page;
}

export function getPages() {
    return Page.findAll();
}

export function deletePage(page_id: number) {
    return Page.destroy({
        where: {
            id: page_id
        }
    });
}

function getSlug(value: string) {
    let slug = value.toLowerCase().trim();
    slug = slug.replace("/ /gi", "_");

    return slug;
}