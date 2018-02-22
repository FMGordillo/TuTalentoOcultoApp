/*eslint-env node */
"use strict";

require('dotenv').config();

var express = require("express");
var app = express(),
    request = require("request"),
    twitter = require("./lib/twitter.js")(process.env.TWITTER_URL),
    cloudant  = require("cloudant"),
    d3 = require("d3"),
    cfenv = require('./cfenv-wrapper'),
    appEnv = cfenv.getAppEnv();

require("./config/express")(app);

var Twit = require("twit"),
    PersonalityInsightsV3 = require("watson-developer-cloud/personality-insights/v3");

app.set("testDb", true);

// Valores por defecto
var err = "",
  title = "",
  countries = [
    "Argentina", "Bolivia", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay","Venezuela", "Otro"
  ],
  dbname = "tweets",
  usernameDb = "",
  passwordDb = "",
  usernamePI = "",
  passwordPI = "",
  T_consumer_key = "",
  T_consumer_secret = "",
  T_access_token = "",
  T_access_token_secret = "",
  datePI = "2016-10-20";

if(process.env.VCAP_SERVICES) {
    usernameDb=appEnv.getServiceCreds('FMGordillo-cloudantNoSQLDB').username;
    passwordDb=appEnv.getServiceCreds('FMGordillo-cloudantNoSQLDB').password;
    usernamePI=appEnv.getServiceCreds('Personality Insights-ss').username;
    passwordPI=appEnv.getServiceCreds('Personality Insights-ss').password;
    T_consumer_key=appEnv.getEnvVar("T_consumer_key");
    T_consumer_secret=appEnv.getEnvVar("T_consumer_secret");
    T_access_token=appEnv.getEnvVar("T_access_token");
    T_access_token_secret=appEnv.getEnvVar("T_access_token_secret");
} else {
  usernameDb= process.env.CLOUDANT_USERNAME;
  passwordDb= process.env.CLOUDANT_PW;
  usernamePI= process.env.PI_USERNAME;
  passwordPI= process.env.PI_PW;
  T_consumer_key= process.env.T_CONSUMER_KEY;
  T_consumer_secret= process.env.T_CONSUMER_SECRET;
  T_access_token= process.env.T_ACCESS_TOKEN;
  T_access_token_secret= process.env.T_ACCESS_TOKEN_SECRET;
}

cloudant({
    account: usernameDb,
    password: passwordDb
  }, function(err, cloudant) {
  if (err)
    return console.log("Error connecting to Cloudant account %s: %s", err.message);
  if (app.get("testDb"))
    dbname += "_test";
  console.log("using db:", dbname);
  app.tweetsdb = cloudant.use(dbname);
});

var personality_insights = new PersonalityInsightsV3({
  username: usernamePI,
  password: passwordPI,
  version_date: datePI
});

//var Twitter = require('twitter-node-client').Twitter;

/* Librerias personales */
var persUtils = require("./lib/personality-util");

var T = new Twit({
  consumer_key: T_consumer_key,
  consumer_secret: T_consumer_secret,
  access_token: T_access_token,
  access_token_secret: T_access_token_secret
});

//app.use(express.bodyParser());

app.set("views", "./views");
// app.set('view engine', 'jade');
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
// app.set('view options', {
//   layout: true
// });

app.get("/", function(req, res) {
  res.render("home", {
    title: "Tu Talento Oculto",
    layout: "layout.html",
    paises: countries
  });
});

// app.get("/search", function (req, res) {
app.post("/response", function (req, res, next) {
  var username = req.body.username;
  var country = req.body.inputPais;

  if(typeof(username) === "undefined" || !username) {
    console.log("post form: EMPTY");
    return res.status("400").render("error", {
      error: "Nombre de usuario no definido. Por favor, vuelva a intentarlo"
    });
  }
  console.log("post form: " + username );
  // Buscando Tweets...
  T.get('statuses/user_timeline', { screen_name: username, count: 2000}, function(err, data, body) {
  // twitter.search(500, encodeURIComponent(username), function (err, body) {
    if (err) {
      return res.status("400").render("error", {
        error: "Mensaje de Twitter: " + err
    }); }

    // ... armemos un texto ficticio
    // TODO: Poner filtros para hashtags, y links
    var output = "";
    // var tweetsLength = body.tweets.length;
    var tweetsLength = data.length;
    for(var i = 0; i < tweetsLength ; i++) {
      if(i === (tweetsLength - 1) ) {
        output += data[i].text + '.';
        break;
      }
      output += data[i].text + ', ';
    }
    // DEBUG
    console.log("Cantida de Tweets: " + tweetsLength);
    if(tweetsLength !== 0) {
      personality_insights.profile({text: output, headers: {'accept-language': 'en', 'content-language': 'es', 'accept': 'application/json' }}, function(err, tweetPersonality){
        if(err) {
          next(err);
          // res.send(err.error);
          return res.status('400').render('error', {
//            error: "Mensaje de Personality Insights" + err
            error: "Mensaje de Personality Insights: No tenés la cantidad suficiente de Tweets. Empezá a twittear e intentá nuevamente."
        });
      }

        var output = persUtils.matches(tweetPersonality);
        app.locals.twitz = output;
        var mbti = "";
        var carrersOutput = myFunction();

        function myFunction() {

          output.forEach(function(data, i) {
            var a = tweetPersonality.personality[i].percentile;
            switch (output[i].name) {
              // case "Extroversión": // Extraversion
              case "Extraversion": // Extraversion
                mbti += a > 0.5 ? "E" : "I";
                break;
              // case "Apertura a experiencias": //Openness
              case "Openness":
                mbti += a > 0.5 ? "N" : "S";
                break;
              // case "Amabilidad": // Agreeableness
              case "Agreeableness": // Agreeableness
                mbti += a > 0.5 ? "F" : "T";
                break;
              // case "Responsabilidad": //Conscientiousness
              case "Conscientiousness":
                mbti += a > 0.5 ? "J" : "P";
                break;
              }
          });

            console.log(mbti);

          var careers = { //Intercambie letras de lugar. Primero OPENESS y luego Conscientiousness, Extroversión y al final Agreeableness
            SJIT: ["Ejecutivos de Negocios", "Administradores y Gerentes", "Contadores y Financieros", "Detectives", "Jueces", "Abogados", "Doctores y Dentistas", "Programadores y Analistas de Sistemas"],
            SJET: ["Administradores y Gerentes", "Detectives", "Jueces", "Financieros", "Docentes", "Representantes de Ventas"],
            SJIF: ["Decoradores de Interiores", "Diseñadores", "Enfermeros", "Administradores y Gerentes", "Asistentes Administrativos", "Trabajores Sociales y Consejeros", "Asistentes Legales", "Gerentes", "Comerciantes"],
            SJEF: ["Enfermeros", "Docentes", "Médicos", "Gerentes", "Trabajadores Sociales y Consejeros", "Contadores", "Asistentes Administrativos"],
            SPIT: ["Detectives", "Patólogos Forenses", "Programadores y Analista de Sistemas", "Ingenieros", "Carpinteros", "Mecánicos", "Pilotos, Conductores y Motociclistas", "Atletas", "Emprendedores"],
            SPET: ["Representantes de Ventas", "Especialistas en Marketing", "Detectives", "Paramédicos / Técnicos de Emergencias Médicas", "Técnicos de PC y cableado", "Soporte Técnico", "Emprendedores", "Atletas"],
            SPEF: ["Artista / Actor / Actriz", "Representantes de Ventas", "Trabajadores Sociales y Consejeros", "Diseñadores de Moda", "Decoradores de Interiores", "Consultores", "Fotógrafos"],
            SPIF: ["Artista", "Músicos / Compositores", "Diseñadores", "Trabajadores Sociales y Consejeros", "Docentes", "Psicólogos", "Veterinarios", "Guardaparques", "Pediatras"],
            NJET: ["Ejecutivos Corporativos", "Emprendedores", "Consultores de Teconología", "Abogados", "Jueces", "Administradores y Gerentes", "Docentes Universitarios"],
            NJIT: ["Científicos", "Ingenieros", "Docentes", "Doctores y Dentistas", "Administradores y Gerentes", "Abogados", "Jueces", "Programadores y Analistas de Sistemas"],
            NPET: ["Abogados", "Psicólogos", "Emprendendores", "Fotógrafos", "Consultores", "Ingenieros", "Científicos", "Actor / Actriz", "Representante de Ventas", "Especialista en Marketing", "Programadores y Analistas de Sistemas"],
            NPIT: ["Físicos y Químicos", "Fotógrafos", "Planificadores Estratégicos", "Matemáticos", "Docentes Universitarios", "Programadores y Analistas de Sistemas", "Escritores Técnicos", "Ingenieros", "Abogados", "Jueces", "Investigadores Forenses", "Silvicultores y Guardaparques"],
            NJEF: ["Facilitadores", "Consultores", "Psicólogos", "Trabajadores Sociales y Consejeros", "Docentes", "Representantes de Ventas", "Especialistas en Recursos Humanos", "Gerentes", "Coordinadores de Eventos", "Políticos y Diplomáticos", "Escritores", "Comunicadores"],
            NJIF: ["Docentes", "Doctores y Dentistas", "Doctores en diferentes especialidades", "Psicólogos", "Psiquiatras", "Trabajadores Sociales y Consultores", "Músicos y Artistas", "Fotógrafos"],
            NPEF: ["Consultores", "Psicólogos", "Emprendedores", "Actor / Actriz", "Docentes", "Consejeros", "Políticos y Diplomáticos", "Escritores", "Periodistas", "Programadores y Analistas de Sistemas", "Científicos", "Ingenieros", "Artistas"],
            NPIF: ["Escritores", "Trabajadores Sociales y Consejeros", "Docentes", "Psicólogos", "Psiquíatras", "Músicos", "Comunicadores"]
          }
          return(careers[mbti]);
        }

        // app.tweetsdb.get("name: " + username, function(err, data) {
        //   console.log("Found dog:", data);
        // })
        var d = new Date();
        var date =  d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        console.log(date)

        app.tweetsdb.insert(
          {
            'name': username,
            'career': mbti,
            'countryTwitter': data[0].user.location,
            'countryInput': country,
            'date': date

      }, function(errDb,bodyDb,headerDb) {
        if(err) {
          console.log("Error creating document - ", err.message);
          return;
        }
        console.log("all records inserted.")
        console.log(bodyDb);
      });

        res.render("response",  {
          carrersOutput: carrersOutput
        }); // -- end RENDER
      }); // -- end Personality Insights

    } else {  //-- end IF
      if(!err) {
        return res.status("400").render("error", {
          error: "Mensaje Twitter: " + "No existe el nombre de usuario, o tu cuenta no tiene tweets suficientes."
      });
      }

    }
  }); // -- end Twitter Search
}); // -- end POST

require("./config/error-handler")(app);

var host = (process.env.VCAP_APP_HOST || "localhost");
process.setMaxListeners(0);
app.listen(process.env.PORT || 3000, host, function(){
  console.log("server funcionando en: " + host + ":" + (process.env.PORT || 3000))
});
