import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const init = async () => {
    const client = new GraphQLClient(
        process.env.GRAPH_ENDPOINT,
        {
            headers: {
                'x-hasura-admin-secret': process.env.GRAPH_ADMIN_SECRET,
            },
        }
    );

    const vendorsQuery = gql`
        {
            vendors {
                id
                title
                website
                logo
                streetAddress
                city
                state
                postalCode
                isActive
            }
        }
    `;

    const data: unknown = await client.request(vendorsQuery);
    console.log('data', data);
};

init()
    .then(() => console.log('yay'))
    .catch((e: unknown) => console.log('oh no!', e));
