(() => {
  const getImagesInfo = async (files) => {
    function imgReader(file) {
      const reader = new FileReader()
      if (file) {
        if (file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'image/jpeg') {
          reader.readAsDataURL(file)
        } else {
          console.error('file type error')
        }
      } else {
        console.error('not file')
        return
      }

      return new Promise(resolve => {
        reader.addEventListener('load', () => {
          resolve(reader.result)
        }, false)
      })
    }

    function imgLoad(dataUrl) {
      if (!dataUrl) {
        console.error('imgLoad: not set dataUrl')
        return
      }
      const img = new Image()
      img.src = dataUrl
      return new Promise(resolve => {
        img.addEventListener('load', () => {
          resolve(img)
        }, false)
      })
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      let dataUrl = await imgReader(file)
      let imgInfo = await imgLoad(dataUrl)
      file.width = imgInfo.width
      file.height = imgInfo.height
      file.src = imgInfo.src
    }
    return files
  }

  const resizeImage = async (file, size) => {
    if (!size) {
      console.error('resizeImage', 'not set size')
      return
    }

    function dataURLToBlob(dataURL) {
      let BASE64_MARKER = ';base64,'
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
        let parts = dataURL.split(',')
        let contentType = parts[0].split(':')[1]
        let raw = parts[1]

        return new Blob([raw], { type: contentType })
      }

      let parts = dataURL.split(BASE64_MARKER)
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length

      let uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }

      return new Blob([uInt8Array], { type: contentType })
    }

    async function getReaderResult() {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise(resolve => {
        reader.onload = (readerEvent) => {
          resolve(readerEvent.target.result)
        }
      })
    }

    let readerEventResult = await getReaderResult()
    let image = new Image()
    image.src = readerEventResult

    return new Promise(resolve => {
      image.onload = () => {
        var canvas = document.createElement('canvas'),
          max_size = size,
          width = image.width,
          height = image.height;
        if (width > height) {
          height *= max_size / width
          width = max_size
        } else {
          width *= max_size / height
          height = max_size
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(image, 0, 0, width, height)
        let dataUrl = canvas.toDataURL('image/png')
        let resizedImage = dataURLToBlob(dataUrl)
        resolve({ resizedImage, canvas })
      }
    })
  }

  // 產生新的 File 物件
  const newImageFile = (images) => {
    const dataTransfer = new DataTransfer()

    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        const el = images[i]
        let tmpFile = new File([el], `${new Date().getTime()}.png`, {
          type: 'image/png',
        })
        dataTransfer.items.add(tmpFile)
      }

    } else {
      let tmpFile = new File([images], `${new Date().getTime()}.png`, {
        type: 'image/png',
      })
      dataTransfer.items.add(tmpFile)
    }
    return dataTransfer.files
  }

  // 取得圖片的 Base64 字符串
  const getInmage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // 當 FileReader 完成後，結果就是 Base64 編碼
        reader.onerror = reject; // 處理可能的錯誤
        reader.readAsDataURL(blob); // 將 Blob 轉換為 Base64 字符串
      });
    } catch (error) {
      console.error('get image error:', error);
      throw error;
    }
  }

  // 將 Base64 字符串轉換為 Blob, 以便上傳
  const base64ToImageBlob = (base64, mime) => {
    const byteString = atob(base64.split(',')[1]); // 將 base64 的數據部分解碼
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mime });
  }

  const uploadImage = async ({ imageBlob, url, accessToken }) => {
    const formData = new FormData();
    formData.append('file', imageBlob);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'x-access-token': accessToken
      }
    });
    const data = await response.json();
    return data;
  };

  const base64ToFilePNG = async (base64, filename) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], filename, { type: 'image/png' });
            resolve(file);
          } else {
            console.error('Canvas to blob failed');
            reject(new Error('Canvas to blob failed'));
          }
        }, 'image/png');
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  }

  const downloadImage = (imageBlob, filename) => {
    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.innerText = 'download'
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const blob2ImageBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
    });
  }

  window.getImagesInfo = getImagesInfo
  window.resizeImage = resizeImage
  window.newImageFile = newImageFile
  window.getInmage = getInmage
  window.base64ToImageBlob = base64ToImageBlob
  window.uploadImage = uploadImage
  window.base64ToFilePNG = base64ToFilePNG
  window.downloadImage = downloadImage
  window.blob2ImageBase64 = blob2ImageBase64
})()
