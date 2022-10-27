import { v1 } from "@google-cloud/pubsub";

export const getEarliestStartDate = async (subscriptionName: string): Promise<Date | null> => {
  const subscriptionClient = new v1.SubscriberClient();
  const [response] = await subscriptionClient.pull({ subscription: subscriptionName });
  const ackIds: string[] = [];
  let earliestStartDate: Date | null = null;

  // Find the earliest start date in all of the pulled messages
  if (response.receivedMessages) {
    response.receivedMessages.forEach(message => {
      if (!message.message) return;

      const rawData = message.message.data;
      if (typeof rawData !== "string") {
        throw new Error(`getEarliestStartDate: unsure how to handle message data of type ${typeof rawData}`);
      }

      const dataObject = JSON.parse(Buffer.from(rawData, "base64").toString());
      if (!dataObject.startDate) {
        console.log(
          `getEarliestStartDate: did not find startDate on message. Skipping.\nMessage: ${JSON.stringify(dataObject)}`,
        );
        return;
      }

      const messageStartDate = new Date(dataObject.startDate);
      if (!earliestStartDate || earliestStartDate > messageStartDate) {
        console.log(`getEarliestStartDate: Setting earliestStartDate to ${dataObject.startDate}`);
        earliestStartDate = messageStartDate;
      }

      if (!message.ackId) return;

      ackIds.push(message.ackId);
    });
  }

  // Send the acknowledgement
  if (ackIds.length > 0) {
    await subscriptionClient.acknowledge({ subscription: subscriptionName, ackIds: ackIds });
  }

  return earliestStartDate;
};
