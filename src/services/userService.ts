import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { User, UserState, UserUniqueIdentifier } from "../types/user";
import { Utils } from "../utils";
import { Converter } from "aws-sdk/clients/dynamodb";
import { randomUUID } from "crypto";

export default class UserService {
  private client: DynamoDBClient;

  public async getUserUniqueIdentifier(
    uniqueIdentifier: string,
    provider: string
  ): Promise<UserUniqueIdentifier> {
    this.client = new DynamoDBClient(Utils.getAWSConfig());

    const input = {
      TableName: "user_unique_identifiers",
      Key: {
        unique_identifier: { S: uniqueIdentifier },
        provider: { S: provider },
      },
    };

    const command = new GetItemCommand(input);

    const response = await this.client.send(command);
    const userUniqueIdentifier = Converter.unmarshall(response.Item) as UserUniqueIdentifier;

    if (userUniqueIdentifier.uuid) return userUniqueIdentifier;
    else return await this.createNewUser(uniqueIdentifier, provider);
  }

  private async createNewUser(
    uniqueIdentifier: string,
    provider: string
  ): Promise<UserUniqueIdentifier> {
    this.client = new DynamoDBClient(Utils.getAWSConfig());
    const now = new Date().toISOString();
    const userData = {
      data: {
        accessed_providers: [
          {
            provider_name: provider,
            unique_identifier: uniqueIdentifier,
            last_accessed: now,
          },
        ],
      },
      date_created: now,
      state: UserState.USER_ACTIVE,
    };

    const uuid = randomUUID().toString();

    const input = {
      TableName: "users",
      Item: {
        uuid: { S: uuid },
        ...Converter.marshall(userData),
      },
    };

    const user: User = {
      uuid: uuid,
      ...userData,
    };

    const command = new PutItemCommand(input);
    await this.client.send(command);

    return await this.createNewUserUniqueIdentifier(uniqueIdentifier, provider, user);
  }

  public async createNewUserUniqueIdentifier(
    uniqueIdentifier: string,
    provider: string,
    user: User
  ) {
    this.client = new DynamoDBClient(Utils.getAWSConfig());
    const uuid = randomUUID().toString();

    const uniqueIdentifierData = {
      user_id: user.uuid,
      provider: provider,
      unique_identifier: uniqueIdentifier,
      date_created: new Date().toISOString(),
    };

    const input = {
      TableName: "user_unique_identifiers",
      Item: {
        uuid: { S: uuid },
        ...Converter.marshall(uniqueIdentifierData),
      },
    };

    const userUniqueIdentifier: UserUniqueIdentifier = {
      uuid: uuid,
      ...uniqueIdentifierData,
    };

    const command = new PutItemCommand(input);
    await this.client.send(command);

    return userUniqueIdentifier;
  }

  public async getUserByUniqueIdentifier(
    uniqueIdentifier: string,
    provider: string
  ): Promise<User> {
    this.client = new DynamoDBClient(Utils.getAWSConfig());
    const userUniqueIdentifier = await this.getUserUniqueIdentifier(uniqueIdentifier, provider);

    const input = {
      TableName: "users",
      Key: {
        uuid: { S: userUniqueIdentifier.user_id },
      },
    };

    const command = new GetItemCommand(input);
    const response = await this.client.send(command);

    return Converter.unmarshall(response.Item) as User;
  }
}
