import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import { User } from "../types/user";
import { MINUTES } from "../constants";
import SessionService from "../services/sessionService";
import MessageService from "../services/messageService";
import { BasePage } from "../classes/basePage";
import { BaseOutboundTextMessage } from "../messages/base/outbound/baseOutboundTextMessage";
import { SessionState } from "../types/session";

declare function require(moduleName: string): any;

export abstract class BaseProvider {
  sessionTTL = 30 * MINUTES;
  abstract providerName: string;

  abstract getUserIdFromRequest(request: BaseInboundMessage): Promise<User>;

  abstract processOutboundMessage(response: BaseOutboundMessage): any;

  abstract processOutboundTextMessage(response: BaseOutboundTextMessage): any;

  abstract getStateFromMenuItem(
    request: BaseInboundMessage,
    sessionState: SessionState
  ): SessionState;

  async handleIncomingMessage(request: BaseInboundMessage): Promise<any> {
    const messageService = new MessageService();
    await messageService.logInboundMessage(request);
    const sessionService = new SessionService();

    let previousState = this.getStateFromMenuItem(
      request,
      SessionService.SESSION.data?.current_state
    );
    if (!previousState) previousState = sessionService.getHomeState();

    const classPath = `../pages/${previousState.target_page}`;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TASK_IMPORT = require(classPath);
    const TASK_CLASS = TASK_IMPORT.default;
    const statePage = new TASK_CLASS() as BasePage;
    const botResponse = statePage.processRequest(
      request as BaseInboundMessage
    ) as BaseOutboundMessage;

    await messageService.logOutboundMessage(botResponse);
    await sessionService.updateSessionState(botResponse, this);
    return this.processOutboundMessage(botResponse);
  }
}
