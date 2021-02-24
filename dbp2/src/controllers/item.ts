export interface Item {
    id: number;
    name: string;
    price: number;
    desc: string;
}

export const CreateItem = (id: number, name: string, price: number, desc: string): Item => {
    const newItem: Item = {
        id,
        name,
        price,
        desc,
    }
    return newItem
}