function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie != '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
let csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
$(document).ready(function () {
    $("#login-form").submit(function (e) {
        e.preventDefault();
        let login_btn = $('#login-button');
        login_btn.addClass('disabled');
        let url = $(this).data('url');
        $.ajax({
            url: url,
            type: "POST",
            data: {
                    email: $(this).find('input[name="email"]').val(),
                    password: $(this).find('input[name="password"]').val()
                },
            success: function (data) {
                let message_box = $('.login-message');
                message_box.text(data.message);
                window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                let message_box = $('.login-message');
                message_box.text(data.message);
            }
        });
        login_btn.removeClass('disabled')
        return false;
    });
    $("#registration-form").submit(function (e) {
        e.preventDefault();
        let registration_btn = $('#register-button');
        registration_btn.addClass('disabled');
        let url = $(this).data('url');
        $.ajax({
            url: url,
            type: "POST",
            data: {
                    email: $(this).find('input[name="email"]').val(),
                    password: $(this).find('input[name="password"]').val(),
                    first_name: $(this).find('input[name="first_name"]').val(),
                    last_name: $(this).find('input[name="last_name"]').val(),
                    username: $(this).find('input[name="username"]').val(),
                },
            success: function (data) {
                let message_box = $('.registration-message');
                message_box.text(data.message);
                window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                let message_box = $('.registration-message');
                message_box.html(data.message);
            }
        });
        registration_btn.removeClass('disabled')
        return false;
    });

    let basketApiUrl = $(".main-marketplace-navigation").data("basket-api");
    $(".add-basket-item").on("click", function (e) {
        e.preventDefault();
        let me = $(this);
        me.addClass('disabled');
        $.ajax({
            url: basketApiUrl,
            type: "POST",
            data: {
                    product_slug: me.data("product-slug"),
                    quantity: me.data("quantity")
                },
            success: function (data) {
                me.text(Translations.added_to_basket)
                me.removeClass("btn-danger");
                me.addClass("btn-success");
                // window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                me.text(data.message);
                me.removeClass('disabled')
            }
        });
    })
    $(".apply-coupon-code").on("click", function (e) {
        e.preventDefault();
        let me = $(this);
        me.addClass('disabled');
        $.ajax({
            url: basketApiUrl,
            type: "PATCH",
            data: {
                coupon_code: me.data("coupon-code")
            },
            success: function (data) {
                window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                me.text(data.message);
                me.removeClass('disabled')
            }
        });
    })
    $('.number-input').change(function (e) {
        let me = $(this);
        $.ajax({
            url: basketApiUrl,
            type: "PATCH",
            data: {
                quantity: me.val(),
                basket_item_id: me.data("basket-item-id")
            },
            success: function (data) {
                window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                me.text(data.message);
            }
        });
    });
    $('.basket-delete').click(function (e) {
        let me = $(this);
        $.ajax({
            url: basketApiUrl,
            type: "DELETE",
            success: function (data) {
                window.location.reload();
            },
            error: function (xhr) {
                let data = jQuery.parseJSON(xhr.responseText);
                me.text(data.message);
            }
        });
    });
})
