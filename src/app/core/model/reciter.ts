import { Moshaf } from "./moshaf";

export interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}


