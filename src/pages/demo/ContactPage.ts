import { TextPage } from "../../classes/textPage";
import {
  BaseOutboundMessage,
  USER_RESPONSE_TYPES,
} from "../../messages/base/outbound/baseOutboundMessage";
import { BaseInboundMessage } from "../../messages/base/inbound/baseInboundMessage";

export default class HelpPage extends TextPage {
  processRequest(request: BaseInboundMessage): BaseOutboundMessage {
    return this.response
      .setResponseType(USER_RESPONSE_TYPES.MENU_OPTION)
      .addParameter({ try_me: "okay" })
      .setTextOutput(`Call me?`)
      .addMenuType("Back", "demo/HelpPage")
      .addMenuType("Home", "demo/HomePage");
  }
}
