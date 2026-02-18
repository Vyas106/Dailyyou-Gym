import { sesClient } from './aws';
import { SendEmailCommand } from '@aws-sdk/client-ses';

export const sendEmail = async (to: string, subject: string, htmlBody: string) => {
    try {
        const command = new SendEmailCommand({
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: htmlBody,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: subject,
                },
            },
            Source: process.env.AWS_SES_FROM_EMAIL || 'noreply@dailyyou.com',
        });

        const response = await sesClient.send(command);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
