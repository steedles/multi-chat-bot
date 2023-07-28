import { Message } from "../types/message";
import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import { randomUUID } from "crypto";
import SessionService from "./sessionService";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Converter } from "aws-sdk/clients/dynamodb";
import { Utils } from "../utils";

export default class MessageService {
  public static CURRENT_MESSAGE: Message;

  async logInboundMessage(inbound: BaseInboundMessage) {
    const uuid = randomUUID();
    MessageService.CURRENT_MESSAGE = {
      uuid: uuid,
      session_id: SessionService.SESSION.uuid,
      user_id: SessionService.SESSION.user_id,

      data: {
        inbound_message: inbound,
      },

      date_created: new Date().toISOString(),
    };

    await this.updateCurrentMessage();
  }

  async logOutboundMessage(outbound: BaseOutboundMessage) {
    MessageService.CURRENT_MESSAGE.data.outbound_message = outbound;
    await this.updateCurrentMessage();
  }

  private async updateCurrentMessage() {
    const client = new DynamoDBClient(Utils.getAWSConfig());
    const { uuid, ...rest } = MessageService.CURRENT_MESSAGE;

    const command = new PutItemCommand({
      TableName: "messages",
      Item: {
        uuid: { S: uuid },
        ...Converter.marshall(rest),
      },
    });

    await client.send(command);
  }
}
