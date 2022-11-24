import { Game } from "@models/game";
import { User } from "@models/user";
import { Page } from "../models/page";
import { Op } from 'sequelize';

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

export async function getPagesByUserAndGame(user: User, game: Game): Promise<Array<Page> | null> {
    return Page.findAll({
        where: {
            // is_private: false,
            game_id: game.id,
            [Op.or]: [
                {
                    is_private: false
                },
                {
                    is_private: true,
                    created_by: user.id
                }
            ]
        }
    });
}