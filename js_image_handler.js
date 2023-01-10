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

    function dataURLToBlob (dataURL) {
      let BASE64_MARKER = ';base64,';
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
    image.src = readerEventResult;

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
        console.log('resizedImage', resizedImage)
        resolve({resizedImage, canvas})
      }
    })
  }

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
    return dataTransfer.files;
  }

  window.getImagesInfo = getImagesInfo
  window.resizeImage = resizeImage
  window.newImageFile = newImageFile
})()
