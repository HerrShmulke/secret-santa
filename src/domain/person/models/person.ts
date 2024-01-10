import { IPersonProps } from "./peros-props";

export class Person {
  id: number;
  name?: string;
  email: string;
  gift?: string;

  constructor(props: IPersonProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.gift = props.gift;
  }
}