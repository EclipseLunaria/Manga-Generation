import os
from PIL import Image
def main():
    DIR = "chapter-1"
    files = sorted(os.listdir(DIR), key=lambda x: int(x.split('-')[1].split('.')[0]))
    print(files)

    image1 = Image.open(os.path.join(DIR,files[0]))
    image1.convert("RGB")

    images = []
    for img in files[1:]:
        im = Image.open(os.path.join(DIR,img))
        im = im.convert("RGB")
        images.append(im)

    image1.save("output.pdf", save_all=True, append_images=images)


if __name__ == "__main__":
    main()
    