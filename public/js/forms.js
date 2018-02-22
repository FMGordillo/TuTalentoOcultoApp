'use strict';
/*global $ */

function resetForm(form) {
  form.css('opacity', 1);
  form.attr('disabled', false);
}

$(document).ready(function() {
  console.log('ok go:', $('form'));
  $('form').on('submit', function(evt) {
    evt.preventDefault();
    var form = $(this);
    console.log('form submit:', form.attr('disabled'));
    if (form.attr('disabled')) return console.warn('form in progress STOP POSTING');
    form.attr('disabled', true);
    form.css('opacity', 0.5);

    console.log(form, form.attr('method'), form.attr('action'));

    /*
                  XXX ADVERTENCIA XXX
    Antes la información se recibía en bloque de texto a través del form
    Como lo recibimos ahora por una API de Twitter, debemos cambiar esto...
                  XXX ADVERTENCIA XXX
    */
    var data = $("tweetsAnalizados").serialize();

    $('.results').html('Performing detailed complicated analysis...').addClass('loading');
    $('body').addClass('loading');
    $('#form-error').html('');
    console.log(data);
    $.ajax({
      method: form.attr('method'),
      url: form.attr('action'),
      data: data,
      success: function(data) {
        console.log('form success:');
        $('#results').data('personality', data);
        $('#results').trigger('resultsReady');
        resetForm(form);

      },
      error: function(err) {
        console.log('form error:', err);
        resetForm(form);
        $('#form-error').html(err.responseText);
        // $('#results').trigger('resultsError');
        $('body').removeClass('loading');
      }
    });
  });
});
