# quill-image-browser
Image browser for Quill text editor. 

# Usage
``` js
<script src="/js/quill/quill.min.js"></script>
<script src="/js/media-browser.js"></script>
<script>
  let quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [['bold', 'italic'], ['image']],
        handlers: {
          image: () => {
            const callback = url => {
              let range = quill.getSelection(true);
              quill.insertEmbed(range.index, "image", `${url}`);
            };
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
              callback,
            }).open();
          }
        }
      }
    }
  })
</script>
```

![Image Browser](/quill-image-browser.png)
