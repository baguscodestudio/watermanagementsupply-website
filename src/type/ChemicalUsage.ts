export default interface ChemicalUsageType {
  chemicalUsageId: string;
  chemicalId: string;
  equipmentId: string;
  date: string;
  data: {
    timestamp: string;
    value: number;
  }[];
}
