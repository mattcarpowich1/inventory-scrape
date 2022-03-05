import dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';

dotenv.config();

const client = new GraphQLClient(
    process.env.GRAPH_ENDPOINT,
    {
        headers: {
            'x-hasura-admin-secret': process.env.GRAPH_ADMIN_SECRET,
        },
    }
);

export default client;
