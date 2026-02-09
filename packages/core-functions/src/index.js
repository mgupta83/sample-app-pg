import { ISOTimeProvider } from "@app/time-impl";
const timeProvider = new ISOTimeProvider();
export async function timeHandler(request, context) {
  context.log("HTTP trigger function processed a request.");
  const serverTime = timeProvider.getServerTime();
  const response = {
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
//# sourceMappingURL=index.js.map
