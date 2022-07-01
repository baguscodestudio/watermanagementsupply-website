import SensorData from "./SensorData";

export default interface WaterPumpUsageType {
  waterPumpUsageId?: string;
  pumpId: string;
  date: string;
  data: SensorData[];
}
