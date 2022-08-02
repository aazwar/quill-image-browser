# quill-image-browser

![npm (scoped)](https://img.shields.io/npm/v/@roel.id/quill-image-browser?style=plastic)
![NPM](https://img.shields.io/npm/l/@roel.id/quill-image-browser?style=plastic)
![npm](https://img.shields.io/npm/dm/@roel.id/quill-image-browser?style=plastic)

`quill-image-browser` is image browser module for Quill text editor. By default, Quill embed image into post as base64 string, which make the post unnecessarily large. There is [`quill-image-uploader`](https://github.com/noeloconnell/quill-image-uploader) module that overcome this problem. And better, this module can intercept dragged or pasted image, and upload to server. But how if one wants to pick previously uploaded image? Then `quill-image-browser` come to rescue.

# Usage
``` html
<script src="/js/quill/quill.min.js"></script>
<script src="/js/media-browser.min.js"></script>
<script>
  let quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [['bold', 'italic'], ['image']],
        handlers: {
          image: () => {
            new MediaBrowser({
              parent: '.ql-container',
              upload: file => {// upload file to server, return url,
                return new Promise(resolve => {
                  // const formData = new FormData();
                  // formData.append("file", file);
                  // axios.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data'} })
                  //   .then(resp => resolve(resp.data) )
                  resolve({ url: 'https://picsum.photos/id/23/300/200.webp', name: 'Forks' });
                })
              },
              list: keyword => { // list of image [{url, title}], filtered by keyword
                return new Promise(resolve => {
                  // axios.post('/get-images', { keyword }, ).then(resp => resolve(resp.data));
                  let images = [
                    { url: 'https://picsum.photos/id/20/300/200.webp', name: 'Mac & iPhone' },
                    { url: 'https://picsum.photos/id/21/300/200.webp', name: 'High heel' },
                    { url: 'https://picsum.photos/id/22/300/200.webp', name: 'Walking' },
                  ];
                  resolve(keyword ? images.filter(e => e.name.match(new RegExp(keyword, 'i'))) : images);
                })
              },
              callback: url => {
                let range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", `${url}`);
              },
            }).open();
          }
        }
      }
    }
  })
</script>
```

![Image Browser](/quill-image-browser.png)

# Using together with `quill-image-uploader`
We can use `quill-image-browser` along side with `quill-image-uploader` by creating a new class that extends `ImageUploader`.

``` js
class ImageBrowser extends ImageUploader {
  constructor(quill, options) {
    super(quill, options);
    this.range = null;
    const toolbar = quill.getModule("toolbar");
    toolbar.addHandler("image", this.browseLocalImage.bind(this));
    this.mediaBrowser = new MediaBrowser({
      parent: '.ql-container',
      upload: options.upload,
      list: options.list,
      callback: this.callback.bind(this),
    });
  }

  browseLocalImage() {
    this.range = this.quill.getSelection();
    this.mediaBrowser.open();
  }

  callback(images) {
    this.quill.insertEmbed(this.range.index, "image", `${images[0]}`, "user");
  }
}
```

In this class, we replace the `image` handler, and let parent class catch image drop or paste event as usual.