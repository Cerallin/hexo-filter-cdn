'use strict';

const cdn_filter = {
    enable: true,
    post_only: false,
    filter_html: {
        enable: true,
        img_tag: true,
        href_link: true,
        src_link: true,
    },
    filter_css: true,
    filter_js: true,
    relative_link: false,
    url: "https://test.com",
    img_url: "https://test.img.com",
}

const { test } = require('@jest/globals');
let Filter = require('../lib/filter');
let filter = new Filter({
    config: {
        relative_link: true,
        cdn_filter: cdn_filter
    }
});

test('Test HTML', () => {
    // Image tag
    expect(filter.processHTML('<img src="/img.png">', { path: "" }))
        .toBe('<img src="https://test.img.com/img.png">')
    // src
    expect(filter.processHTML('<script src="/test.js">', { path: "" }))
        .toBe('<script src="https://test.com/test.js">')
    // href
    expect(filter.processHTML('<a href="/about">', { path: "" }))
        .toBe('<a href="https://test.com/about">')
})

test('Test CSS', () => {
    // Image URL
    expect(filter.processCSS('background: url("/img.png")', { path: "" }))
        .toBe('background: url("https://test.img.com/img.png")')
    // Not image
    expect(filter.processCSS('src: url("/font.ttf")', { path: "" }))
        .toBe('src: url("https://test.com/font.ttf")')
})

test('Skip relative link', () => {
    // HTML
    expect(filter.processHTML('<img src="./img.png">', { path: "" }))
        .toBe('<img src="./img.png">')
    // CSS
    expect(filter.processCSS('background-image: url("../img.png")', { path: "" }))
        .toBe('background-image: url("../img.png")')
})