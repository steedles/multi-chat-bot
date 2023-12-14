import { TextPage } from "../../classes/textPage";
import {
  BaseOutboundMessage,
  USER_RESPONSE_TYPES,
} from "../../messages/base/outbound/baseOutboundMessage";
import { BaseInboundMessage } from "../../messages/base/inbound/baseInboundMessage";
import SessionService from "../../services/sessionService";

export default class HomePage extends TextPage {
  processRequest(request: BaseInboundMessage): BaseOutboundMessage {
    const ses = SessionService.SESSION;
    return this.response
      .setResponseType(USER_RESPONSE_TYPES.MENU_OPTION)
      .setTextOutput(
        `Welcome to the Demo${
          ses.data.current_state?.parameters[0].page == "name" ? " " + request.value() : ""
        }!`
      )
      .addMenuType("Help", "demo/HelpPage")
      .addMenuType("Enter Name", "demo/ShowNamePage");
  }
}
