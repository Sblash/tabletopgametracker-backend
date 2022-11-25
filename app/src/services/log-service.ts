import { Page } from "../models/page";
import { Game } from "../models/game";
import { Group } from "../models/group";
import { User } from "../models/user";
import { Element } from "../models/element";
import { Data } from "../models/data";
import { Log } from "../models/log";

export async function logUser(user: User, action: string) {
    let message: string = "User " + user.username + " created.";

    let log = Log.create({
        user_id: user.id,
        action: action,
        message: message
    });

    return log;
}

export async function logGroup(user: User, group: Group, action: string) {
    let username = user.username;
    let message: string = username + " " + action + " group " + group.name;

    let log = Log.create({
        user_id: user.id,
        group_id: group.id,
        action: action,
        message: message
    });

    return log;
}

export async function logGame(user: User, game: Game, action: string) {
    let username: string = user.username;
    let message: string = username + " " + action + " game " + game.name;

    let log = Log.create({
        user_id: user.id,
        game_id: game.id,
        action: action,
        message: message
    });

    return log;
}

export async function logPage(user: User, page: Page, action: string) {
    let username: string = user.username;
    let message: string = username + " " + action + " page " + page.name;

    let log = Log.create({
        user_id: user.id,
        page_id: page.id,
        action: action,
        message: message
    });

    return log;
}

export async function logElement(user: User, element: Element, action: string) {
    let username: string = user.username;
    let message: string = username + " " + action + " element " + element.name;

    let log = Log.create({
        user_id: user.id,
        element_id: element.id,
        action: action,
        message: message
    });

    return log;
}

export async function logData(user: User, data: Data, action: string) {
    let username: string = user.username;
    let message: string = username + " " + action + " data " + data.id;

    let log = Log.create({
        user_id: user.id,
        data_id: data.id,
        action: action,
        message: message
    });

    return log;
}