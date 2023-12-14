import { BaseOutboundMessage } from "./baseOutboundMessage";

export class BaseOutboundMenuMessage extends BaseOutboundMessage {
  textOutput: string;
  menuOptions: {
    id: string;
    caption: string;
    target_page: string;
    parameters: Record<string, any>[];
  }[];

  setTextOutput(text: string) {
    this.textOutput = text;
    return this;
  }
}
