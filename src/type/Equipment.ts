export default interface EquipmentType {
  equipmentId: string;
  equipmentName: string;
  guaranteeDate: string;
  hardwareSpec: string;
  type: string;
  installationDate: string;
  replacementPeriod: string;
  lifespan: number;
  cost: number;
  maintenance?: {
    maintenanceDate: string;
    maintenanceSummary: string;
    maintenanceDetails: string;
    maintenanceCost: number;
  }[];
}
