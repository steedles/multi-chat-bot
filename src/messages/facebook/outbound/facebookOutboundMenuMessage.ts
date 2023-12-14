import axios from "axios";
import * as process from "process";
import { BaseOutboundMenuMessage } from "../../base/outbound/baseOutboundMenuMessage";

export class FacebookOutboundMenuMessage extends BaseOutboundMenuMessage {
  textOutput: string;
  recipientId: string;
  returnResponse = false;

  setTextOutput(text: string) {
    this.textOutput = text;
    return this;
  }

  getFormattedOutput() {
    return {
      recipient: { id: this.recipientId },
      messaging_type: "RESPONSE",
      message: {
        text: this.textOutput,
        quick_replies: this.menu_items.map((item, index) => {
          return {
            content_type: "text",
            title: item.caption,
            payload: index + 1,
          };
        }),
      },
    };
  }

  sendResponse() {
    const url = process.env.FACEBOOK_GRAPH_API_URL.replace(
      "FACEBOOK_ACCESS_TOKEN",
      process.env.FACEBOOK_ACCESS_TOKEN
    ).replace("FACEBOOK_PAGE_ID", process.env.FACEBOOK_PAGE_ID);
    axios
      .post(url, this.getFormattedOutput())
      .then(function (response) {
        console.log("Status: " + response.status);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
