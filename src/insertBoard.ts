import { gql } from 'graphql-request';
import client from './graphClient';
import { BoardInput } from './generated/graphql';

type InsertBoardFunction = (input: BoardInput) => Promise<void>;

export const insertBoardMutation = gql`
    mutation insertBoard($input: boards_insert_input!) {
        insert_boards_one(object: $input)
        {
            id
        }
    }
`;

const insertBoard: InsertBoardFunction = async (input: BoardInput) => {
    try {
        await client.request(insertBoardMutation, { input });
    } catch (e: unknown) {
        throw new Error(`Error inserting board ${input.title}: ${e as string}`);
    }
};

export default insertBoard;
