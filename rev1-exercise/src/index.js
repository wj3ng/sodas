const argon2 = require('argon2')

const users = []

const newUser = (firstName, lastName, email, password, books) => {

    const hashedPassword = await argon2.hash(password)

    return {
        'id': Date.now(),
        firstName,
        lastName,
        email,
        'password': hashedPassword,
        books,
    }

}

const books = []

const newBook = (bookName, isbn13, price, author, year) => {

    return {
        'name': bookName,
        isbn13,
        price, 
        author,
        year,
    }

}