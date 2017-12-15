#!/opt/local/bin/bash
# add this to your project folder
# replace path to server.js with whereever you decide to store (most sensibly is somewhere in your PATH
printf "Spinning up...\n\n"
node /Users/ramos/.config/apache2/htdocs/www/bin "${@}"
