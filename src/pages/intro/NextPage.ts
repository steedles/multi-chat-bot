import { TextPage } from "../../classes/textPage";
import { BaseOutboundMessage } from "../../messages/base/outbound/baseOutboundMessage";

export default class NextPage extends TextPage {
  processRequest(): BaseOutboundMessage {
    return this.response
      .setTargetPage("intro/NextPage")
      .addParameter({ try_me: "okay" })
      .setTextOutput("Welcome to the party, Pal!")
      .addMenuType("Home", "intro/WelcomePage")
      .addMenuType("Reload", "intro/NextPage");
  }
}
