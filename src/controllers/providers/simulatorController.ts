import BaseProviderController from "./baseProviderController";
import { Body, Controller, Headers, Post } from "@nestjs/common";
import { Session } from "../../types/session";
import { SimulatorSessionStart } from "../../types/requests/providers/simulator/session";
import UserService from "../../services/userService";
import SessionService from "../../services/sessionService";
import { SimulatorMessages, SimulatorProvider } from "../../providers/simulatorProvider";
import { BaseInboundMessage } from "../../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../../messages/base/outbound/baseOutboundMessage";
import { SimulatorInboundTextMessage } from "../../messages/simulator/inbound/simulatorInboundTextMessage";

@Controller("simulator")
export default class SimulatorController extends BaseProviderController {
  provider = new SimulatorProvider();

  @Post("session")
  async startSession(@Body() requestBody: SimulatorSessionStart): Promise<Session> {
    const userService = new UserService();
    const sessionService = new SessionService();

    const user = await userService.getUserByUniqueIdentifier(
      requestBody.email_address,
      this.provider.providerName
    );

    const session = await sessionService.startSession(user, this.provider);

    return session;
  }

  @Post("incoming")
  async incomingMessage(
    @Headers() headers: Headers,
    @Body() requestBody: SimulatorInboundTextMessage
  ): Promise<BaseOutboundMessage> {
    const userService = new UserService();
    const sessionService = new SessionService();

    const user = await userService.getUserByUniqueIdentifier(
      "wayne@steedman.co.za",
      this.provider.providerName
    );

    const sessionId = headers["x-session-id"];
    if (!sessionId) {
      await sessionService.startSession(user, this.provider);
    } else {
      await sessionService.getSessionById(sessionId, user, this.provider);
    }

    return this.provider.handleIncomingMessage(this.mapIncomingRequest(requestBody));
  }

  mapIncomingRequest(requestBody: BaseInboundMessage): SimulatorMessages {
    const message = new SimulatorInboundTextMessage();
    const request = requestBody as SimulatorMessages;
    if (request.message_body?.text?.length > 0) {
      message.message_body = request.message_body;
      message.email_address = request.email_address;
      message.session_id = request.session_id;
    }

    return message;
  }
}
