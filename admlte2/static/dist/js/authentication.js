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
function csrfSafeMethod(method) {
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function trimInputs(search) {
  inputs = $(search).find(':input:not(:checkbox,:button,:file)').not('select, input[type="hidden"]').blur(function(event) {
    this.value = this.value.trim() == '' ? this.defaultValue : this.value.trim();
  });
}

function showGenericErrors(errorMessages, id) {
  len = errorMessages.length
  if (len > 0) {
    errorDiv = `
    <div class="alert alert-danger alert-dismissible" role="alert" style="display: none">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>`;
    for (var i = 0; i < len; i++) {
      errorDiv += errorMessages[i];
      errorDiv += (i === len-1) ? '' : '<br>';
    }
    errorDiv += '</div>';
    $(errorDiv).insertAfter($(id).find('.overlay')).show();
  }
}

/* REGISTRO DE USUARIO */
function handleImageFromInput(input) {
  var mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpeg', 'image/jpg'];
  console.log(input.val());
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
    if(e.lengthComputable) {
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
  form = $(id).find('form');
  var $validator = $(form).validate({
    rules: {
      username: {
        minlength: 3,
        maxlength: 12,
        pattern: /^[a-zA-Z0-9]{3,12}$/
      },
      email: {
        email: true
      },
      password: {
        minlength: 6,
        maxlength: 13,
        pattern: /^[a-zA-Z0-9]{6,13}$/
      },
      password_confirm: {
        minlength: 6,
        maxlength: 13,
        pattern: /^[a-zA-Z0-9]{6,13}$/,
        equalTo: '#id_password'
      }
    },
    messages: {
      username: {
        required: 'Nombre de usuario requerido',
        minlength: 'El nombre de usuario debe tener al menos {0} caracteres',
        maxlength: 'El nombre de usuario permite tener máximo {0} caracteres',
        pattern: 'Introduce un nombre de usuario válido. e.g example123'
      },
      email: {
        required: 'Correo electrónico requerido',
        email: 'Introduce un correo válido. e.g example@hostexample.com'
      },
      password: {
        required: 'Contraseña requerida',
        minlength: 'La contraseña debe tener al menos {0} caracteres',
        maxlength: 'La contraseña permite tener máximo {0} caracteres',
        pattern: 'Introduce una contraseña alfanumérica válida'
      },
      password_confirm: {
        required: 'Verificación de contraseña requerida',
        minlength: 'La contraseña de verificación debe tener al menos {0} caracteres',
        maxlength: 'La contraseña de verificación permite tener máximo {0} caracteres',
        pattern: 'Introduce una contraseña alfanumérica válida',
        equalTo: 'Las contraseñas no coinciden, por favor verifique'
      }
    },
    submitHandler: function(form) {
      $('.alert').remove();
      $(id).find('.overlay').show();
      var formData = new FormData(form);
      $.ajax({
        url: $(form).attr('action'),
        type: 'POST',
        data: formData,
        xhr: function() {
          var myXhr = $.ajaxSettings.xhr();
          if(myXhr.upload){
            myXhr.upload.addEventListener('progress',progress, false);
          }
          return myXhr;
        },
        beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', $('[name=csrfmiddlewaretoken]').val());
          }
        },
        success: function(response) {
          $(id).find('.overlay').fadeOut(300);
          console.log('success');
          console.log(response);
          if (response.status === 'success') {
            window.location.replace(response.data.url);
          }
        },
        error: function(xhr) {
          $(id).find('.overlay').fadeOut(300);
          console.log('error');
          console.log(xhr.responseJSON);
          if (xhr.responseJSON != null) {
            data = xhr.responseJSON;
            if (data.status === 'error') {
              if (data.messages) {
                genericErrors = [];
                fieldErrors = {};
                for (var i in data.messages) {
                  if (i === '__all__') {
                    genericErrors = data.messages[i];
                  } else {
                    fieldErrors[i] = data.messages[i][0];
                  }
                }
                $validator.showErrors(fieldErrors);
                showGenericErrors(genericErrors, id);
              }
            }
          } else {
            showGenericErrors(['Falla en la conexión'],id);
          }
        },
        cache: false,
        contentType: false,
        processData: false
      });
    },
    errorElement: "em",
    errorPlacement: function(error, element) {
      error.addClass("help-block");
      
      if (element.prop("type") === "checkbox") {
        error.insertAfter(element.parent("label"));
      } else {
        error.insertAfter((element.attr('name') == 'avatar') ? $(element).parent('.avatar') : element);
      }
    },
    highlight: function(element, errorClass, validClass) {
      $(element).parents(".form-group").addClass("has-error").removeClass("has-success");
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).parents(".form-group").addClass("has-success").removeClass("has-error");
    }
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