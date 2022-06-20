import { journalService, notificationService, webSoketService } from "../services";

export default {
    notification: async (event: any, context : any) => {
        console.log('event: ', event)
        return notificationService.notification(event.Records)
    },
    connectWebSocket: async (event: any, context: any) => {
        console.log('event', event)
        return event.requestContext ? event.requestContext.connectionId : '';
    },
    disconnectWebSocket: async (event: any, context: any) => {
        console.log('event', event)
        return;
    },
    sendMessageWebSocket: async (event: any, context: any) => {
        console.log('event', event)
        return;
    },
    defaultActionWebSocket: async (event: any, context: any) => {
        console.log('event', event)
        const connectionId = event.requestContext ? event.requestContext.connectionId : '';
        await webSoketService.defaultAction(connectionId)
        return connectionId;
    },
    reconnectWebSocket: async (event: any, context: any) => {
        console.log('event', event)
        if (event.body) {
            await webSoketService.reconnect(event);
        }
        return;
    },
    notificationJournal: async (event: any, context: any) => {
        console.log('event', event);
        return journalService.insertNotification(event)
    }
}