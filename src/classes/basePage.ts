import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";
import "reflect-metadata";

export abstract class BasePage {
  request: BaseInboundMessage;
  response: BaseOutboundMessage;

  abstract processRequest(request: BaseInboundMessage): BaseOutboundMessage;
}
