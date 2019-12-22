export interface Species {
  _id?: string;
  venomous?: boolean;
  potentiallyHarmful?: boolean;
  class?: string;
  order?: string;
  subOrder?: string;
  commonName: string;
  genus?: string;
  species?: string;
  subSpecies?: string;
  imageId?: string;
}
