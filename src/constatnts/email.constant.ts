import { EEmailAction } from "../enums/email.action.enum";

export const templates = {
  [EEmailAction.REGISTER]: {
    templateName: "register",
    subject: "Hello, great to see you in our app",
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Do not worry, we control your password",
  },
  [EEmailAction.NOT_ACTIVE_USER]: {
    templateName: "not-active-user",
    subject: "We Miss You",
  },
  [EEmailAction.ANNOUNCEMENT_BAD_WORDS]: {
    templateName: "announcement-bad-words",
    subject: "announcement have a problem with description, please check",
  },
  [EEmailAction.CHOOSE_OTHER_BRAND]: {
    templateName: "choose-other-brand",
    subject: "we will contact you to add a new brand",
  },
};
