import { OAuth2Client } from "google-auth-library";
import env from "./env.js";

const googleClient = new OAuth2Client(env.googleClientId);

export default googleClient;