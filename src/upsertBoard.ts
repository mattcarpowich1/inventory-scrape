import { gql } from 'graphql-request';
import client from './graphClient';
import { BoardInput } from './generated/graphql';

type InsertBoardFunction = (input: BoardInput) => Promise<void>;

export const upsertBoardMutation = gql`
    mutation insertBoard($input: boards_insert_input!) {
        insert_boards_one(object: $input, upsert: true)
        {
            id
        }
    }
`;

const upsertBoard: InsertBoardFunction = async (input: BoardInput) => {
    try {
        await client.request(upsertBoardMutation, { input });
    } catch (e: unknown) {
        throw new Error(`Error inserting board ${input.title}: ${e as string}`);
    }
};

export default upsertBoard;
