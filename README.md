# UADE - Seminario de Integración Profesional

Grupo 6 - Trabajo Práctico

Integrantes

* QUINTEROS PARADA, Juan Ignacio

## ¿Cómo correr esta app?

Primero, lo obvio: [Instalar NodeJS versión LTS para Windows](https://nodejs.org/en/download/).

Luego, instalar la aplicación de Expo en sus celulares. Se llama **Expo Go**.

Clonar o descargar este repositorio, es lo mismo. Lo importante
es que esté en un directorio.

En `App.js` casi arriba de todo hay una variable llamada `backend_ip`. Bueno, esta variable es la que tiene que tener la IP de la PC donde está corriendo el backend. En mi caso era `192.168.0.6:8080`, pero ustedes ahí tendrían que poner la IP de sus respectivas PC en la red de sus casas. Para saber cuál es simplemente vayan al `cmd`, escriban `ipconfig` y ahí les tiene que aparece algo similar a:

```
Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . : fibertel.com.ar
   Link-local IPv6 Address . . . . . : fe80::b194:3942:7db7:d%18
   IPv4 Address. . . . . . . . . . . : 192.168.0.6
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.0.1
```

En este caso la IP sería `192.168.0.6`, y el puerto que hay que agregarle al final es `8080`, así que en `App.js` debería ir:

```js
const backend_ip = "192.168.0.6:8080"
```

Luego, volvemos a la PC abrimos `cmd`, y vamos a la carpeta de este proyecto (el comando
para cambiar de carpeta es `cd`).
Ahí, escribimos:

```sh
npm install # Para instalar todas las dependencias
npm start # Para iniciar el servidor de Expo
```

Con esto, ya va a quedar corriendo el servidor de Expo que se
va a encargar de compilar nuestra app para mandarla al celular.
