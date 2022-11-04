import { Element } from "../models/element";
import { Data } from "../models/data";

export async function createData(value: JSON, element_slug: string) {
    const element: any = await Element.findOne({
        where: {
            slug: element_slug
        }
    });

    let data = Data.create({
        value: value,
        element_id: element.id
    });

    return data;
}

export function updateData(data: Data, value: JSON) {
    data.update({
        value: value
    });

    return data;
}

export function deleteData(data_id: number) {
    return Data.destroy({
        where: {
            id: data_id
        }
    });
}