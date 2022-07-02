import UserType from "./User";

export default interface CustomerType extends UserType {
  lastMaintenance: string;
}
