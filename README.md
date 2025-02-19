# js_image_handler

use javascript handle image pre upload file

only support jpg / jpeg / png

## Usage

### getImagesInfo(FileList)

get image info from preupload file

* FileList(FileList): FileList object from HTML input file

### resizeImage(File, size)

resize image resolution

* File(File): a image file object that want to resize

* size(Int): resized size

this function return

* resizedImage(Blob): resized image binary object

* canvas(canvas): this canvas show resized image

### newImageFile(image)

resized image want to upload, use this function handle image to FileList

image(Blob|Blob Array): Blob object from `resizedImage`

this function return

* FileList(FileList): FileList object

### getInmage(imageUrl)

use Fetch api get image to handle canvas image CORS policy

* imageUrl(String): image url

this function return

* image base64 string

### base64ToImageBlob(base64, mime)

trans image base64 string to blob for upload image

* base64(String): image base64 string

* mime: image mime type, ex: `image/jpeg`, `image/png`

this function return

* image blob

### uploadImage({ imageBlob, url, accessToken })

this function is sample for upload image

```javascript
{
  imageBlob,
  url,
  accessToken
}
```

* imageBlob(Blob): image

* url: upload image api url

* accessToken: accessToken

this function return

* api response

### base64ToFilePNG(base64, filename)

trans image base64 to png

this function like base64ToImageBlob

* base64(String): image base64 string

* filename(String): file name

this function return

* image blob

### downloadImage(imageBlob, filename)

download image

* imageBlob(Blob): image

* filename(String): download file

### blob2ImageBase64(Blob)

trans binary image to base64 image

this function return

* base64 image string

### imageDataToBase64(data, width, height, mimeType)

trans image uint8Array to base64 image

* data(Uint8Array): image Uint8Array data
* width(number): image width
* height(number): image height
* mimeType(string): image mimeType, ex: "image/png"

this function return

* base64 image string
