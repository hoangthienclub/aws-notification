import db from "./db";
import { success, failure, redirect } from "./response";
import constant from "../utils/constant";
const errorCodeMapping: any = constant.errorCodeMapping;
import { getMessages } from "../locales";

const mapError = (error: any, language: string, code?: any) => {
  const messages: { [key: string]: any } = getMessages(language);
  let message = messages[error.key || constant.generalMessageKey];
  let details;
  const data = error.data;
  code = code ?? error.code ?? errorCodeMapping[error.key] ?? null;
  //map detail
  try {
    if (error.messageDetail) {
      Object.keys(error.messageDetail).forEach((element: any) => {
        message = message.replace(`<${element}>`, error.messageDetail[element]);
      });
    }
    if (error.details) {
      details = error.details.map(
        ({
          key: eleKey,
          message: eleMessage,
          messageDetail: eleMessageDetail,
        }: {
          key: string;
          message: string;
          messageDetail: any;
        }) => {
          let eleNewMessage = messages[eleMessage] || eleMessage;
          //map ele detail
          if (eleMessageDetail) {
            Object.keys(eleMessageDetail).forEach((element: any) => {
              eleNewMessage = eleNewMessage.replace(
                `<${element}>`,
                eleMessageDetail[element]
              );
            });
          }
          return {
            key: eleKey,
            message: eleNewMessage,
          };
        }
      );
    }
  } catch (err) {
  }
  if (!message) {
    message = messages[constant.generalMessageKey];
  }
  return { message, details, code, data };
};

export const postFailProcess = async (
  error: any,
  event: any,
  context: any,
  callback: any
) => {
  let errorObj;
  const { message, details, code, data } = mapError(
    error,
    event.headers?.language ?? constant.defaultLanguage
  );
  errorObj = { message, details: details ? details : undefined };
  if (db.connected) {
    await db.shouldAbort();
    await db.close();
  }
  const debugCode = process.env.ENABLE_ERROR_CODE == 'true' ? null : `${process.env.SERVICE_CODE}-${process.env.API_CODE}`;

  failure(`${errorObj.message}${debugCode ? ` CODE: ${debugCode}` : ''}`, errorObj.details, callback, code, data, 200, debugCode);
};

export const postSuccessProcess = async (
  result: any,
  event: any,
  context: any,
  callback: any
) => {
  if (db.connected) {
    await db.commit();
    await db.close();
  }
  console.log('result:', result)
  if (result?.redirectUrl) {
    redirect(result, callback);
  }
  success(result, callback);
};

export const commitAndClose = async() => {

  if (db.connected) {
      await db.commit();
      await db.close();
  }
}