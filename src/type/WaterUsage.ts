import SensorData from "./SensorData";

export default interface WaterUsageType {
  waterPumpUsageId?: string;
  customerId: string;
  date: string;
  data: SensorData[];
}
