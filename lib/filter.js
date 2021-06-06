'use strict';

const path = require('path');

function replace(content, reg, url, options = {}) {
  options = Object.assign({
    num: 0,
    relative_link: false,
  }, options);

  return content.replace(reg, function (str, ...matched) {
    let m = matched[options.num];
    m = m.replace(/^["'](.+(?=["']$))["']$/, '$1')
    // Do not replace string start with 'http' or '//'
    if (m.search(/^(http|\/\/)/) > -1)
      return str;

    if (options.relative_link) {
      if (m.search(/^\.+\//) > -1) {
        let relative_link = url_for(options.file_path + '/' + m,);
        return str.replace(m, relative_link);
      } else
        return str;
    }

    return str.replace(m, url + m);
  });
}

// Must be called before replaceSrc
function replaceImg(content, url, options = {}) {
  return replace(content, /<img.*?src=["'](.*?)["'].*?>/gi, url, options);
}

function replaceHref(content, url, options = {}) {
  return replace(content, /href=["'](.*?)["']/gi, url, options);
}

function replaceSrc(content, url, options = {}) {
  return replace(content, /src=["'](.*?)["']/gi, url, options);
}

// Must be called before replaceUrl
function replaceImgUrl(content, url, options = {}) {
  content = replace(content, /background-?\w*?:\s*?url\((.*?)\)/gi, url, options);
  content = replace(content, /cursor:\s*?url\((.*?)\)/gi, url, options);
  return content;
}

function replaceUrl(content, url, options = {}) {
  return replace(content, /url\((.*?)\)/gi, url, options);
}

module.exports = function (hexo) {
  let conf = hexo.config.cdn_filter;
  const url_for = require('hexo-util').url_for.bind(hexo);

  this.processHTML = function (content, data) {
    let options = {
      file_path: data.path,
      relative_link: conf.relative_link,
    };

    if (conf.filter_html.img_tag)
      content = replaceImg(content, conf.img_url, options);
    if (conf.filter_html.src_link)
      content = replaceSrc(content, conf.url, options);
    if (conf.filter_html.href_link)
      content = replaceHref(content, conf.url, options);
    return content;
  }

  this.processCSS = function (content, data) {
    let options = {
      file_path: data.path,
      relative_link: conf.relative_link,
    };

    content = replaceImgUrl(content, conf.url, options);
    content = replaceUrl(content, conf.url, options);
    return content;
  }
}
