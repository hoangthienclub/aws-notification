import multipart from "../lib/multipart";
import { getVariables } from "../utils/helpers";

export default async (event: any, context: any) => {
  if (!process.env.DBPASSWORD ||
    !process.env.PUSH_NOTIFICATION_KEY ||
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.GOOGLE_API_KEY
  ) {
    const variables = await getVariables();
    console.log("variables:", variables)
    process.env = Object.assign({}, process.env, variables);
  }

  if (event.requestContext && event.requestContext.authorizer) {
    const claims =
      event.requestContext.authorizer.claims ?? event.requestContext.authorizer;
    event.currentUser = {
      username: claims["cognito:username"],
      userId: claims["custom:user_id"],
      user_id: claims["custom:user_id"],
      familyName: claims.family_name,
      givenName: claims.given_name,
      phone: claims["custom:phone"],
      email: claims.email,
    };
  }

  if (event.body && typeof event.body === "string") {
    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"];
    if (contentType.includes("multipart/form-data")) {
      var boundary = multipart.getBoundary(contentType);
      event.body = multipart.parse(event.body, boundary);
    } else {
      event.body = JSON.parse(event.body);
    }
  }

  if (event.path && typeof event.path !== "string") {
    event.params = JSON.parse(JSON.stringify(event.path));
  } else if (event.pathParameters) {
    event.params = JSON.parse(JSON.stringify(event.pathParameters));
  } else {
    event.params = {};
  }

  if (event.queryStringParameters) {
    event.query = JSON.parse(JSON.stringify(event.queryStringParameters));
  }

  if (!event.query) {
    event.query = {}
  }

  if (event.headers) {
    if (event.headers.accesstoken) {
      event.headers.AccessToken = event.headers.accesstoken;
    }
    if (event.headers.platformtype) {
      event.headers.platformType = event.headers.platformtype;
    }
    if (!event.headers.language) {
      event.headers.language = "en-US";
    }
    if (event.headers.isTabletUser == "true" || event.headers.istabletuser == "true") {
      event.headers.isTabletUser = true;
    }
  }


  console.log("Headers: ", JSON.stringify(event.headers));
  console.log("Parameters: ", JSON.stringify(event.params));
  console.log("Query: ", JSON.stringify(event.query));
  console.log("Body: ", JSON.stringify(event.body));
  console.log("Current User", JSON.stringify(event.currentUser));

  return { event, context };
};
