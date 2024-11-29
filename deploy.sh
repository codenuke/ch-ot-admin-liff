#scp -r dist/* ch:/docker/webserver/www/ch-line/public/line/ot
rsync -av  --delete dist/* ch:/docker/webserver/www/ch-line/public

