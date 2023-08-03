import Strategy from "../entities/Strategy";
import APIClient from "./api-client";

export default new APIClient<Strategy>("/strategies");
