import request from "request";
import constant from '../utils/constant';

const setOptions = (body: any) => ({
    headers: {
      "Content-type": "application/json",
      Authorization: constant.mail.accessToken
    },
    url: constant.mail.url,
    body: JSON.stringify(body),
  });

export default (subject: any, html: any, recipients: any, headers: any, inlineImages: any, attachments: any, configs: { senderEmail: any; senderName: any; }) => {
    const content = {
        from: {
            email: (configs && configs.senderEmail) ? configs.senderEmail : constant.mail.fromEmail,
            name: (configs && configs.senderName) ? configs.senderName : constant.mail.fromName
        },
        subject,
        html,
        headers,
        inline_images: inlineImages,
        attachments
    };
    
    const options = setOptions({
        content,
        recipients
    });

    return new Promise((resolve, reject) => {
      request.post(options, (err: any, body: any) => {
        if (err) {
            console.log(err);
            return resolve(err);
        } else {
            console.log(body);
            resolve(body)
        }
        resolve({});
      });
    });
}