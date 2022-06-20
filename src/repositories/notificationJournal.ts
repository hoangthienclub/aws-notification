import db from "../core/db";

const insert = async (
        userId: any,
        messageId: any, 
        app: any,
        userEngagement: any,
        notificationPayload: any,
        service: any,
        triggeredAt: any
    ) => {
    return db.query(`INSERT INTO public.notification_journal(
                user_id, message_id, app, user_engagement, payload, service, triggered_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [
                userId,
                messageId, 
                app,
                userEngagement,
                notificationPayload,
                service,
                triggeredAt ? new Date(triggeredAt * 1000) : null
            ])
}

export default {
    insert
}