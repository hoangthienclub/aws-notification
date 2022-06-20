import constant from "../utils/constant";
const accountSid = constant.twilioAccountSid;
const authToken = constant.twilioToken;
import * as twilio from 'twilio';

const client = twilio(accountSid, authToken);

export default {
  sendSMS: (message: any, phones: any) => {
    return Promise.all(phones.map((phone: any) => {
        return new Promise((resolve, reject) => {
            client.messages
            .create({
                body: message,
                from: constant.twilioPhone,
                to: phone
            })
            .then((message: { sid: any; }) => {
                console.log('sent sms to', `${phone}`, ' message ', message)
                resolve(message.sid)
            }).catch(err => {
                console.log('cannot send sms', err);
                reject(err)
            });  
        })
    }))
  }
}