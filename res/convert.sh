#
# Shell script that is using ImageMagick to create all the icon files from one source icon.
#
 
ICON=${1:-"my-hires-icon.png"}
SPLASH=${1:-"my-hires-splash-portrait.png"}

mkdir icon/android
convert $ICON -resize 36x36 icon/android/icon-36-ldpi.png
convert $ICON -resize 48x48 icon/android/icon-48-mdpi.png
convert $ICON -resize 72x72 icon/android/icon-72-hdpi.png
convert $ICON -resize 96x96 icon/android/icon-96-xhdpi.png

mkdir icon/ios
convert $ICON -resize 29 icon/ios/icon-29.png
convert $ICON -resize 40 icon/ios/icon-40.png 
convert $ICON -resize 50 icon/ios/icon-50.png 
convert $ICON -resize 57 icon/ios/icon-57.png
convert $ICON -resize 58 icon/ios/icon-29-2x.png
convert $ICON -resize 60 icon/ios/icon-60.png
convert $ICON -resize 72 icon/ios/icon-72.png
convert $ICON -resize 76 icon/ios/icon-76.png  
convert $ICON -resize 80 icon/ios/icon-40-2x.png
convert $ICON -resize 100 icon/ios/icon-50-2x.png
convert $ICON -resize 114 icon/ios/icon-57-2x.png     
convert $ICON -resize 120 icon/ios/icon-60-2x.png
convert $ICON -resize 144 icon/ios/icon-72-2x.png
convert $ICON -resize 152 icon/ios/icon-76-2x.png

mkdir screen/ios
convert $SPLASH -resize 640x1146 screen/ios/screen-iphone-portrait-568h-2x.png
convert $SPLASH -resize 750x1334 screen/ios/screen-iphone-portrait-667h.png
convert $SPLASH -resize 1241x2208 screen/ios/screen-iphone-portrait-736h.png
cp $SPLASH screen/ios/screen-iphone-portrait-736h.png

convert $SPLASH -crop 640x960+0x0 screen/ios/screen-iphone-portrait-2x.png
convert screen/ios/screen-iphone-portrait-2x.png -resize 320x480 screen/ios/screen-iphone-portrait.png

# convert $SPLASH -resize 2048x1496 ios/screen-ipad-landscape-2x.png
# convert $SPLASH -resize 1024x748 ios/screen-ipad-landscape.png
# convert $SPLASH -resize 1536x2008 ios/screen-ipad-portrait-2x.png
# convert $SPLASH -resize 768x1004 ios/screen-ipad-portrait.png
# convert $SPLASH -resize 960x640 ios/screen-iphone-landscape-2x.png
# convert $SPLASH -resize 480x320 ios/screen-iphone-landscape.png