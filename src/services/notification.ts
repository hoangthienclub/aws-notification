import webSocket from '../lib/webSocket';
import pushNotify from '../lib/notify';
import constant from '../utils/constant';
import sendMail from '../lib/mail';

const pushMessage = async (data: any, recipients: any) => {
    const connectionIds: any[] = [];
    const tokens: any[] = [];
    recipients.filter((recipient: any) => !!recipient).forEach((recipient: string) => {
        if (recipient.startsWith('clover@@')) {
            connectionIds.push(recipient.replace('clover@@', ''));
        }
        else {
            tokens.push(recipient)
        }
    })
    if (connectionIds.length > 0) {
        await webSocket.sendMessage('notification', data, connectionIds)
    }
    if (tokens.length > 0) {
        await pushNotify(data, tokens)
    }
    return;
}

const notification = async (records: any) => {
    records.forEach(async (record: any) => {
        const bodyData = JSON.parse(record.body);
        const dataMsg = JSON.parse(bodyData.Message);
        console.log('dataMsg: ', dataMsg)
        const {
            type,
            subject,
            body,
            recipients,
            inlineImages,
            headers,
            attachments,
            configs
        } = dataMsg;
        switch (type) {
            case constant.type.EMAIL:
                await sendMail(subject, body, recipients, headers, inlineImages, attachments, configs)
                break;
            case constant.type.NOTIFY:
                await pushMessage(body, recipients)
                break;
            case constant.type.SMS:
                // await sendSMS(body, recipients);
                break;
        }

    });
    return;
}

export default {
    pushMessage,
    notification
}