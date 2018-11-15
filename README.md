# ⛔️ PLEASE READ FIRST

This project has been **deprecated**, please see [this repo](https://github.com/FMGordillo/TuTalentoOculto) instead


# Tu Talento Oculto

Basada en la película [Talentos Ocultos](https://es.wikipedia.org/wiki/Hidden_Figures) creamos este portal en el cual:
- Obtenemos tus últimos tweets
- Y basándonos en el [modelo de los cinco grandes](https://es.wikipedia.org/wiki/Modelo_de_los_cinco_grandes) y consumiendo [IBM Watson Personality Insights](https://www.ibm.com/watson/services/personality-insights/)
- Generamos *un listado de las posibles profesiones/campos de estudio para vos!*

# Install

1. Crear archivo `.env` con las siguientes variables

```
# TBD no recuerdo de dónde saqué esto
TWITTER_URL=https://6fc63a03-fc7f-446c-b736-f8ad9a7304fc:ERgDtx81Df@cdeservice.mybluemix.net

# Desde IBM Cloud (IBM Cloudant)
CLOUDANT_USERNAME=xxxx-xxxx-xxxx-xxxxxx
CLOUDANT_PW=xxxxxxxxxxxxxxxxxxxx

# Desde IBM Cloud (Personality Insights)
PI_USERNAME=xxxxxxxx-xxxxxx-xxxxx-xxxxxxx
PI_PW=xxxxxxxxx

# Desde Twitter Apps
T_CONSUMER_KEY=l7icOfbSvrImgjmURD8XLtpch
T_CONSUMER_SECRET=mtY5Z71rYIJQJaKFn2HDs056rQpIZC2IhTR5yJPWX6GPtyzykk
T_ACCESS_TOKEN= 124620647-EHakGGr9IEDeF6zWMpCZmfhv9tkejSDyODpbVJ72
T_ACCESS_TOKEN_SECRET=AYQHCar44c23VYGbR1uH6rwUePHSjYA6iAXj6SZXvXQcV
```

2. `npm install`

3. `npm start` o [nodemon](https://www.npmjs.com/package/nodemon)

# Pendings
- [ ] Dividir el código en partes más chicas
- [ ] ¿Cambiar de plataforma?
- [ ] Release v2
