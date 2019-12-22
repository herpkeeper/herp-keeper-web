import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ProfileStoreService } from './profile-store.service';
import { ProfileService } from './profile.service';
import { LocationService } from '../location/location.service';
import { SpeciesService } from '../species/species.service';
import { ImageService } from '../image/image.service';
import { AnimalService } from '../animal/animal.service';

describe('ProfileStoreService', () => {

  let service: ProfileStoreService;
  let profileService: ProfileService;
  let locationService: LocationService;
  let speciesService: SpeciesService;
  let imageService: ImageService;
  let animalService: AnimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    })
    service = TestBed.get(ProfileStoreService);
    profileService = TestBed.get(ProfileService);
    locationService = TestBed.get(LocationService);
    speciesService = TestBed.get(SpeciesService);
    imageService = TestBed.get(ImageService);
    animalService = TestBed.get(AnimalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get', () => {
    expect(service.profile).toBeFalsy();
    service.profile = {} as any;
    expect(service.profile).toBeTruthy();
  });

  it('should update', () => {
    const profile = {
      _id: 'id'
    } as any;
    expect(service.profile).toBeFalsy();
    service.notifyUpdate(profile);
    expect(service.profile).toBeTruthy();
  });

  it('should not update if ignoring notifications', () => {
    const profile = {
      _id: 'id'
    } as any;
    service.ignoreNotifications = true;
    expect(service.profile).toBeFalsy();
    service.notifyUpdate(profile);
    expect(service.profile).toBeFalsy();
  });

  it('should update profile', (done: DoneFn) => {
    const profile = {
      _id: 'id'
    } as any;
    service.profile = profile;
    spyOn(profileService, 'save').and.returnValue(of({ _id: 'id', name: 'Name' } as any));
    service.updateProfile({ _id: 'id', name: 'Name' } as any).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('Name');
      expect(service.profile.name).toEqual('Name');
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should add location', (done: DoneFn) => {
    service.profile = {
      locations: []
    } as any;
    const location = {
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    spyOn(locationService, 'save').and.returnValue(of(location));
    service.addLocation(location).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('Name');
      expect(service.profile.locations.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to update location', (done: DoneFn) => {
    service.profile = {
      locations: []
    } as any;
    const location = {
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    service.updateLocation(location).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should update location', (done: DoneFn) => {
    service.profile = {
      locations: [{
        _id: 'id',
        name: 'Name',
        geoLocation: {
          type: 'Point',
          coordinates: [0, 1]
        }
      }]
    } as any;
    const location = {
      _id: 'id',
      name: 'New Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    spyOn(locationService, 'save').and.returnValue(of(location));
    service.updateLocation(location).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('New Name');
      expect(service.profile.locations.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to remove location', (done: DoneFn) => {
    service.profile = {
      locations: []
    } as any;
    const location = {
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    service.removeLocation(location).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should remove location', (done: DoneFn) => {
    service.profile = {
      locations: [{
        _id: 'id',
        name: 'Name',
        geoLocation: {
          type: 'Point',
          coordinates: [0, 1]
        }
      }]
    } as any;
    const location = {
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    spyOn(locationService, 'delete').and.returnValue(of(location));
    service.removeLocation(location).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('Name');
      expect(service.profile.locations.length).toEqual(0);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should not have referenced location', () => {
    service.profile = {
      locations: [{
        _id: 'id'
      }],
      animals: []
    } as any;
    const res = service.isLocationReferenced('id');
    expect(res).toBeFalsy();
  });

  it('should have referenced location', () => {
    service.profile = {
      locations: [{
        _id: 'id'
      }],
      animals: [{
        locationId: 'id'
      }]
    } as any;
    const res =service.isLocationReferenced('id');
    expect(res).toBeTruthy();
  });

  it('should add species', (done: DoneFn) => {
    service.profile = {
      species: []
    } as any;
    const species = {
      commonName: 'Common name'
    };
    spyOn(speciesService, 'save').and.returnValue(of(species));
    service.addSpecies(species).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.commonName).toEqual('Common name');
      expect(service.profile.species.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to update species', (done: DoneFn) => {
    service.profile = {
      species: []
    } as any;
    const species = {
      _id: 'id',
      commonName: 'Common name'
    };
    service.updateSpecies(species).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should update species', (done: DoneFn) => {
    service.profile = {
      species: [{
        _id: 'id',
        commonName: 'Common name'
      }]
    } as any;
    const species = {
      _id: 'id',
      commonName: 'New name'
    };
    spyOn(speciesService, 'save').and.returnValue(of(species));
    service.updateSpecies(species).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.commonName).toEqual('New name');
      expect(service.profile.species.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to remove species', (done: DoneFn) => {
    service.profile = {
      species: []
    } as any;
    const species = {
      _id: 'id',
      commonName: 'Common name'
    };
    service.removeSpecies(species).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should remove species', (done: DoneFn) => {
    service.profile = {
      species: [{
        _id: 'id',
        commonName: 'Common name'
      }]
    } as any;
    const species = {
      _id: 'id',
      commonName: 'Common name'
    };
    spyOn(speciesService, 'delete').and.returnValue(of(species));
    service.removeSpecies(species).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.commonName).toEqual('Common name');
      expect(service.profile.species.length).toEqual(0);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should not have referenced species', () => {
    service.profile = {
      species: [{
        _id: 'id'
      }],
      animals: []
    } as any;
    const res = service.isSpeciesReferenced('id');
    expect(res).toBeFalsy();
  });

  it('should have referenced species', () => {
    service.profile = {
      species: [{
        _id: 'id'
      }],
      animals: [{
        speciesId: 'id'
      }]
    } as any;
    const res = service.isSpeciesReferenced('id');
    expect(res).toBeTruthy();
  });

  it('should add animal', (done: DoneFn) => {
    service.profile = {
      animals: []
    } as any;
    const animal = {
      name: 'Name',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    };
    spyOn(animalService, 'save').and.returnValue(of(animal));
    service.addAnimal(animal).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('Name');
      expect(service.profile.animals.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to update animal', (done: DoneFn) => {
    service.profile = {
      animals: []
    } as any;
    const animal = {
      _id: 'id',
      name: 'Name',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    };
    service.updateAnimal(animal).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should update animal', (done: DoneFn) => {
    service.profile = {
      animals: [{
        _id: 'id',
        name: 'Name'
      }]
    } as any;
    const animal = {
      _id: 'id',
      name: 'New name',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    };
    spyOn(animalService, 'save').and.returnValue(of(animal));
    service.updateAnimal(animal).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('New name');
      expect(service.profile.animals.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to update animals', (done: DoneFn) => {
    service.profile = {
      animals: []
    } as any;
    service.updateAnimals([{ _id: 'id1' }, { _id: 'id2' }] as any).subscribe(res => {
      fail('Should not have succeeded');
      done();
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should update animals', (done: DoneFn) => {
    service.profile = {
      animals: [{
        _id: 'id1',
        name: 'Name 1',
        locationId: 'id',
        speciesId: 'id',
        sex: 'M'
      }, {
        _id: 'id2',
        name: 'Name 2',
        locationId: 'id',
        speciesId: 'id',
        sex: 'M'
      }, {
        _id: 'id3',
        name: 'Name 3',
        locationId: 'id',
        speciesId: 'id',
        sex: 'M'
      }]
    } as any;
    const toUpdate = [{
      _id: 'id1',
      name: 'New name 1',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    }, {
      _id: 'id3',
      name: 'Name 3',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M',
      feedings: [{
        feedingDate: new Date(),
        quantity: 1,
        type: 'Type'
      }]
    }];
    spyOn(animalService, 'saveMulti').and.returnValue(of([toUpdate[0], service.profile.animals[1], toUpdate[1]]));
    service.updateAnimals(toUpdate).subscribe(res => {
      expect(res.length).toEqual(3);
      expect(service.profile.animals.length).toEqual(3);
      expect(service.profile.animals[0].name).toEqual('New name 1');
      expect(service.profile.animals[2].feedings.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
      done();
    });
  });

  it('should fail to remove animal', (done: DoneFn) => {
    service.profile = {
      animals: []
    } as any;
    const animal = {
      _id: 'id',
      name: 'Name',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    };
    service.removeAnimal(animal).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should remove animal', (done: DoneFn) => {
    service.profile = {
      animals: [{
        _id: 'id',
        name: 'Name',
        locationId: 'id',
        speciesId: 'id',
        sex: 'M'
      }]
    } as any;
    const animal = {
      _id: 'id',
      name: 'Name',
      locationId: 'id',
      speciesId: 'id',
      sex: 'M'
    };
    spyOn(animalService, 'delete').and.returnValue(of(animal));
    service.removeAnimal(animal).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.name).toEqual('Name');
      expect(service.profile.animals.length).toEqual(0);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should add image', (done: DoneFn) => {
    service.profile = {
      images: []
    } as any;
    const image = {
      title: 'Title'
    };
    spyOn(imageService, 'save').and.returnValue(of(image));
    service.addImage(image).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.title).toEqual('Title');
      expect(service.profile.images.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to update image', (done: DoneFn) => {
    service.profile = {
      images: []
    } as any;
    const image = {
      _id: 'id',
      title: 'Title'
    };
    service.updateImage(image).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should update image', (done: DoneFn) => {
    service.profile = {
      images: [{
        _id: 'id',
        title: 'Title'
      }]
    } as any;
    const image = {
      _id: 'id',
      title: 'New Title'
    };
    spyOn(imageService, 'save').and.returnValue(of(image));
    service.updateImage(image).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res.title).toEqual('New Title');
      expect(service.profile.images.length).toEqual(1);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

  it('should fail to remove image', (done: DoneFn) => {
    service.profile = {
      images: []
    } as any;
    const image = {
      _id: 'id',
      title: 'Title'
    };
    service.removeImage(image).subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should remove image', (done: DoneFn) => {
    service.profile = {
      images: [{
        _id: 'id',
        title: 'Title'
      }]
    } as any;
    const image = {
      _id: 'id',
      title: 'Title'
    };
    spyOn(imageService, 'delete').and.returnValue(of(image));
    service.removeImage(image).subscribe(res => {
      expect(res).toBeTruthy();
      expect(service.profile.images.length).toEqual(0);
      done();
    }, err => {
      fail('Should not have failed');
    });
  });

});
