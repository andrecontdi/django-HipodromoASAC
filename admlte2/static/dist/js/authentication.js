/* FUNCIONES GENÉRICAS */
function checkIcheckExists() {
  if ($('div.icheckbox_square-blue').length < 1) {
    var icheck = $('input').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' // optional
    });
    $(icheck).on('ifChanged', function(event){
      this.setCustomValidity('');
    });
  }
}

/* FUNCIONES DE LAS <FORM> DE LA PÁGINA INDEX */
function validateUsername(username) {
  var check = /^[a-zA-Z0-9]{3,12}$/;
  return check.test(username);
}

function validateEmail(email) {
  var check = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return check.test(email);
}

function checkInputs(input, errorMessage, isLogin) {
  if (input.value == '' || input.value.trim() == '') {
    input.setCustomValidity('Por favor completa este campo.');
  } else if (isLogin && !validateUsername(input.value.trim()) && !validateEmail(input.value.trim())) {
    input.setCustomValidity(errorMessage);
  } else if (input.validity.patternMismatch && !isLogin) {
    input.setCustomValidity(errorMessage);
  }
  else {
    input.setCustomValidity('');
  }
}

function trimInputs(search) {
  inputs = $(search).find(':input:not(:checkbox,:button,:file)').not('select, input[type="hidden"]').blur(function(event) {
    this.value = this.value.trim() == '' ? this.defaultValue : this.value.trim();
  });
}


/* REGISTRO DE USUARIO */
function handleImageFromInput(input) {
  var mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpeg', 'image/jpg'];
  $(input).change(function(event) {
    event.preventDefault();
    if ($.inArray($(input)[0].files[0].type, mimeTypes) != -1) {
      if (input[0].files && input[0].files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#box-registrar img').attr('src', e.target.result);
        };
        reader.readAsDataURL(input[0].files[0]);
      }
    }
  });
  $(input).prev().click(function(event) {
    event.preventDefault();
    $(input).trigger('click');
  });
}

function executeRegisterFormRequest(id) {
  function progress(e) {
    if(e.lengthComputable){
        var max = e.total;
        var current = e.loaded;
        var Percentage = (current * 100)/max;
        console.log(Percentage);
        if(Percentage >= 100) {
           // process completed
           console.log('Complete YEAAAH!!');
        }
    }
  }
  $(id).find('form').submit(function(event) {
    event.preventDefault();
    $(id).find('.overlay > .fa').show();
    var formData = new FormData(this);
    var usu_nombre = $(inputs)[0];
    var usu_correo = $(inputs)[1];
    var usu_clave = $(inputs)[2];
    var usu_clavev = $(inputs)[3];
    var error_label = $(id).find('.social-auth-links label');
    $(error_label).addClass('invisible');

    $.ajax({
        url: 'user-connection.inc.php',
        type: 'POST',
        data: formData,
        xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',progress, false);
                }
                return myXhr;
        },
        success: function (data) {
          $(id).find('.overlay > .fa').fadeOut(300);
          var dataResponse = JSON.parse(data);
          console.log(dataResponse.response.data);
          if (dataResponse.action.action === 'success') {
            //window.location.replace(_ROOT + 'pages/');
          }
        },
        error: function(data) {
          $(id).find('.overlay > .fa').fadeOut(300);
          console.log(data);
          var dataResponse = JSON.parse(data.responseText);
          if (data.status === 409) {
            if (dataResponse.action.type === 'usu_nombre') {
              $(usu_nombre).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_correo).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clavev).parent().removeClass('has-error').addClass('has-feedback');
            } else if (dataResponse.action.type === 'usu_correo') {
              $(usu_nombre).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_correo).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clave).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clavev).parent().removeClass('has-error').addClass('has-feedback');
            } else if (dataResponse.action.type === 'usu_clave') {
              $(usu_nombre).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_correo).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clavev).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).val('');
              $(usu_clavev).val('');
            } else if (dataResponse.action.type === 'usu_clavev') {
              $(usu_nombre).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_correo).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clavev).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clave).val('');
              $(usu_clavev).val('');
            } else if (dataResponse.action.type === 'both_password') {
              $(usu_nombre).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_correo).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clavev).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clave).val('');
              $(usu_clavev).val('');
            }
          }
          $(error_label).text(dataResponse.response.data).removeClass('invisible');
        },
        cache: false,
        contentType: false,
        processData: false
    });
  });
}

/* INICIAR SESIÓN DE USUARIO */
function executeLoginFormRequest(id) {
  $(id).find('form').submit(function(event) {
    event.preventDefault();
    $(id).find('.overlay > .fa').show();
    var formData = new FormData(this);
    var usu_nombre = $(inputs)[0];
    var usu_clave = $(inputs)[1];
    var error_label = $(id).find('.social-auth-links label');
    $(error_label).addClass('invisible');
    
    $.ajax({
        url: 'user-connection.inc.php',
        type: 'POST',
        data: formData,
        success: function (data) {
          $(id).find('.overlay > .fa').fadeOut(300);
          var dataResponse = JSON.parse(data);
          console.log(data);
          console.log(dataResponse.response.data);
          if (dataResponse.action.action === 'success') {
            //window.location.replace(_ROOT + 'pages/');
          }
        },
        error: function(data) {
          $(id).find('.overlay > .fa').fadeOut(300);
          console.log(data);
          var dataResponse = JSON.parse(data.responseText);
          if (data.status === 409) {
            if (dataResponse.action.type === 'usu_nombre' || dataResponse.action.type === 'empty') {
              $(usu_nombre).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clave).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).val('');
            } else if (dataResponse.action.type === 'usu_clave') {
              $(usu_nombre).parent().removeClass('has-error').addClass('has-feedback');
              $(usu_clave).parent().removeClass('has-feedback').addClass('has-error');
              $(usu_clave).val('');
            }
          }
          $(error_label).text(dataResponse.response.data).removeClass('invisible');
        },
        cache: false,
        contentType: false,
        processData: false
    });
  });
}

/* FUNCIONES DE LA PÁGINA INDEX */
$(document).ready(function() {
  $('#bg-video').videoBackground(_DIST_ROOT + 'videos/racehorseslowmotion-hd.mp4');
  var box_registrar = $('#box-registrar');
  var box_iniciarsesion = $('#box-iniciarsesion');
  var box_title = $('#box-title');
  $(box_registrar).remove();
  $(box_iniciarsesion).remove();

  $(document).on('click', '#btn-registrar', function(event) {
    event.preventDefault();
    $(box_title).remove();
    box_registrar.insertAfter('#bg-video');
    checkIcheckExists();
    trimInputs(box_registrar);
    handleImageFromInput($(box_registrar).find('input[type="file"]'));
    executeRegisterFormRequest(box_registrar);
    $(box_registrar).css('display','flex').hide().fadeIn(500);
  });

  $(document).on('click', '#btn-iniciarsesion', function(event) {
    event.preventDefault();
    $(box_title).remove();
    box_iniciarsesion.insertAfter('#bg-video');
    checkIcheckExists();
    trimInputs(box_iniciarsesion);
    executeLoginFormRequest(box_iniciarsesion);
    $(box_iniciarsesion).css('display','flex').hide().fadeIn(500);
  });

  $(document).on('click', '#btn-rg-regresar', function(event) {
    event.preventDefault();
    $(box_registrar).remove();
    box_title.insertAfter('#bg-video');
    $(box_title).hide().fadeIn(500);
  });

  $(document).on('click', '#btn-is-regresar', function(event) {
    event.preventDefault();
    $(box_iniciarsesion).remove();
    box_title.insertAfter('#bg-video');
    $(box_title).hide().fadeIn(500);
  });

  $(document).on('click', '#btn-rg-iniciarsesion', function(event) {
    event.preventDefault();
    $(box_registrar).remove();
    box_iniciarsesion.insertAfter('#bg-video');
    checkIcheckExists();
    trimInputs(box_iniciarsesion);
    executeLoginFormRequest(box_iniciarsesion);
    $(box_iniciarsesion).css('display','flex').hide().fadeIn(500);
  });

  $(document).on('click', '#btn-is-registrar', function(event) {
    event.preventDefault();
    $(box_iniciarsesion).remove();
    box_registrar.insertAfter('#bg-video');
    checkIcheckExists();
    trimInputs(box_registrar);
    handleImageFromInput($(box_registrar).find('input[type="file"]'));
    executeRegisterFormRequest(box_registrar);
    $(box_registrar).css('display','flex').hide().fadeIn(500);
  });
});