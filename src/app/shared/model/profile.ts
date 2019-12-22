import { Location } from './location';
import { Species } from './species';
import { Image } from './image';
import { Animal } from './animal';

export interface Profile {
  _id: string;
  username: string;
  email: string;
  name: string;
  foodTypes: Array<string>;
  locations: Array<Location>;
  species: Array<Species>;
  images: Array<Image>;
  animals: Array<Animal>;
}
