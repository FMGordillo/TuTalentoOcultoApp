'use strict';
/*global $, google, TradeoffAnalytics*/

(function() {

  // $('#pasteCorpusLink').click(showPasteCorpus);
  $('#results').on('resultsReady', showResults);
  // function showPasteCorpus() {
    // $('#pasteCorpus').css('display', 'block');
  // }

  function showResults() {
    // $('#pasteCorpus').collapse();
    $('#results, #moreInfo, #tradeOff').css('display', 'block').css('opacity', '1');
    // formatResults($('#results').data('schools'));
    formatResults($('#results').data('personalities'));
  }

  function formatResults(data) {
    if (!data) return;

    if (data.isCached) {
      data.isCached = false; // to avoid the timeout next time
      setTimeout(function() {
        formatResults(data);
      }, 3000);
      return;
    }
    $('body').removeClass('loading');

    // var schoolsList = $('#results .schools');
    var personalitiesList = $('#results .personalities');
    var careersList = $('#moreInfo .careers');

    // schoolsList.empty();
    personalitiesList.empty();
    careersList.empty();

    $.each(data.matches.sort(function(a, b) {
      return b.score - a.score;
    }), function(i, school) {
      $('<li/>')
        .text(school.school_name)
        .appendTo(schoolsList)
        .hover(function() { // Cuando el mouse pasa por encima
          $('.school' + i).addClass('selected');
        }, function() {
          $('.school' + i).removeClass('selected');
        });
      var traitsText = [];
      $.each(school.traits, function(j, trait) {
        traitsText.push(trait.name);
      });
    });

    /*-- MBTI Analyzer --*/
    var mbti = ''; // https://es.wikipedia.org/wiki/Indicador_Myers-Briggs
    $.each(data.studentPersonality, function(i, personality) {
      var li = $('<li/>')
        .appendTo(personalitiesList);
      var sliderWidth = 5; // percents
      var sliderStart = Math.max(0, personality.percentage * 100 - sliderWidth / 2);
      var sliderEnd = Math.min(100, personality.percentage * 100 + sliderWidth / 2);
      var sliderColour = 'rgba(10, 190, 239, 0.5)';
      $('<span/>')
        .text(personality.name)
        .addClass('personalityScale')
        .addClass(personality.name)
        .css('background', 'linear-gradient(to right, transparent ' + sliderStart + '%, ' + sliderColour + ' ' + sliderStart + '%, ' + sliderColour + ' ' + sliderEnd + '%, transparent ' + sliderEnd + '%)')
        .appendTo(li);

      $.each(data.matches, function(i, school) {
        $.each(school.traits, function(j, trait) {
          if (trait.name === personality.name) {
            var sliderStart = Math.max(0, trait.percentage * 100 - sliderWidth / 2);
            var sliderEnd = Math.min(100, trait.percentage * 100 + sliderWidth / 2);
            var sliderColour = 'rgba(255, 10, 10, 0.5)';
            $('<span/>')
              .addClass('schoolTrait')
              .addClass('school' + i)
              .html('&nbsp;')
              .css('background', 'linear-gradient(to right, transparent ' + sliderStart + '%, ' + sliderColour + ' ' + sliderStart + '%, ' + sliderColour + ' ' + sliderEnd + '%, transparent ' + sliderEnd + '%)')
              .appendTo(li);
          }
        });
      });

      switch (personality.name) {
        case 'Extroversión': // Extraversion
          mbti += personality.percentage > 0.5 ? 'E' : 'I';
          break;
        case 'Apertura a experiencias': //Openness
          mbti += personality.percentage > 0.5 ? 'N' : 'S';
          break;
        case 'Amabilidad': // Agreeableness
          mbti += personality.percentage > 0.5 ? 'F' : 'T';
          break;
        case 'Responsabilidad': //Conscientiousness
          mbti += personality.percentage > 0.5 ? 'J' : 'P';
          break;
      }

    });

    /*-- Carrers divisor --*/
    $.each(careers[sanitiseMbti(mbti)], function(i, career) {
      $('<li/>').text(career).appendTo(careersList);
    });
    // if (data.tradeoff)
    //   initTradeoff(data.tradeoff);
  }

  var taClient;

  var onResultReady = function() {
    console.log('onResultReady');
    $('#taWidgetContainer').show();
    taClient.resize();
    $('#taWidgetLoader').hide();

  };

  var onResultSelection = function(place) {
    console.log('onResultSelection:', place);
  };

/*
  function createTradeoff(tradeoffData) {
    taClient = new TradeoffAnalytics({
      dilemmaServiceUrl: tradeoffData,
      customCssUrl: 'https://ta-cdn.mybluemix.net/v1/modmt/styles/watson.css',
      profile: 'basic',
      errCallback: function(err) {
        console.log('tradeoff init error:', err);
      }
    }, 'taWidgetContainer');

    taClient.start(function() {
      $.get(tradeoffData, function(data) {
        taClient.show(data.problem, onResultReady, onResultSelection);
      });
    });

  }
  */
/*
  function initTradeoff(tradeoffData) {
    $('#taWidgetContainer').hide();
    $('#taWidgetLoader').show();
    if (taClient) {
      taClient.destroy(function() {
        console.log('taClient.destroy(callback) done');
        createTradeoff(tradeoffData);
      });
    } else
      createTradeoff(tradeoffData);
  }
*/
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
    /** TIPOS DE PERSONALIDAD
    FUENTE = https://www.16personalities.com/es
    https://es.wikipedia.org/wiki/Indicador_Myers-Briggs
    * ISTJ = logistica
    * ESTJ = Ejecutiva
    * ISFJ = Defensor
    * ESFJ = Consul
    * ISTP = Virtuoso
    * ESTP = Emprendedor
    * ISFP = Aventurero
    * ENTJ = Comandante
    * INTJ = Arquitecto
    * ENTP = Innovador
    * INTP = Logico
    * ENFJ = Protagonista
    * INFJ = Abogado
    * ENFP = Activista
    * INFP = Mediador
    */
/*
    ISTJ: ['Business Executives, Administrators and Managers', 'Accountants and Financial Officers', 'Police and Detectives', 'Judges', 'Lawyers', 'Medical Doctors / Dentists', 'Computer Programmers or Systems Analysts', 'Military Leaders'],
    ESTJ: ['Military leaders', 'Business Administrators and Managers', 'Police / Detective work', 'Judges', 'Financial Officers', 'Teachers', 'Sales Representatives'],
    ISFJ: ['Interior Decorators', 'Designers', 'Nurses', 'Administrators and Managers', 'Administrative Assistants', 'Child Care / Early Childhood Development', 'Social Work / Counselors', 'Paralegals', 'Clergy / Religious Workers', 'Office Managers', 'Shopkeepers', 'Bookkeepers', 'Home Economics'],
    ESFJ: ['Home Economics', 'Nursing', 'Teaching', 'Administrators', 'Child Care', 'Family Practice Physician', 'Clergy or other religious work', 'Office Managers', 'Counselors / Social Work', 'Bookkeeping / Accounting', 'Administrative Assistants'],
    ISTP: ['Police and Detective Work', 'Forensic Pathologists', 'Computer Programmers, System Analysts', 'Engineers', 'Carpenters', 'Mechanics', 'Pilots, Drivers, Motorcyclists', 'Athletes', 'Entrepreneurs'],
    ESTP: ['Sales Representatives', 'Marketing Personnel', 'Police / Detective Work', 'Paramedic / Emergency Medical Technician', 'PC Technicians or Network Cablers', 'Computer Technical Support', 'Entrepreneurs', 'Athlete'],
    ESFP: ['Artists, Performers and Actors', 'Sales Representatives', 'Counselors / Social Work', 'Child Care', 'Fashion Designers', 'Interior Decorators', 'Consultants', 'Photographers'],
    ISFP: ['Artist', 'Musician / Composer', 'Designer', 'Child Care / Early Childhood Development', 'Social Worker / Counselor', 'Teacher', 'Psychologist', 'Veterinarian', 'Forest Ranger', 'Pediatrician'],
    ENTJ: ['Corporate Executive Officer; Organization Builder', 'Entrepreneur', 'Computer Consultant', 'Lawyer', 'Judge', 'Business Administrators and Managers', 'University Professors and Administrators'],
    INTJ: ['Scientists', 'Engineers', 'Professors and Teachers', 'Medical Doctors / Dentists', 'Corporate Strategists and Organization Builders', 'Business Administrators / Managers', 'Military Leaders', 'Lawyers / Attorneys', 'Judges', 'Computer Programmers or Systems Analysts'],
    ENTP: ['Lawyers', 'Psychologists', 'Entrepreneurs', 'Photographers', 'Consultants', 'Engineers', 'Scientists', 'Actors', 'Sales Representatives', 'Marketing Personnel', 'Computer Programmer or Systems Analyst'],
    INTP: ['Scientists - especially Physics, Chemistry', 'Photographers', 'Strategic Planners', 'Mathematicians', 'University Professors', 'Computer Programmers or Systems Analysts', 'Technical Writers', 'Engineers', 'Lawyers / Attorneys', 'Judges', 'Forensic Research', 'Forestry and Park Rangers'],
    ENFJ: ['Facilitator', 'Consultant', 'Psychologist', 'Social Worker / Counselor', 'Teacher', 'Clergy', 'Sales Representative', 'Human Resources', 'Manager', 'Events Coordinator', 'Sales Representative', 'Politicians / Diplomats', 'Writers'],
    INFJ: ['Clergy / Religious Work', 'Teachers', 'Medical Doctors / Dentists', 'Alternative Health Care Practitioners, i.e. Chiropractor, Reflexologist', 'Psychologists', 'Psychiatrists', 'Counselors and Social Workers', 'Musicians and Artists', 'Photographers', 'Child Care / Early Childhood Development'],
    ENFP: ['Consultant', 'Psychologist', 'Entrepreneur', 'Actor', 'Teacher', 'Counselor', 'Politician / Diplomat', 'Writer / Journalist', 'Television Reporter', 'Computer Programmer / Systems Analyst', 'Scientist', 'Engineer', 'Artist'],
    INFP: ['Writers', 'Counselors / Social Workers', 'Teachers / Professors', 'Psychologists', 'Psychiatrists', 'Musicians', 'Clergy / Religious Workers']
  };
  */
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
  };
/*
  function initializeMap() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(40.7401, -73.8694),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);

    var styles = [{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#44444' }]
    }, {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{
        color: '#2f2f2'
      }]
    }, {
      featureType: 'poi',
      elementType: 'all',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'poi.school',
      elementType: 'geometry.fill',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      featureType: 'poi.school',
      elementType: 'geometry.stroke',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      featureType: 'poi.school',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      featureType: 'road',
      elementType: 'all',
      stylers: [{
        saturation: -100
      }, {
        lightness: 45
      }]
    }, {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'transit',
      elementType: 'all',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'transit.line',
      elementType: 'all',
      stylers: [{
        visibility: 'on'
      }]
    }, {
      featureType: 'water',
      elementType: 'all',
      stylers: [{
        color: '#66BB0'
      }, {
        visibility: 'on'
      }]
    }];
    map.setOptions({
      styles: styles
    });
  }
  */
  // google.maps.event.addDomListener(window, 'load', initializeMap);
})();
