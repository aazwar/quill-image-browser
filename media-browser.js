/**
* Media Browser
* options:
*   parent: parent element
*   upload: upload function return array { url, name }
*   list: list image function, return promise that resolve to array of [{ url, name }]
*   multiSelect: false
*   callback: 
*/
class MediaBrowser {
  constructor(options) { //
    let cols;
    if (window.matchMedia('(min-width: 1024px)')) {
      cols = 6;
    } else if (window.matchMedia('(min-width: 768px)')) {
      cols = 4;
    } else {
      cols = 3;
    }
    let panel = new DOMParser().parseFromString(`<div id="mediaBrowser" style="inset: 1em; position: absolute; border-width: 1px; background-color: rgb(241 245 249); border-radius: 0.375rem; z-index: 1100;">
  <div style="display: flex; gap: 1rem; padding: 0.5rem; border-bottom-width: 2px; place-items: center;">
    <button style="height: 1.5rem; width: 1.5rem;" id="mediaUpload"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm143.6 28.9l72.4-75.5V392c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V209.4l72.4 75.5c9.3 9.7 24.8 9.9 34.3.4l10.9-11c9.4-9.4 9.4-24.6 0-33.9L273 107.7c-9.4-9.4-24.6-9.4-33.9 0L106.3 240.4c-9.4 9.4-9.4 24.6 0 33.9l10.9 11c9.6 9.5 25.1 9.3 34.4-.4z"/></svg></button>
    <button style="height: 1.5rem; width: 1.5rem;" id="urlLink"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"/></svg></button>
    <input type="text" placeholder="filter" style="border: 1px; padding: 0 0.5rem; ">
    <button style="height: 1.5rem; width: 1.5rem; margin-left: -0.75rem;" id="mediaSearch"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/></svg></button>
    <button style="height: 1.5rem; width: 1.5rem;" id="mediaOk"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"/></svg></button>
    <button style="height: 1.5rem; width: 1.5rem;" id="mediaCancel"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"/></svg></button>
  </div>
  <div style="display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: 1rem; padding: 1rem; max-height: 80%; overflow-y: auto;" id="imageContainer">
  </div>
  <div id="urlbox" style="padding: 0.5rem; position: absolute; top: 3.5rem; left: 2.5rem; border: solid 1px rgb(203 213 225); background-color: rgb(226 232 240); display: none;">
    <input type="text" style="padding: 0 0.5rem;">
    <button style="padding: 0 0.5rem;">Ok</button>
  </div>
  <input type="file" accept="image/*" style="visibility: hidden;">
</div>`, 'text/html').body.firstElementChild;
    this.template = new DOMParser().parseFromString(`<div style="position: relative;">
        ${options.multiSelect ? '<input style="position: absolute; top: 0.25rem; left: 0.25rem;" type="checkbox">' : ''}
        <img style="width: 100%; object-fit: cover; aspect-ratio: 1/1; margin: 0 !important; border-radius: 0.25rem; filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));" loading="lazy">
        <div style="font-size: 0.75rem; line-height: 1rem; padding: 0.25rem 0; text-overflow: ellipsis;"></div>
      </div>      
`, 'text/html').body.firstElementChild;
    this.panel = panel;
    this.imageContainer = panel.querySelector('#imageContainer');
    panel.querySelector('#mediaUpload').onclick = e => {
      e.preventDefault();
      this.uploader.value = '';
      this.uploader.click();
    };
    panel.querySelector('#mediaSearch').onclick = e => {
      e.preventDefault();
      this.search();
    };
    panel.querySelector('#mediaOk').onclick = e => {
      e.preventDefault();
      this.ok();
    };
    panel.querySelector('#mediaCancel').onclick = e => {
      e.preventDefault();
      this.detach();
    };
    panel.querySelector('#urlLink').onclick = e => {
      e.preventDefault();
      if (this.urlbox.style.display == 'none') {
        this.urlbox.style.display = 'block';
        this.urlbox.querySelector('input').focus();
      } else {
        this.urlbox.style.display = 'none';
      }
    }
    this.urlbox = panel.querySelector('#urlbox');
    // this.urlbox.querySelector('input').onblur = () => panel.querySelector('#urlLink').click();
    this.urlbox.querySelector('button').onclick = e => {
      e.preventDefault();
      let value = this.urlbox.querySelector('input').value;
      if (value) {
        this.callback([{ url: value, name: value.split('/').reverse()[0] }]);
      } else {
        this.urlbox.style.display = 'none';
      }

    }
    this.keyword = panel.querySelector('input');
    this.uploader = panel.querySelector('input[type="file"]');
    this.uploader.onchange = this.fileChanged.bind(this);
    this.parent = options.parent ? document.querySelector(options.parent) : document.body;
    this.options = options;
  }

  fileChanged() {
    if (!this.uploader.files.length) return;
    const file = this.uploader.files[0];
    this.options.upload(file).then(resp => {
      // { name: 'filename', url: 'url }
      let div = this.template.cloneNode(true);
      let img = div.querySelector('img');
      img.src = resp.url;
      if (!this.options.multiSelect)
        img.onclick = () => this.callback([resp.url]);
      div.querySelector('div').innerHTML = resp.name;
      this.imageContainer.prepend(div);
    })
  }

  callback(value) {
    this.options.callback(value);
    this.detach();
  }

  search() {
    let q = this.keyword.value;
    this.options.list(q).then(resp => this.fillList(resp));
  }

  detach() {
    this.parent.style.position = this.parentPos;
    this.panel.remove();
  }

  fillList(images) {
    this.imageContainer.innerHTML = '';
    images.forEach(img => {
      let div = this.template.cloneNode(true);
      let image = div.querySelector('img');
      image.src = img.url;
      if (!this.options.multiSelect)
        image.onclick = () => this.callback([image.src]);
      div.querySelector('div').innerHTML = img.name;
      this.imageContainer.appendChild(div);
    });
  }

  open() {
    this.parentPos = this.parent?.style.position;
    this.parent.style.position = 'relative';
    this.parent.append(this.panel);
    this.panel.querySelector('input').focus();
    this.options.list()
      .then(resp => {
        this.fillList(resp);
      })
  }

  ok() {
    let checked = this.imageContainer.querySelectorAll('input[type="checkbox"]:checked');
    let images = [...checked].map(c => c.nextElementSibling.src);
    this.options.callback(images);
    this.detach();
  }
}
