import { Schema } from "joi"
import { ValidationError } from "./errors"
import constant from "../utils/constant";

export default (controller: any, schemas?: { [key: string]: Schema }) => async (req: any, context: any) => {
    if (schemas) {
        const details: any[] = [];
        Object.keys(schemas).forEach((key: string) => {
            const validationRes = schemas[key].validate(req[key], { abortEarly: false, allowUnknown: true });
            if (validationRes.error) {
                validationRes.error.details.forEach((ele: any) => {
                    details.push({
                        key: ele.context.key,
                        message: ele.message
                    })
                })
            }
        })
        if (details.length > 0) {
            throw new ValidationError({ key: constant.badRequestMessageKey, details });
        }
    }
    return await controller(req, context);
}