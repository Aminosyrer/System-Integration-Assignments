const { ApolloServer } = require('@apollo/server');
const express = require('express');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { gql } = require('graphql-tag');

const typeDefs = gql(fs.readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const authors = [
    { id: '1', name: 'Author One' },
    { id: '2', name: 'Author Two' },
];

const books = [
    { id: '1', title: 'Book One', releaseYear: 2001, authorId: '1' },
    { id: '2', title: 'Book Two', releaseYear: 2002, authorId: '2' },
];

const resolvers = {
    Query: {
        books: () => books,
        book: (parent, args) => books.find(book => book.id === args.id),
        authors: () => authors,
        author: (parent, args) => authors.find(author => author.id === args.id),
    },
    Mutation: {
        createBook: (parent, args) => {
            const newBook = { id: uuidv4(), ...args };
            books.push(newBook);
            return newBook;
        },
        updateBook: (parent, args) => {
            const bookIndex = books.findIndex(book => book.id === args.id);
            if (bookIndex === -1) return null;
            const updatedBook = { ...books[bookIndex], ...args };
            books[bookIndex] = updatedBook;
            return updatedBook;
        },
        deleteBook: (parent, args) => {
            const bookIndex = books.findIndex(book => book.id === args.id);
            if (bookIndex === -1) return null;
            books.splice(bookIndex, 1);
            return { message: 'Book deleted successfully' };
        },
    },
    Book: {
        author: (parent) => authors.find(author => author.id === parent.authorId),
    },
    Author: {
        books: (parent) => books.filter(book => book.authorId === parent.id),
    },
};

const startServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    app.use(cors());
    app.use('/graphql', json(), expressMiddleware(server));

    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000/graphql`)
    );
};

startServer();