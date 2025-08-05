import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const typeDefsArray = loadFilesSync(
  path.join(__dirname, '../modules/**/*.typeDefs.{ts,js}')
);
const resolversArray = loadFilesSync(
  path.join(__dirname, '../modules/**/*.resolver.{ts,js}')
);

export const typeDefs = mergeTypeDefs(typeDefsArray);
export const resolvers = mergeResolvers(resolversArray);
