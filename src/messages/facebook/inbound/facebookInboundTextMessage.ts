import { BaseInboundTextMessage } from "../../base/inbound/baseInboundTextMessage";

export class FacebookInboundTextMessage extends BaseInboundTextMessage {
  object: string;
  entry: FacebookInboundTextEntry[];

  value() {
    return this.entry[0].messaging[0].message.text;
  }
}

class FacebookInboundTextEntry {
  id: string;
  time: number;
  messaging: FacebookInboundTextEntryMessage[];
}

class FacebookInboundTextEntryMessage {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message: { mid: string; text: string; quick_reply: { payload: string } };
  is_echo = false;
}
