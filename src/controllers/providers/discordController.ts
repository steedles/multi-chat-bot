import { Body, Controller, Get, Headers, HttpCode, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { BaseOutboundMessage } from "../../messages/base/outbound/baseOutboundMessage";
import UserService from "../../services/userService";
import SessionService from "../../services/sessionService";
import { BaseInboundMessage } from "../../messages/base/inbound/baseInboundMessage";
import { DiscordInboundTextMessage } from "../../messages/discord/inbound/discordInboundTextMessage";
import { DiscordInboundVerificationMessage } from "../../messages/discord/inbound/discordInboundVerificationMessage";
import { DiscordMessages, DiscordProvider } from "../../providers/discordProvider";

@Controller("discord")
export class DiscordController {
  provider = new DiscordProvider();

  @Get("incoming")
  async setWebhook(@Res() response: Response) {
    response.status(200).send();
  }

  @Post("incoming")
  @HttpCode(200)
  async incomingMessage(
    @Headers() headers: Headers,
    @Body() requestBody: DiscordInboundTextMessage | DiscordInboundVerificationMessage,
    @Res() response: Response
  ): Promise<BaseOutboundMessage> {
    const verify = this.provider.verifyIncomingMessage(requestBody, headers);

    if (!verify) {
      response.status(401).send();
      return;
    }

    if (this.isVerifyMessage(requestBody)) {
      response.status(200).send({ type: 1 });
      return;
    }

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

    const incoming = this.mapIncomingRequest(requestBody);

    const res = await this.provider.handleIncomingMessage(incoming);
    response.status(200).send(res);
    return;
  }

  mapIncomingRequest(requestBody: BaseInboundMessage): DiscordMessages {
    const message = new DiscordInboundTextMessage();
    switch ((requestBody as DiscordMessages).type) {
      case 1: {
        const verification = new DiscordInboundVerificationMessage();
        const mapped = requestBody as DiscordInboundVerificationMessage;
        verification.user = mapped.user;
        verification.type = mapped.type;
        verification.id = mapped.id;
        verification.application_id = mapped.application_id;
        verification.entitlements = mapped.entitlements;
        verification.version = mapped.version;
        verification.token = mapped.token;

        return verification;
      }
    }

    return message;
  }

  isVerifyMessage(request: BaseInboundMessage): boolean {
    return (request as DiscordMessages).type == 1;
  }
}
