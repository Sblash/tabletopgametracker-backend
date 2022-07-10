import { User } from "../models/user";

export async function getUserByTelegramId(id: number): Promise<User | null> {
    let user = await User.findOne({
        where: {
            telegram_id: id
        }
    });

    if (!user) return null;

    return user;
}