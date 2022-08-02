import UserType from './User';

export default interface CustomerType extends UserType {
  address: string;
}
