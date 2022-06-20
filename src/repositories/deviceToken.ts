import db from "../core/db";

const updateDeviceToken = async (userId: any, connectionId: any) => {
    return db.query(`update device_token set token = $2 where user_id = $1 and device_type = 2 and token like 'clover@@%'`, [userId, `clover@@${connectionId}`]);
}

export default {
    updateDeviceToken
}