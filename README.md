# hexo-filter-cdn

**hexo-filter-cdn** is a hexo plugin to replace URL links with your CDN configuration.

## Install
```shell
$ npm install hexo-filter-cdn --save
```

## Usage
Add configurations to `_config.yml`:

```yaml
cdn_filter:
  enable: true
  post_only: false # only render posts
  filter_css: true # CSS file
  filter_html: # HTML file
    enable: true
    img_tag: true # <img src="{URL}">
    href_link: false # Not recommand, <... href="{URL}">
    src_link: true # <... src="{URL}">
  url: https://your.cdn.com
  img_url: https://your.img.cdn.com
```

**Notice**: relative paths will not be replaced.

## Feature List
- [X] Replace URL of `src` attributes
- [X] Replace URL of `href` attributes
- [X] Replace URL in `img` tags
- [X] Filter HTML files
- [X] Option for post only
- [X] Filter CSS files
- [ ] Filter JS files

## License
GPL3+
