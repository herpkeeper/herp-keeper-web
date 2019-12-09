import { CoreModule } from './core.module';

describe('CoreModule', () => {
  let coreModule: CoreModule;

  beforeEach(() => {
    coreModule = new CoreModule(null);
  });

  it('should create an instance', () => {
    expect(coreModule).toBeTruthy();
  });

  it('should fail to create an instance if already loaded', () => {
    expect(() => {
      const m = new CoreModule(coreModule);
    }).toThrow(new Error('CoreModule has already been loaded. Import Core modules in the AppModule only.'));
  });

});
