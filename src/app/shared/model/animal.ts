export interface Feeding {
  _id?: string;
  feedingDate: Date;
  quantity: number;
  type?: string;
}

export interface AnimalImage {
  _id?: string;
  imageId: string;
default?: boolean;
}

export interface Animal {
  _id?: string;
  name: string;
  locationId: string;
  speciesId: string;
  sex: string;
  birthDate?: Date;
  acquisitionDate?: Date;
  images?: Array<AnimalImage>;
  preferredFood?: string;
  feedings?: Array<Feeding>;
}
