import { User } from '../models/user';
import { UserNotFoundError } from '@shared/errors';

export function createUser(username: string, telegram_id: number) {
    let user = User.create({
        username: username,
        telegram_id: telegram_id
    });

    return user;
}