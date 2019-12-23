import { SexPipe } from './sex.pipe';

describe('SexPipe', () => {
  let pipe: SexPipe;

  beforeEach(() => {
    pipe = new SexPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transorm', () => {
    let res = pipe.transform('m');
    expect(res).toEqual('male');
    res = pipe.transform('f');
    expect(res).toEqual('female');
    res = pipe.transform('u');
    expect(res).toEqual('unknown');
  });

  it('should transform icon', () => {
    let res = pipe.transform('m', 'icon');
    expect(res).toEqual('mars');
    res = pipe.transform('f', 'icon');
    expect(res).toEqual('venus');
    res = pipe.transform('u', 'icon');
    expect(res).toEqual('question');
  });

});
