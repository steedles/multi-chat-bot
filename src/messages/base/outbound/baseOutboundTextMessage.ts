import { BaseOutboundMessage } from "./baseOutboundMessage";

export class BaseOutboundTextMessage extends BaseOutboundMessage {
  textOutput: string;

  setTextOutput(text: string) {
    this.textOutput = text;
    return this;
  }
}
