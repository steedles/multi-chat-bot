import { BaseProvider } from "./baseProvider";
import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import { User } from "../types/user";
import UserService from "../services/userService";
import SessionService from "../services/sessionService";
import { BaseOutboundTextMessage } from "../messages/base/outbound/baseOutboundTextMessage";
import { SessionState } from "../types/session";
import { SimulatorInboundTextMessage } from "../messages/simulator/inbound/simulatorInboundTextMessage";
import { DiscordInboundTextMessage } from "../messages/discord/inbound/discordInboundTextMessage";
import { DiscordInboundVerificationMessage } from "../messages/discord/inbound/discordInboundVerificationMessage";
import { sign } from "tweetnacl";
import { BaseOutboundMenuMessage } from "../messages/base/outbound/baseOutboundMenuMessage";

export type DiscordMessages = DiscordInboundTextMessage | DiscordInboundVerificationMessage;

export class DiscordProvider extends BaseProvider {
  providerName = "discord";

  handleIncomingMessage(request: BaseInboundMessage): Promise<BaseOutboundMessage> {
    return super.handleIncomingMessage(request);
  }

  async getUserIdFromRequest(request: DiscordMessages): Promise<User> {
    const userService = new UserService();
    return await userService.getUserByUniqueIdentifier(request.value(), this.providerName);
  }

  processOutboundMessage(response: BaseOutboundMessage): any {
    switch (response.constructor) {
      case BaseOutboundTextMessage:
        return this.processOutboundTextMessage(response as BaseOutboundTextMessage);
    }
  }

  processOutboundTextMessage(response: BaseOutboundTextMessage): any {
    const session = SessionService.SESSION;

    const outputText = response.textOutput;
    let index = 1;
    return {
      session_id: session.uuid,
      user_id: session.user_id,
      response: {
        text: outputText,
        menu_items: response.menu_items.map((item) => {
          return { press: index++, caption: item.caption };
        }),
      },
    };
  }

  getStateFromMenuItem(
    request: SimulatorInboundTextMessage,
    sessionState: SessionState
  ): SessionState {
    if (!sessionState) return null;
    if (sessionState.menu_items?.length <= 0) return sessionState;

    const value = request.message_body.text;
    let option = Number(value);
    if (isNaN(option) || option < 1 || option > sessionState.menu_items.length) return sessionState;

    option--;
    const item = sessionState.menu_items[option];

    sessionState.target_page = item.target_page;
    sessionState.parameters = item.parameters;

    return sessionState;
  }

  verifyIncomingMessage(request: BaseInboundMessage, headers: Headers): any {
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC;

    const signature = headers["x-signature-ed25519"];
    const timestamp = headers["x-signature-timestamp"];
    const body = JSON.stringify(request); // rawBody is expected to be a string, not raw bytes

    return sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, "hex"),
      Buffer.from(PUBLIC_KEY, "hex")
    );
  }

  processOutboundMenuMessage(response: BaseOutboundMenuMessage): any {}
}
