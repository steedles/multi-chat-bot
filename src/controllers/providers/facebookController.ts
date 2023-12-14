import { Controller, Get, Headers, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { FacebookProvider } from "../../providers/facebookProvider";
import { FacebookInboundTextMessage } from "../../messages/facebook/inbound/facebookInboundTextMessage";
import UserService from "../../services/userService";
import SessionService from "../../services/sessionService";

@Controller("facebook")
export class FacebookController {
  provider = new FacebookProvider();

  @Get("incoming")
  async setWebhook(@Req() request: Request, @Res() response: Response) {
    response.status(200).send(request.query["hub.challenge"]);
  }

  @Post("incoming")
  async incoming(@Req() request: Request, @Headers() headers: Headers, @Res() response: Response) {
    if (this.isEchoRequest(request)) {
      response.status(204).send();
      return;
    }
    const userService = new UserService();
    const sessionService = new SessionService();

    const user = await userService.getUserByUniqueIdentifier(
      "wayne@steedman.co.za",
      this.provider.providerName
    );

    await sessionService.getSessionByUserId(user, this.provider);

    const message = new FacebookInboundTextMessage();
    message.entry = request.body.entry;
    message.object = request.body.object;

    const res = await this.provider.handleIncomingMessage(message);

    if (res.returnResponse) {
      response.status(200).send(res.getFormattedOutput());
    } else {
      response.status(200).send();
      res.sendResponse();
    }
  }

  isEchoRequest(request: Request) {
    return request.body.entry[0].messaging[0].message.is_echo == true;
  }
}
