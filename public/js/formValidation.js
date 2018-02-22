$(function) {
  $("form[name='myForm']").validate({
    rules:{
      inputTwitter: "required",
      inputPais: "required"
    }
    messages: {
      inputTwitter: "Por favor ingrese su usuario de Twitter"
    }
    submitHandler: function(form) {
      form.submit();
    }
  })
}
