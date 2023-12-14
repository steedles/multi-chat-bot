import { BaseProvider } from "./baseProvider";
import {
  BaseOutboundMessage,
  USER_RESPONSE_TYPES,
} from "../messages/base/outbound/baseOutboundMessage";
import { User } from "../types/user";
import UserService from "../services/userService";
import { BaseOutboundTextMessage } from "../messages/base/outbound/baseOutboundTextMessage";
import { SessionState } from "../types/session";
import { FacebookInboundTextMessage } from "../messages/facebook/inbound/facebookInboundTextMessage";
import { FacebookOutboundTextMessage } from "../messages/facebook/outbound/facebookOutboundTextMessage";
import { BaseOutboundMenuMessage } from "../messages/base/outbound/baseOutboundMenuMessage";
import { FacebookOutboundMenuMessage } from "../messages/facebook/outbound/facebookOutboundMenuMessage";

export type FacebookMessages = FacebookInboundTextMessage;

export class FacebookProvider extends BaseProvider {
  providerName = "facebook";
  senderId: string;

  handleIncomingMessage(request: FacebookMessages): Promise<BaseOutboundMessage> {
    this.senderId = request.entry[0].messaging[0].sender.id;
    return super.handleIncomingMessage(request);
  }

  async getUserIdFromRequest(request: FacebookMessages): Promise<User> {
    const userService = new UserService();
    return await userService.getUserByUniqueIdentifier(
      request.entry[0].messaging[0].sender.id,
      this.providerName
    );
  }

  processOutboundMessage(response: BaseOutboundMessage): any {
    switch (response.expected_user_response.response_type) {
      case USER_RESPONSE_TYPES.FREE_TEXT:
        return this.processOutboundTextMessage(response as BaseOutboundTextMessage);
      case USER_RESPONSE_TYPES.MENU_OPTION:
        return this.processOutboundMenuMessage(response as BaseOutboundMenuMessage);
    }
  }

  processOutboundTextMessage(response: BaseOutboundTextMessage): any {
    const res = new FacebookOutboundTextMessage();

    res.textOutput = response.textOutput;
    res.menu_items = response.menu_items;
    res.expected_user_response = response.expected_user_response;
    res.recipientId = this.senderId;
    return res;
  }

  processOutboundMenuMessage(response: BaseOutboundMenuMessage): any {
    const res = new FacebookOutboundMenuMessage();

    res.textOutput = response.textOutput;
    res.menu_items = response.menu_items;
    res.expected_user_response = response.expected_user_response;
    res.recipientId = this.senderId;
    return res;
  }

  getStateFromMenuItem(
    request: FacebookInboundTextMessage,
    sessionState: SessionState
  ): SessionState {
    if (!sessionState) return null;
    if (sessionState.menu_items?.length <= 0) return sessionState;

    const value = request.entry["0"].messaging["0"].message.quick_reply.payload;
    let option = Number(value);
    if (isNaN(option) || option < 1 || option > sessionState.menu_items.length) return sessionState;

    option--;
    const item = sessionState.menu_items[option];

    sessionState.target_page = item.target_page;
    sessionState.parameters = item.parameters;

    return sessionState;
  }
}
