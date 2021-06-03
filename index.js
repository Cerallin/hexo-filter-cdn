'use strict';

const cdn_filter = Object.assign({
  enable: false,
  post_only: true,
  filter_html: true,
  filter_css: false,
  filter_js: false,
}, hexo.config.cdn_filter);

if (!cdn_filter.enable)
  return;

if (!cdn_filter.img_url) {
  cdn_filter.img_url = cdn_filter.url;
} else if (cdn_filter.img_url.search(/^(http|\/\/)/) > -1) {
  cdn_filter.img_url = cdn_filter.url + cdn_filter.img_url;
}

let Filter = require('hexo-generator-cdn/lib/filter');
let filter = new Filter(cdn_filter);

if (cdn_filter.post_only) {
  hexo.extend.filter.register('after_post_render', filter.processPost);
} else {
  if (cdn_filter.filter_html)
    hexo.extend.filter.register('after_render:html', filter.processHTML);
  if (cdn_filter.filter_css)
    hexo.extend.filter.register('after_render:css', filter.processCSS);
}
