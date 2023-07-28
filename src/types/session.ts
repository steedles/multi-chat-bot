import { USER_RESPONSE_TYPES } from "../messages/base/outbound/baseOutboundMessage";

export type Session = {
  uuid: string;
  user_id: string;
  provider: string;

  data: {
    messages: { message_id: string }[];
    current_state?: SessionState;
  };

  date_created: string;
  expiry_date: string;
  date_updated?: string;
};

export type SessionState = {
  target_page?: string;
  response_type?: USER_RESPONSE_TYPES;
  parameters?: Record<string, any>[];
  menu_items?: {
    id: string;
    caption: string;
    target_page: string;
    parameters: Record<string, any>[];
  }[];
};
