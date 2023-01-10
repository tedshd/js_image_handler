# js_image_handler

use javascript handle image pre upload file

## Usage

### getImagesInfo(FileList)

get image info from preupload file

FileList(FileList): FileList object from HTML input file

### resizeImage(File, size)

resize image resolution

File(File): a image file object that want to resize

size(Int): resized size

return

resizedImage(Blob): resized image binary object

canvas(canvas): this canvas show resized image

### newImageFile(image)

resized image want to upload, use this function handle image to FileList

image(Blob): Blob object from `resizedImage`