import { TextPage } from "../../classes/textPage";
import {
  BaseOutboundMessage,
  USER_RESPONSE_TYPES,
} from "../../messages/base/outbound/baseOutboundMessage";
import { BaseInboundMessage } from "../../messages/base/inbound/baseInboundMessage";

export default class WelcomePage extends TextPage {
  processRequest(request: BaseInboundMessage): BaseOutboundMessage {
    return this.response
      .setResponseType(USER_RESPONSE_TYPES.FREE_TEXT)
      .setTargetPage("demo/HomePage")
      .addParameter({ page: "name" })
      .setTextOutput(`Please enter your name:`);
  }
}
