export default interface CustomerType {
  userId: string;
  username: string;
  password: string;
  createdAt: string;
  fullName: string;
  gender: "M" | "F";
  email: string;
  phone: string;
  type: string;
  lastMaintenance: string;
}
