export abstract class BaseOutboundMessage {
  returnResponse = true;

  expected_user_response: {
    response_type?: USER_RESPONSE_TYPES;
    target_page?: string;
    parameters?: Record<string, any>[];
  };

  menu_items: {
    id: string;
    caption: string;
    target_page: string;
    parameters: Record<string, any>[];
  }[] = [];

  [propName: string]: any;

  constructor() {
    this.expected_user_response = {
      response_type: USER_RESPONSE_TYPES.FREE_TEXT,
      target_page: "",
      parameters: [],
    };
    this.menu_items = [];
  }

  setResponseType(type: USER_RESPONSE_TYPES) {
    this.expected_user_response.response_type = type;
    return this;
  }

  setTargetPage(page: string) {
    this.expected_user_response.target_page = page;
    return this;
  }

  addParameter(param: Record<string, any>) {
    this.expected_user_response.parameters.push(param);
    return this;
  }

  addMenuType(
    caption: string,
    target_page: string,
    parameters: Record<string, any>[] = [],
    id = ""
  ) {
    this.menu_items.push({ id, caption, target_page, parameters });
    this.setResponseType(USER_RESPONSE_TYPES.MENU_OPTION);
    return this;
  }

  sendResponse() {}

  getFormattedOutput() {}
}

export enum USER_RESPONSE_TYPES {
  FREE_TEXT,
  MENU_OPTION,
  IMAGE,
}
