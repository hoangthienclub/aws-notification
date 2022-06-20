import { deviceTokenRepository } from "../repositories";
import webSocket from '../lib/webSocket';

const reconnect = async (event: any) => {
    const body = JSON.parse(event.body);
    if (body.data && body.data.userId) {
        const userId = body.data.userId;
        const connectionId = event.requestContext ? event.requestContext.connectionId : '';
        await deviceTokenRepository.updateDeviceToken(userId, connectionId)
    }
    return;
}
const defaultAction = async (connectionId: any) => {
    await webSocket.sendMessage('message', { connectionId }, [connectionId]);
    return;
}

export default {
    reconnect,
    defaultAction
}