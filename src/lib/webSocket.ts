import AWS from "aws-sdk";
import constants from '../utils/constant';

const mapData = (type: any, data: { data: any; }) => {
    return {
        type,
        data: {
            ...data,
            data: data.data ? JSON.stringify(data.data) : undefined,
            json: JSON.stringify({
                ...data,
                data: data.data ? JSON.stringify(data.data) : undefined
            })
        }
    }
}

export default {
    sendMessage: async (type: string, data: any, connectionIds: any[]) => {
        if (type == 'notification'){
            data = mapData(type, data)
        }
        const apiGateway = new AWS.ApiGatewayManagementApi({
            endpoint: constants.endPointSocket
        });
        const promises: any[] = [];
        connectionIds.forEach((connectionId: any) => {
            promises.push(new Promise((resolve, reject) => {
                apiGateway.postToConnection({
                    ConnectionId: connectionId,
                    Data: JSON.stringify(data)
                }, (err, data) => {
                    if (err) {
                        console.log('error', err);
                        resolve(err);
                    }
                    else {
                        resolve(data);
                    }
                })
            }))
        })
        await Promise.all(promises)
    }
}