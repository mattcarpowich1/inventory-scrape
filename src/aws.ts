import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

export const sendSmsMessage = async (phoneNumber: string, message: string): Promise<void> => {
    try {
        const params = {
            Message: message,
            PhoneNumber: phoneNumber,
        };
        const publishTextPromise = new AWS.SNS({}).publish(params).promise();
        await publishTextPromise;
    } catch (e: unknown) {
        throw new Error(`Error sending sns text message: ${e as string}`);
    }
};

export default AWS;
