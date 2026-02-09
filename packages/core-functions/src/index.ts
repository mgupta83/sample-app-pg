import type { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import type { TimeProvider } from "@app/interfaces";
import { ISOTimeProvider } from "@app/time-impl";

const timeProvider: TimeProvider = new ISOTimeProvider();

export async function timeHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const serverTime = timeProvider.getServerTime();
  const response: HttpResponseInit = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serverTime,
      message: "ok",
    }),
  };

  // Set context.res as required by Functions v4 host model
  context.res = response;

  return response;
}
