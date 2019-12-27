import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { Post } from '@app/shared';
import { BaseComponent, CmsService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent extends BaseComponent implements OnInit {

  posts: Array<Post> = [];
  numResults = 0;
  page = 1;
  pageSize = 1;

  constructor(private cmsService: CmsService,
              private titleService: TitleService) {
    super();
  }

  loadPosts() {
    this.alerts = [];
    this.loading = true;
    const query = {
      content_type: 'post',
      order: '-sys.createdAt',
      limit: this.pageSize,
      skip: (this.page - 1) * this.pageSize
    };
    this.cmsService.getEntries(query).pipe(
      map(entries => {
        this.numResults = entries.total;
        const mPosts: Array<Post> = [];
        entries.items.forEach(p => {
          const options = {
            renderNode: {
              [BLOCKS.EMBEDDED_ASSET]: (node) => {
                const imageUrl = `https:${node.data.target.fields.file.url}`;
                return `<img class="img-fluid" src="${imageUrl}"></img>`;
              }
            }
          };
          const body = documentToHtmlString(p.fields.body, options);
          mPosts.push({
            createdAt: new Date(p.sys.createdAt),
            title: p.fields.title,
            body
          });
        });
        return mPosts;
      })
    ).subscribe(res => {
      this.posts = res;
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load posts'});
      this.loading = false;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;

    this.loadPosts();
  }

  ngOnInit() {
    this.titleService.setTitle('News');
    this.loadPosts();
  }

}
