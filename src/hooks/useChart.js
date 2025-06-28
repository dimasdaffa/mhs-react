import { useQuery } from "@tanstack/react-query";
import { getAllChartData } from "../api/ChartApi.js";

export const useChartData = () =>
  useQuery({
    queryKey: ["chart", "all"],
    queryFn: getAllChartData,
    select: (res) => res.data,
  });