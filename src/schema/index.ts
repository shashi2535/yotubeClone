import { userSchema } from './userSchema.graphql'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
// import path from "path"
// const allTypes = fileLoader(path.join(__dirname, '/**/*.graphql.ts'));
const typeDefs = mergeTypes([userSchema])

export { typeDefs }
