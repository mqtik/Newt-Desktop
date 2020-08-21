import React, {Component} from 'react';

export const Languages = {
        bottomBarSettings: {
            en: 'Settings',
            es: 'Configuración'
        },
        bottomBarCreators: {
            en: 'Search',
            es: 'Buscar'
        }
    };

export const getLang = () => {
  let locale: string;
  // iOS
 
  //console.log("is eglish", locale.includes("en"), locale.includes("es"))

  return 'en';
}

export const getLangString = () => {
  let locale: string;
  // iOS
  //console.log("is eglish", locale.includes("en"), locale.includes("es"))

  return 'English';
}

export const arrayLanguages = {
  "ES":"Español",
  "EN":"English",
  "PR":"Portuguese",
  "NR": "Neerlandes"
}