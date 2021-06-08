'use strict';

const cdn_filter = Object.assign({
  enable: false,
  post_only: true,
  filter_html: {
    enable: true,
    img_tag: true,
    href_link: false,
    src_link: true,
  },
  filter_css: false,
}, hexo.config.cdn_filter);

hexo.config.cdn_filter = cdn_filter;

if (!cdn_filter.enable)
  return;

if (!cdn_filter.img_url) {
  cdn_filter.img_url = cdn_filter.url;
} else if (cdn_filter.img_url.search(/^(http|\/\/)/) > -1) {
  cdn_filter.img_url = cdn_filter.url + cdn_filter.img_url;
}

let Filter = require('./lib/filter');
let filter = new Filter(hexo);

if (cdn_filter.post_only) {
  hexo.extend.filter.register('after_post_render', function (data) {
    data.content = filter.processHTML(data.content, { path: data.path });
    return data;
  });
} else {
  if (cdn_filter.filter_html.enable)
    hexo.extend.filter.register('after_render:html', filter.processHTML);
  if (cdn_filter.filter_css)
    hexo.extend.filter.register('after_render:css', filter.processCSS);
}
