import AWS from 'aws-sdk';
import constant from "./constant";

export const getVariables = () => {
  const client = new AWS.SecretsManager();

  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: constant.secretName }, (err: any, data: any) => {
      let res = {}
      if (err) {
        console.log('err', err)
      }
      else {
        if ('SecretString' in data) {
          res = JSON.parse(data.SecretString);
        }
      }
      resolve(res)
    });
  })
}