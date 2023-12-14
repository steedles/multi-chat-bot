import { User } from "../types/user";
import { randomUUID } from "crypto";
import { Converter } from "aws-sdk/clients/dynamodb";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { Utils } from "../utils";
import { Session } from "../types/session";
import { BaseProvider } from "../providers/baseProvider";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import MessageService from "./messageService";

export default class SessionService {
  private client: DynamoDBClient;
  public static SESSION: Session;

  public async startSession(user: User, provider: BaseProvider) {
    this.client = new DynamoDBClient(Utils.getAWSConfig());
    const sessionId = randomUUID().toString();
    const now = new Date().toISOString();
    const expiry = new Date(new Date().getTime() + provider.sessionTTL).toISOString();

    const sessionData = {
      user_id: user.uuid,
      provider: provider.providerName,
      expiry_date: expiry,
      data: {
        messages: [],
      },
      date_created: now,
    };

    const input = {
      TableName: "sessions",
      Item: {
        uuid: { S: sessionId },
        ...Converter.marshall(sessionData),
      },
    };

    const session: Session = {
      uuid: sessionId,
      ...sessionData,
    };

    const command = new PutItemCommand(input);
    await this.client.send(command);

    SessionService.SESSION = session;
    return session;
  }

  public async getSessionById(
    sessionId: string,
    user: User,
    provider: BaseProvider
  ): Promise<Session> {
    this.client = new DynamoDBClient(Utils.getAWSConfig());

    const input = {
      TableName: "sessions",
      Key: {
        uuid: { S: sessionId },
      },
    };

    const command = new GetItemCommand(input);
    const response = await this.client.send(command);

    const session = Converter.unmarshall(response.Item) as Session;

    if (!session || session.user_id != user.uuid) {
      console.warn("Session not found. Creating new session", { sessionId: sessionId, user: user });
      return await this.startSession(user, provider);
    }

    const expiry = Date.parse(session.expiry_date);
    if (Date.now() > expiry) {
      console.info("Session expired. Creating new session", { session: session, user: user });
      return await this.startSession(user, provider);
    }

    SessionService.SESSION = session;
    return session;
  }

  public async getSessionByUserId(user: User, provider: BaseProvider): Promise<Session> {
    this.client = new DynamoDBClient(Utils.getAWSConfig());

    const params = {
      TableName: "sessions",
      IndexName: "user_id-index",
      KeyConditionExpression: `user_id=:user_id`,
      ExpressionAttributeValues: {
        ":user_id": { S: user.uuid },
      },
    };

    const command = new QueryCommand(params);
    const response = await this.client.send(command);
    const mapped = response.Items.map((item) => Converter.unmarshall(item) as Session);
    const sorted = mapped.sort((a, b) => Date.parse(b.date_created) - Date.parse(a.date_created));
    const session = sorted[0];

    if (!session || session.user_id != user.uuid) {
      console.warn("Session not found. Creating new session", { user: user });
      return await this.startSession(user, provider);
    }

    const expiry = Date.parse(session.expiry_date);
    if (Date.now() > expiry) {
      console.info("Session expired. Creating new session", { session: session, user: user });
      return await this.startSession(user, provider);
    }

    SessionService.SESSION = session;
    return session;
  }

  public async updateSessionState(response: BaseOutboundMessage, provider: BaseProvider) {
    this.client = new DynamoDBClient(Utils.getAWSConfig());
    const session = SessionService.SESSION;
    session.expiry_date = new Date(new Date().getTime() + provider.sessionTTL).toISOString();
    session.date_updated = new Date().toISOString();
    session.data.current_state = response.expected_user_response;
    session.data.current_state.menu_items = response.menu_items;
    session.data.messages.push({ message_id: MessageService.CURRENT_MESSAGE.uuid });

    return this.updateSession(session);
  }

  private async updateSession(session: Session) {
    const { uuid, ...rest } = session;

    const command = new PutItemCommand({
      TableName: "sessions",
      Item: {
        uuid: { S: uuid },
        ...Converter.marshall(rest),
      },
    });

    await this.client.send(command);
    SessionService.SESSION = session;
    return session;
  }

  public getHomeState() {
    return {
      target_page: "demo/HomePage",
      parameters: [
        {
          home: true,
        },
      ],
    };
  }
}
