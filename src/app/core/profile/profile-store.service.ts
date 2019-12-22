import { Injectable } from '@angular/core';
import { forkJoin, throwError, BehaviorSubject, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProfileService } from './profile.service';
import { LocationService } from '../location/location.service';
import { SpeciesService } from '../species/species.service';
import { ImageService } from '../image/image.service';
import { AnimalService } from '../animal/animal.service';
import { Animal, Image, Location, Profile, Species } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileStoreService {

  private readonly mProfile = new BehaviorSubject<Profile>(null);

  readonly profile$ = this.mProfile.asObservable();

  ignoreNotifications = false;

  constructor(private profileService: ProfileService,
              private locationService: LocationService,
              private speciesService: SpeciesService,
              private animalService: AnimalService,
              private imageService: ImageService) {
  }

  updateProfile(updated: Profile): Observable<Profile> {
    this.ignoreNotifications = true;
    return this.profileService.save(updated).pipe(
      map(v => {
        this.profile = v;
        return v;
      }),
      finalize(() => this.ignoreNotifications = false)
    );
  }

  addLocation(location: Location): Observable<Location> {
    this.ignoreNotifications = true;
    return this.locationService.save(location).pipe(
      map(v => {
        this.profile.locations = [
          ...this.profile.locations,
          v
        ];
        return v;
      }),
      finalize(() => this.ignoreNotifications = false)
    );
  }

  updateLocation(location: Location): Observable<Location> {
    const foundLocation = this.findLocation(location._id);
    if (foundLocation) {
      this.ignoreNotifications = true;
      return this.locationService.save(location).pipe(
        map(v => {
          const index = this.profile.locations.indexOf(foundLocation);
          this.profile.locations[index] = {
            ...v
          };
          this.profile.locations = [...this.profile.locations];
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find location to update'));
    }
  }

  removeLocation(location: Location): Observable<Location> {
    const foundLocation = this.findLocation(location._id);
    if (foundLocation) {
      this.ignoreNotifications = true;
      return this.locationService.delete(location).pipe(
        map(v => {
          this.profile.locations = this.profile.locations.filter(loc => loc._id !== foundLocation._id);
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find location to remove'));
    }
  }

  findLocation(id: string): Location {
    const found = this.profile.locations.find(location => location._id === id);
    return found;
  }

  isLocationReferenced(id: string): boolean {
    // Only animals reference locations
    const animals = this.profile.animals.find(animal => animal.locationId === id);
    if (animals) {
      return true;
    }
    return false;
  }

  addSpecies(species: Species): Observable<Species> {
    this.ignoreNotifications = true;
    return this.speciesService.save(species).pipe(
      map(v => {
        this.profile.species = [
          ...this.profile.species,
          v
        ];
        return v;
      }),
      finalize(() => this.ignoreNotifications = false)
    );
  }

  updateSpecies(species: Species): Observable<Species> {
    const foundSpecies = this.findSpecies(species._id);
    if (foundSpecies) {
      this.ignoreNotifications = true;
      return this.speciesService.save(species).pipe(
        map(v => {
          const index = this.profile.species.indexOf(foundSpecies);
          this.profile.species[index] = {
            ...v
          };
          this.profile.species = [...this.profile.species];
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find species to update'));
    }
  }

  removeSpecies(species: Species): Observable<Species> {
    const foundSpecies = this.findSpecies(species._id);
    if (foundSpecies) {
      this.ignoreNotifications = true;
      return this.speciesService.delete(species).pipe(
        map(v => {
          this.profile.species = this.profile.species.filter(sp => sp._id !== foundSpecies._id);
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find species to remove'));
    }
  }

  isSpeciesReferenced(id: string): boolean {
    // Only animals reference speices
    const animals = this.profile.animals.find(animal => animal.speciesId === id);
    if (animals) {
      return true;
    }
    return false;
  }

  findSpecies(id: string): Species {
    const found = this.profile.species.find(species => species._id === id);
    return found;
  }

  addAnimal(animal: Animal): Observable<Animal> {
    this.ignoreNotifications = true;
    return this.animalService.save(animal).pipe(
      map(v => {
        this.profile.animals = [
          ...this.profile.animals,
          v
        ];
        return v;
      }),
      finalize(() => this.ignoreNotifications = false)
    );
  }

  updateAnimals(animals: Array<Animal>): Observable<Array<Animal>> {
    let foundAll = true;
    animals.forEach(a => {
      const foundAnimal = this.findAnimal(a._id);
      if (!foundAnimal) {
        foundAll = false;
      }
    });

    if (foundAll) {
      this.ignoreNotifications = true;
      return this.animalService.saveMulti(animals).pipe(
        map(v => {
          v.forEach(a => {
            const index = this.profile.animals.indexOf(this.findAnimal(a._id));
            this.profile.animals[index] = {
              ...a
            };
            this.profile.animals = [...this.profile.animals];
          });
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find animals to update'));
    }
  }

  updateAnimal(animal: Animal): Observable<Animal> {
    const foundAnimal = this.findAnimal(animal._id);
    if (foundAnimal) {
      this.ignoreNotifications = true;
      return this.animalService.save(animal).pipe(
        map(v => {
          const index = this.profile.animals.indexOf(foundAnimal);
          this.profile.animals[index] = {
            ...v
          };
          this.profile.animals = [...this.profile.animals];
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find animal to update'));
    }
  }

  removeAnimal(animal: Animal): Observable<Animal> {
    const foundAnimal = this.findAnimal(animal._id);
    if (foundAnimal) {
      this.ignoreNotifications = true;
      return this.animalService.delete(animal).pipe(
        map(v => {
          this.profile.animals = this.profile.animals.filter(a => a._id !== foundAnimal._id);
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find animal to remove'));
    }
  }

  findAnimal(id: string): Animal {
    const found = this.profile.animals.find(animal => animal._id === id);
    return found;
  }

  addImage(image: Image): Observable<Image> {
    this.ignoreNotifications = true;
    return this.imageService.save(image).pipe(
      map(v => {
        this.profile.images = [
          ...this.profile.images,
          v
        ];
        this.mProfile.next(this.profile);
        return v;
      }),
      finalize(() => this.ignoreNotifications = false)
    );
  }

  updateImage(image: Image): Observable<Image> {
    const foundImage = this.findImage(image._id);
    if (foundImage) {
      this.ignoreNotifications = true;
      return this.imageService.save(image).pipe(
        map(v => {
          const index = this.profile.images.indexOf(foundImage);
          this.profile.images[index] = {
            ...v
          };
          this.profile.images = [...this.profile.images];
          this.mProfile.next(this.profile);
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find image to update'));
    }
  }

  removeImage(image: Image): Observable<Image> {
    const foundImage = this.findImage(image._id);
    if (foundImage) {
      this.ignoreNotifications = true;
      return this.imageService.delete(image).pipe(
        map(v => {
          this.profile.images = this.profile.images.filter(img => img._id !== foundImage._id);
          this.mProfile.next(this.profile);
          return v;
        }),
        finalize(() => this.ignoreNotifications = false)
      );
    } else {
      return throwError(new Error('Failed to find image to remove'));
    }
  }

  findImage(id: string): Image {
    const found = this.profile.images.find(image => image._id === id);
    return found;
  }

  notifyUpdate(profile: Profile) {
    if (!this.ignoreNotifications) {
      this.profile = profile;
    }
  }

  set profile(profile: Profile) {
    this.mProfile.next(profile);
  }

  get profile(): Profile {
    return this.mProfile.getValue();
  }

}
