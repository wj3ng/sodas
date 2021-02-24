import * as argon2 from 'argon2'

export interface User {
    email: string;
    password: string;
    cart: {
        [item: number]: number;
    };
}

export const CreateUser = async (email: string, password: string): Promise<User> => {

    const hashedPassword = await argon2.hash(password)

    const newUser: User = {
        email,
        password: hashedPassword,
        cart: {},
    }

    return newUser
}