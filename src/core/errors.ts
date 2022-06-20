import { getMessages } from "../locales";
import constant from "../utils/constant";

class GeneralError extends Error {
  message: string;
  key?: string;
  code?: string | number;
  details?: any[];
  constructor({
    message,
    key,
    code,
    details,
  }: {
    message?: string;
    key?: string;
    code?: string | number;
    details?: any[];
  }) {
    super();
    this.message = message || "";
    this.key = key;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends GeneralError {
  name: string = "Validation Error";
  constructor({
    key,
    code,
    details,
  }: {
    key: string;
    code?: string;
    details?: any[];
  }) {
    super({ key, code });
    this.details = details;
  }
}

export class BusinessError extends GeneralError {
  messageDetail: any;
  data: any;
  constructor(key: string, code?: number, messageDetail?: any, details?: any[], data?: any) {
    super({ key, details, code });
    this.messageDetail = messageDetail;
    this.data = data;
  }
}

export class TechError extends GeneralError {
  constructor(error: any) {
    // let message;
    // if (
    //     error instanceof Error ||
    //     error instanceof EvalError ||
    //     error instanceof ReferenceError ||
    //     error instanceof TypeError ||
    //     error instanceof SyntaxError ||
    //     error instanceof RangeError
    // ) {
    //     errorMessage = generalMessage;
    // }
    // else if( typeof error == "string") {
    //     errorMessage = messages[error] || generalMessage;
    // }
    // else {
    //     errorMessage = error.message || generalMessage;
    // }
    super({ key: constant.generalMessageKey });
  }
}

export class DBError extends GeneralError {
  messageDetail: any;
  constructor({
    message,
    code,
    detail,
  }: {
    message: string;
    code: string;
    detail?: string;
  }) {
    const params: any = {};
    if (code && message && code === constant.dbErrorCode.returnDetail) {
      if (detail) {
        detail
          .split("&")
          .map((item: any) => item.trim())
          .forEach((element: string) => {
            const keyValue = element
              .split("=")
              .map((item: string) => item.trim());
            params[keyValue[0]] = keyValue[1];
          });
      }
    }
    super({ key: message });
    this.messageDetail = params;
  }
}
