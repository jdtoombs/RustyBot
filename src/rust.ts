import * as dotenv from "dotenv"; dotenv.config();
import RustPlus from "rustplus-api";

// connect to rustplus-api with given env vars
let rustplus = new RustPlus(process.env.IP, process.env.PORT, process.env.PLAYER_ID, process.env.PLAYER_TOKEN);

export {rustplus as Rust};
