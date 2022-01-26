#!/bin/bash
blue=$(tput setaf 4)
normal=$(tput sgr0)

sudo apt install nodejs && sudo apt install npm && npm i puppeteer && printf "%40s\n" "${blue}Lancement du programme node (please wait 7 hours) :${normal}" && node pup_scrap_words.js;