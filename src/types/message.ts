import { BaseInboundMessage } from "../messages/base/inbound/baseInboundMessage";
import { BaseOutboundMessage } from "../messages/base/outbound/baseOutboundMessage";

export type Message = {
  uuid: string;
  session_id: string;
  user_id: string;

  data: {
    inbound_message: BaseInboundMessage;
    outbound_message?: BaseOutboundMessage;
  };

  date_created: string;
};
