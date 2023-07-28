import { BaseProvider } from "./baseProvider";
import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import { User } from "../types/user";
import UserService from "../services/userService";
import SessionService from "../services/sessionService";
import { BaseOutboundTextMessage } from "../messages/base/outbound/baseOutboundTextMessage";
import { SessionState } from "../types/session";
import { SimulatorInboundTextMessage } from "../messages/simulator/inbound/simulatorInboundTextMessage";

export type SimulatorMessages = SimulatorInboundTextMessage;

export class SimulatorProvider extends BaseProvider {
  providerName = "simulator";

  handleIncomingMessage(request: BaseInboundMessage): Promise<BaseOutboundMessage> {
    return super.handleIncomingMessage(request);
  }

  async getUserIdFromRequest(request: SimulatorMessages): Promise<User> {
    const userService = new UserService();
    return await userService.getUserByUniqueIdentifier(request.email_address, this.providerName);
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
}
