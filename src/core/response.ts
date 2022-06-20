const success = (
  data: any,
  callback: any,
  responseCode = 200,
  statusCode = 200
) => {
  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Success",
      code: responseCode,
      data,
    }),
  };
  console.log("response", response);
  callback(null, response);
};
const failure = (
  error: any,
  callback: any,
  errorCode = 500,
  statusCode = 200,
  debugCode: any = null,
  errorDetail?: any,
  data?: any,
) => {
  console.log("Error: ", error);
  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    },
    body: JSON.stringify({
      message: error,
      code: errorCode || 500,
      data,
      errors: errorDetail,
      debugCode
    }),
  };
  callback(null, response);
};
const redirect = (
  data: any,
  callback: any,
) => {
  const url = data.redirectUrl;
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Location": url
    },
  };
  console.log("response", response);
  callback(null, response);
};

export { success, failure, redirect };
