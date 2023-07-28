import { BaseInboundMessage } from "./baseInboundMessage";

export abstract class BaseInboundTextMessage extends BaseInboundMessage {
  abstract value();
}
