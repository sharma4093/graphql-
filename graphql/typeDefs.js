import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

// if type: module ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefsArray = loadFilesSync(path.join(__dirname, '../modules/**/*.schema.gql'));

const typeDefs = mergeTypeDefs(typeDefsArray);
export default typeDefs
