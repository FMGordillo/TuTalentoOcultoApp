'use strict';
/*global $ */
function move() {
  window.location.href = '/'
}

function shareTwitterText() {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent("¿Conocés tus #TalentosOcultos? Preguntale a Watson y descubrí tu potencial http://bit.ly/talentowatson"))
}

var datos = function(data) {

  $('#results').on('resultsReady', showResults);

  function showResults() {
    $('#moreInfo').css('display', 'block').css('opacity', '1');
    formatResults(app.locals.twitz);
  }

  var careersList = $('#moreInfo');

  function formatResults(data) {
    if (!data) return;

    var careersList = $('#moreInfo .careers');
    careersList.empty();

    var mbti = '';

    switch (data.name) {
      case 'Extroversión': // Extraversion
        mbti += data.percentage > 0.5 ? 'E' : 'I';
        break;
      case 'Apertura a experiencias': //Openness
        mbti += data.percentage > 0.5 ? 'N' : 'S';
        break;
      case 'Amabilidad': // Agreeableness
        mbti += data.percentage > 0.5 ? 'F' : 'T';
        break;
      case 'Responsabilidad': //Conscientiousness
        mbti += data.percentage > 0.5 ? 'J' : 'P';
        break;
      }

  } // end formatResults()

    $.each(careers[sanitiseMbti(mbti)], function(i, career) {
      $('<li/>').text(career).appendTo(careersList);
    });

    function sanitiseMbti(value) {
      var sanitised = '';
      if (value.indexOf('E') >= 0) {
        sanitised += 'E';
      }
      if (value.indexOf('I') >= 0) {
        sanitised += 'I';
      }
      if (value.indexOf('N') >= 0) {
        sanitised += 'N';
      }
      if (value.indexOf('S') >= 0) {
        sanitised += 'S';
      }
      if (value.indexOf('F') >= 0) {
        sanitised += 'F';
      }
      if (value.indexOf('T') >= 0) {
        sanitised += 'T';
      }
      if (value.indexOf('J') >= 0) {
        sanitised += 'J';
      }
      if (value.indexOf('P') >= 0) {
        sanitised += 'P';
      }
      return sanitised;
    }

    var careers = {
      ISTJ: ['Ejecutivos de Negocios', 'Administradores y Gerentes', 'Contadores y Financieros', 'Detectives', 'Jueces', 'Abogados', 'Doctores y Dentistas', 'Programadores y Analistas de Sistemas'],
      ESTJ: ['Administradores y Gerentes', 'Detectives', 'Jueces', 'Financieros', 'Docentes', 'Representantes de Ventas'],
      ISFJ: ['Decoradores de Interiores', 'Diseñadores', 'Enfermeros', 'Administradores y Gerentes', 'Asistentes Administrativos', 'Trabajores Sociales y Consejeros', 'Asistentes Legales', 'Gerentes', 'Comerciantes'],
      ESFJ: ['Enfermeros', 'Docentes', 'Médicos', 'Gerentes', 'Trabajadores Sociales y Consejeros', 'Contadores', 'Asistentes Administrativos'],
      ISTP: ['Detectives', 'Patólogos Forenses', 'Programadores y Analista de Sistemas', 'Ingenieros', 'Carpinteros', 'Mecánicos', 'Pilotos, Conductores y Motociclistas', 'Atletas', 'Emprendedores'],
      ESTP: ['Representantes de Ventas', 'Especialistas en Marketing', 'Detectives', 'Paramédicos / Técnicos de Emergencias Médicas', 'Técnicos de PC y cableado', 'Soporte Técnico', 'Emprendedores', 'Atletas'],
      ESFP: ['Artista / Actor / Actriz', 'Representantes de Ventas', 'Trabajadores Sociales y Consejeros', 'Diseñadores de Moda', 'Decoradores de Interiores', 'Consultores', 'Fotógrafos'],
      ISFP: ['Artista', 'Músicos / Compositores', 'Diseñadores', 'Trabajadores Sociales y Consejeros', 'Docentes', 'Psicólogos', 'Veterinarios', 'Guardaparques', 'Pediatras'],
      ENTJ: ['Ejecutivos Corporativos', 'Emprendedores', 'Consultores de Teconología', 'Abogados', 'Jueces', 'Administradores y Gerentes', 'Docentes Universitarios'],
      INTJ: ['Científicos', 'Ingenieros', 'Docentes', 'Doctores y Dentistas', 'Administradores y Gerentes', 'Abogados', 'Jueces', 'Programadores y Analistas de Sistemas'],
      ENTP: ['Abogados', 'Psicólogos', 'Emprendendores', 'Fotógrafos', 'Consultores', 'Ingenieros', 'Científicos', 'Actor / Actriz', 'Representante de Ventas', 'Especialista en Marketing', 'Programadores y Analistas de Sistemas'],
      INTP: ['Físicos y Químicos', 'Fotógrafos', 'Planificadores Estratégicos', 'Matemáticos', 'Docentes Universitarios', 'Programadores y Analistas de Sistemas', 'Escritores Técnicos', 'Ingenieros', 'Abogados', 'Jueces', 'Investigadores Forenses', 'Silvicultores y Guardaparques'],
      ENFJ: ['Facilitadores', 'Consultores', 'Psicólogos', 'Trabajadores Sociales y Consejeros', 'Docentes', 'Representantes de Ventas', 'Especialistas en Recursos Humanos', 'Gerentes', 'Coordinadores de Eventos', 'Políticos y Diplomáticos', 'Escritores', 'Comunicadores'],
      INFJ: ['Docentes', 'Doctores y Dentistas', 'Doctores en diferentes especialidades', 'Psicólogos', 'Psiquíatras', 'Trabajadores Sociales y Consultores', 'Músicos y Artistas', 'Fotógrafos'],
      ENFP: ['Consultores', 'Psicólogos', 'Emprendedores', 'Actor / Actriz', 'Docentes', 'Consejeros', 'Políticos y Diplomáticos', 'Escritores', 'Periodistas', 'Programadores y Analistas de Sistemas', 'Científicos', 'Ingenieros', 'Artistas'],
      INFP: ['Escritores', 'Trabajadores Sociales y Consejeros', 'Docentes', 'Psicólogos', 'Psiquíatras', 'Músicos', 'Comunicadores']
    }

  console.log(mbti);
};
