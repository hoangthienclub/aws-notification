export default {
    notifyService: {
        authorization: process.env.PUSH_NOTIFICATION_KEY,
        url: 'https://fcm.googleapis.com/fcm/send'
    },
    mail: {
        url: "https://api.sparkpost.com/api/v1/transmissions",
        fromEmail: "noreply@smtp.notification.app",
        fromName: "Notification",
        bcc: process.env.BCC_MAIL,
        prefix: process.env.PREFIX_MAIL,
        accessToken: ""
    },
    type: {
        EMAIL: 1,
        NOTIFY: 2,
        SMS: 3
    },
    secretName: "VARIABLES",
    twilioAccountSid: "",
    twilioToken: "",
    twilioPhone: "+",
    twilioKey: "",
    endPointSocket: process.env.ENDPOINT_SOCKET || 'dev-ws.notification.com/ws',
    badRequestMessageKey: "BAD_REQUEST",
    dbErrorCode: {
        returnDetail: 'P0001',
        returnGeneral: 'C0002'
    },
    errorCode: {
        syntaxError: 'S1',
        logicError: 'L1'
    },
    generalMessageKey: 'GENERAL_MESSAGE',
    gerneralErrorCodeInput: 'GENERAL_INPUT_MESSAGE',
    gerneralErrorCodeInputRequired: 'GENERAL_INPUT_REQUIRED_MESSAGE',
    errorCodeMapping: {},
    defaultLanguage: "en-US",
}