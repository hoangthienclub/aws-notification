import { notificationJournalRepository } from "../repositories";

const insertNotification = async (event: any) => {
    const body = event.body;
    const userId = event.currentUser.user_id || null;
    const app = event.headers.platformtype;
    const userEngagement = body.userEngagement ? body.userEngagement : false;

    let messageId = null;
    let notificationPayload = null;
    let service = null;
    let triggeredAt = null;

    if (body.notificationPayload) {
        notificationPayload = body.notificationPayload;

        if (body.notificationPayload.data) {
            messageId = body.notificationPayload.data.messageId;
            service = body.notificationPayload.data.service;
            triggeredAt = body.notificationPayload.data.triggeredAt
        }
    }

    await notificationJournalRepository.insert(
        userId,
        messageId, 
        app,
        userEngagement,
        notificationPayload,
        service,
        triggeredAt
    );

    return;
}

export default {
    insertNotification
}