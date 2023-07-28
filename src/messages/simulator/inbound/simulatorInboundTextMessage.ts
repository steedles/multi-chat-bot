import { BaseInboundTextMessage } from "../../base/inbound/baseInboundTextMessage";

export class SimulatorInboundTextMessage extends BaseInboundTextMessage {
  email_address: string;
  session_id: string;
  message_body: { text: string };

  value() {
    return this.message_body.text;
  }
}
