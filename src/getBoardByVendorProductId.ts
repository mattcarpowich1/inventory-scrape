import { gql } from 'graphql-request';
import client from './graphClient';

interface BoardQueryResponse {
    boards: number[]
}

export const getBoardsByVendorProductIdQuery = gql`
    query MyQuery($vendorId: Int!, $vendorProductId: String!) {
        boards(where: {_and: {vendorId: {_eq: $vendorId}, vendorProductId: {_eq: $vendorProductId}}}) {
            id
        }
}
`;

const getBoardsByVendorProductId = async (vendorId: number, vendorProductId: string): Promise<number[]> => {
    try {
        const data: BoardQueryResponse = await client.request(getBoardsByVendorProductIdQuery, {
            vendorId,
            vendorProductId,
        });
        return data.boards;
    } catch (e: unknown) {
        throw new Error(`Error querying boards by vendor product id: ${e as string}`);
    }
};

export default getBoardsByVendorProductId;
