import { BasePage } from "./basePage";
import { BaseOutboundTextMessage } from "../messages/base/outbound/baseOutboundTextMessage";

export abstract class TextPage extends BasePage {
  response: BaseOutboundTextMessage = new BaseOutboundTextMessage();
}
