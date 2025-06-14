import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

//? Zod schema definition
const EnvSchema = z.object({
  // CONFIG
  NODE_ENV: z.enum(["production", "test"]).default("test"),
  RETRIES: z.string().optional(),
  RETRY_LIMIT: z.string().optional(),
  RETRY_DELAY: z.string().optional(),
  WORKERS: z.string().optional(),

  // USER
  USER_EMAIL: z.string().email(),
  USER_PASSWORD: z.string(),
  USER_FIRST_NAME: z.string(),
  USER_LAST_NAME: z.string(),
  USER_PHONE: z.string(),

  // PUBLIC URLs
  TEST_ENV_URL: z.string().url(),
  PUBLIC_HOME_PAGE_URL: z.string().url(),
  PUBLIC_LOGIN_PAGE_URL: z.string().url(),
  PUBLIC_REGISTER_PAGE_URL: z.string().url(),
  PUBLIC_FORGOTTEN_PASSWORD_PAGE_URL: z.string().url(),
  PUBLIC_SPECIAL_PAGE_URL: z.string().url(),
  PUBLIC_BLOG_PAGE_URL: z.string().url(),
  PUBLIC_MEGA_MENU_APPLE_PAGE_URL: z.string().url(),
  PUBLIC_MEGA_MENU_HEADPHONE_PAGE_URL: z.string().url(),
  PUBLIC_MEGA_MENU_DESKTOP_PAGE_URL: z.string().url(),

  // USER ACCOUNT URLs
  USER_ACCOUNT_PAGE_URL: z.string().url(),
  USER_ACCOUNT_EDIT_PAGE_URL: z.string().url(),
  USER_ACCOUNT_PASSWORD_PAGE_URL: z.string().url(),
  USER_ACCOUNT_ADDRESS_BOOK_PAGE_URL: z.string().url(),
  USER_ACCOUNT_WISHLIST_PAGE_URL: z.string().url(),
  USER_ACCOUNT_NOTIFICATION_PAGE_URL: z.string().url(),
  USER_ACCOUNT_ORDER_HISTORY_PAGE_URL: z.string().url(),
  USER_ACCOUNT_DOWNLOAD_PAGE_URL: z.string().url(),
  USER_ACCOUNT_RECURRING_URL: z.string().url(),
  USER_ACCOUNT_REWARD_URL: z.string().url(),
  USER_ACCOUNT_RETURN_URL: z.string().url(),
  USER_ACCOUNT_TRANSACTION_URL: z.string().url(),
  USER_ACCOUNT_NEWSLETTER_URL: z.string().url(),
  USER_ACCOUNT_LOGOUT_URL: z.string().url(),
});

//? Safe parse and validate
const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid or missing environment variables:",
    parsedEnv.error.format()
  );
  process.exit(1); //? Exit app if env is invalid
}

//? Export typed config
const env = parsedEnv.data;

export const ENV = {
  CONFIG: {
    NODE_ENV: env.NODE_ENV,
    RETRIES: env.RETRIES,
    RETRY_LIMIT: env.RETRY_LIMIT,
    RETRY_DELAY: env.RETRY_DELAY,
    WORKERS: env.WORKERS,
  },
  USER: {
    EMAIL: env.USER_EMAIL,
    PASSWORD: env.USER_PASSWORD,
    FIRST_NAME: env.USER_FIRST_NAME,
    LAST_NAME: env.USER_LAST_NAME,
    PHONE: env.USER_PHONE,
  },
  PUBLIC_URL: {
    TEST_ENV: env.TEST_ENV_URL,
    HOME_PAGE: env.PUBLIC_HOME_PAGE_URL,
    LOGIN_PAGE: env.PUBLIC_LOGIN_PAGE_URL,
    REGISTER_PAGE: env.PUBLIC_REGISTER_PAGE_URL,
    FORGOTTEN_PASSWORD_PAGE: env.PUBLIC_FORGOTTEN_PASSWORD_PAGE_URL,
    SPECIAL_PAGE: env.PUBLIC_SPECIAL_PAGE_URL,
    BLOG_PAGE: env.PUBLIC_BLOG_PAGE_URL,
    MEGA_MENU_APPLE_PAGE: env.PUBLIC_MEGA_MENU_APPLE_PAGE_URL,
    MEGA_MENU_HEADPHONE_PAGE: env.PUBLIC_MEGA_MENU_HEADPHONE_PAGE_URL,
    MEGA_MENU_DESKTOP_PAGE: env.PUBLIC_MEGA_MENU_DESKTOP_PAGE_URL,
  },
  USER_ACCOUNT_URL: {
    ACCOUNT_PAGE: env.USER_ACCOUNT_PAGE_URL,
    EDIT_PAGE: env.USER_ACCOUNT_EDIT_PAGE_URL,
    PASSWORD_PAGE: env.USER_ACCOUNT_PASSWORD_PAGE_URL,
    ADDRESS_BOOK_PAGE: env.USER_ACCOUNT_ADDRESS_BOOK_PAGE_URL,
    WISHLIST_PAGE: env.USER_ACCOUNT_WISHLIST_PAGE_URL,
    NOTIFICATION_PAGE: env.USER_ACCOUNT_NOTIFICATION_PAGE_URL,
    ORDER_HISTORY_PAGE: env.USER_ACCOUNT_ORDER_HISTORY_PAGE_URL,
    DOWNLOAD_PAGE: env.USER_ACCOUNT_DOWNLOAD_PAGE_URL,
    RECURRING_Page: env.USER_ACCOUNT_RECURRING_URL,
    REWARD_Page: env.USER_ACCOUNT_REWARD_URL,
    RETURN_Page: env.USER_ACCOUNT_RETURN_URL,
    TRANSACTION_Page: env.USER_ACCOUNT_TRANSACTION_URL,
    NEWSLETTER_Page: env.USER_ACCOUNT_NEWSLETTER_URL,
    LOGOUT_Page: env.USER_ACCOUNT_LOGOUT_URL,
  },
};
