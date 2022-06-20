import constant from '../utils/constant';
const url = constant.notifyService.url;
import { post } from 'request';

const setOptions = (body: { content_available: boolean; notification: any; data: { code: any; json: string; data: any; }; registration_ids: any; }) => ({
    headers: {
        'Content-type': 'application/json',
        'Authorization': `key=${process.env.PUSH_NOTIFICATION_KEY}`
    },
    url,
    body: JSON.stringify(body)
})

export default (data: { code: any; data: any; }, tokens: any) => {
    const body = {
        content_available: true,
        notification: data,
        data: {
            code: data.code,
            json: JSON.stringify(data),
            data: data.data
        },
        registration_ids: tokens
    }
    console.log(body)
    const options = setOptions(body)
    return new Promise((resolve, reject) => {
        post(options, (err, responseSub, bodySub) => {
            console.log('err: ', err)
            console.log('bodySub: ', bodySub)
            if (err) {
                console.log(err)
                return resolve(err);
            }
            resolve({})
        })
    })
}
