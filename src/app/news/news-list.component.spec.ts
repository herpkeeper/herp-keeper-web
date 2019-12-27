import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { NewsListComponent } from './news-list.component';
import { CmsService } from '@app/core';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;
  let cmsService: CmsService;

  let entries = {
    items: [{
      sys: {
        createdAt: new Date()
      },
      fields: {
      }
    }]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        NgxLoadingModule.forRoot({
          fullScreenBackdrop: true
        })
      ],
      declarations: [ NewsListComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    cmsService = TestBed.get(CmsService);
  });

  it('should fail to load posts on init', () => {
    spyOn(cmsService, 'getEntries').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    expect(component.posts.length).toBe(0);
    expect(component.alerts.length).toBe(1);
  });

  it('should load posts on init', () => {
    spyOn(cmsService, 'getEntries').and.returnValue(of(entries as any));
    fixture.detectChanges();
    expect(component.posts.length).toBe(1);
    expect(component.alerts.length).toBe(0);
  });

  it('should change page', () => {
    spyOn(cmsService, 'getEntries').and.returnValue(of(entries as any));
    fixture.detectChanges();
    component.changePage(2);
    expect(component.page).toBe(2);
  });

});
