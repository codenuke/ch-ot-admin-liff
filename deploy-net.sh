#scp -r dist/* ch-net:/docker/webserver/www/ch-line/public/line/ot
rsync -av  --delete dist/* ch-net:/docker/webserver/www/ch-line/public
