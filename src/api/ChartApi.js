import axios from "./AxiosInstance.js";

export const getAllChartData = () => axios.get("/chart");