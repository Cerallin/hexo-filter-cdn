'use strict';

function replace(content, reg, url, num = 0) {
  return content.replace(reg, function (str, ...matched) {
    let m = matched[num];
    m = m.replace(/^["'](.+(?=["']$))["']$/, '$1')
    // Do not replace string start with 'http' or '//'
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
  content = replace(content, /background-?\w*?:\s*?url\((.*?)\)/gi, url);
  content = replace(content, /cursor:\s*?url\((.*?)\)/gi, url);
  return content;
}

function replaceUrl(content, url) {
  return replace(content, /url\((.*?)\)/gi, url);
}

module.exports = function (cdn_config) {
  let conf = cdn_config;

  function process(content) {
    content = replaceImg(content, conf.img_url);
    content = replaceSrc(content, conf.url);
    content = replaceHref(content, conf.url);
    return content;
  }

  this.processPost = function (data) {
    data.content = process(data.content);
    return data;
  }

  this.processHTML = function (content) {
    return process(content);
  }

  this.processCSS = function (content) {
    content = replaceImgUrl(content, conf.url);
    content = replaceUrl(content, conf.url);
    return content;
  }
}
