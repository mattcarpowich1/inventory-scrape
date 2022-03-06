import { gql } from 'graphql-request';
import client from './graphClient';
import { Vendor } from './generated/graphql';

interface VendorsQueryResponse {
    vendors: Vendor[]
}

export const getVendorsQuery = gql`
    query getVendors{
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

const getVendors = async (): Promise<Vendor[]> => {
    try {
        const data: VendorsQueryResponse = await client.request(getVendorsQuery);
        return data.vendors;
    } catch (e: unknown) {
        throw new Error(`Error querying vendors: ${e as string}`);
    }
};

export default getVendors;
