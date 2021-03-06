'use strict';

module.exports = function (hexo) {
  let conf = hexo.config.cdn_filter;
  const url_for = require('hexo-util').url_for.bind(hexo);

  this.processHTML = function (content, data) {
    if (conf.filter_html.img_tag)
      content = replaceImg(content, conf.img_url);
    if (conf.filter_html.src_link)
      content = replaceSrc(content, conf.url);
    if (conf.filter_html.href_link)
      content = replaceHref(content, conf.url);
    return content;
  }

  this.processCSS = function (content, data) {
    content = replaceImgUrl(content, conf.img_url);
    content = replaceUrl(content, conf.url);
    return content;
  }

  function replace(content, reg, url, num = 0) {
    return content.replace(reg, function (str, ...matched) {
      let m = matched[num];
      m = m.replace(/^["'](.+(?=["']$))["']$/, '$1')
      // Do not replace string start with 'http' or '//'
      // or is relaive link
      if (m.search(/^(http|\/\/|\.+\/)/) > -1)
        return str;

      return str.replace(m, url + m);
    });
  }

  // Must be called before replaceSrc
  function replaceImg(content, url) {
    return replace(content, /<img.*?src=["'](.*?)["'].*?>/gi, url);
  }

  function replaceHref(content, url) {
    return replace(content, /href=["'](.*?)["']/gi, url);
  }

  function replaceSrc(content, url) {
    return replace(content, /src=["'](.*?)["']/gi, url);
  }

  // Must be called before replaceUrl
  function replaceImgUrl(content, url) {
    content = replace(content, /^background-?\w*?:\s*?url\(['"](((?!data:).)*)['"]\)/gi, url);
    content = replace(content, /cursor:\s*?url\(['"](((?!data:).)*)['"]\)/gi, url);
    return content;
  }

  function replaceUrl(content, url) {
    return replace(content, /url\(['"](((?!data:).)*)['"]\)/gi, url);
  }
}
