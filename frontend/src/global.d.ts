declare module "swiper/css";

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_ACKEE_SERVER?: string;
    REACT_APP_ACKEE_DOMAIN_ID?: string;
  }
}
