import { GeoJson } from './geo-json';

export interface Location {
  _id?: string;
  name: string;
  geoLocation: GeoJson;
  imageId?: string;
  fullAddress?: string;
}
