export default interface UserType {
  userId: string;
  username: string;
  password: string;
  staffRole: string;
  createdAt: string;
  fullName: string;
  gender: "M" | "F";
  email: string;
  phone: string;
  type: string;
}
