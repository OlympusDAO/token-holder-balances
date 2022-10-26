export const getPubSubMessage = (request: unknown): Record<string, string> => {
  if (!request) {
    return {};
  }

  if (!(<any>request).hasOwnProperty("body")) {
    return {};
  }

  const body = (<any>request).body;
  if (!body.hasOwnProperty("message")) {
    return {};
  }

  const dataString: unknown = body.message.data;
  if (typeof dataString !== "string") {
    return {};
  }

  return JSON.parse(Buffer.from(dataString, "base64").toString());
};
