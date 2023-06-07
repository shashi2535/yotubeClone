import { userSingup } from '../controller/user.controller';

const userResolver = {
    Query: {
        books: () => 'hello world',
        userData: () => {
            const userData = [
                {
                    id: 1,
                    name: 'user1',
                    email: 'user1@yopmail.com',
                },
                {
                    id: 2,
                    name: 'user2',
                    email: 'user2@yopmail.com',
                },
                {
                    id: 3,
                    name: 'user3',
                    email: 'user3@yopmail.com',
                },
                {
                    id: 4,
                    name: 'user4',
                    email: 'user4@yopmail.com',
                },
            ];
            return userData;
        },
    },
    Mutation: {
        createUser: userSingup,
    },
};

export { userResolver };
