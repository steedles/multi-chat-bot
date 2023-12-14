import { BaseInboundTextMessage } from "../../base/inbound/baseInboundTextMessage";

export class DiscordInboundTextMessage extends BaseInboundTextMessage {
  application_id: string;
  entitlements: string;
  id: string;
  token: string;
  type: number;
  user: {
    avatar: string;
    avatar_decoration_data: any;
    discriminator: string;
    global_name: string;
    id: string;
    public_flags: number;
    username: string;
  };
  version: string;

  value() {
    return this.user.username;
  }
}
