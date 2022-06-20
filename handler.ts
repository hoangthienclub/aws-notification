import preProcess from "./src/core/preProcess";
import { postFailProcess, postSuccessProcess } from "./src/core/postProcess";
import notificationController from "./src/controllers/notification";

const controllers = [notificationController];
const handlers: { [key: string]: any } = {};
controllers.forEach((contrl: { [key: string]: any }) => {
  Object.keys(contrl).forEach((func: any) => {
    handlers[func] = (event: any, context: any, callback: any) => {
      (async () => {
        try {
          ({ event, context } = await preProcess(event, context));
          let res;
          if (event.headers && event.headers.preWarmed) {
            res = {}
          }
          else {
            res = await contrl[func](event, context);
          }
          await postSuccessProcess(res, event, context, callback);
        } catch (error) {
          console.log("call api error", error);
          await postFailProcess(error, event, context, callback);
        }
      })();
    };
  });
});

module.exports = handlers;