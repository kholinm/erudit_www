var erudit = {}

erudit.common = (function() {

  const BOARD_SIZE=15;

  var dlg_prt = function dlg_prt(question) {
    return new Promise((resolve, reject) => {
      $("#id_prompt_label").html(question);
      $("#id_prompt_value").val("");
      $("#id_prompt_modal").show();
      document.getElementById("id_ok_button").addEventListener('click', function() {
        $('#id_prompt_modal').hide();
        resolve($("#id_prompt_value").val());
      });
      document.getElementById("id_close_button").addEventListener('click', function() {
        $('#id_prompt_modal').hide();
        resolve();
      });
    });
  }

  var dlg_notify = function dlg_notify(msg) {
    return new Promise((resolve, reject) => {
      $("#id_notify_text").html("<p>" + msg + "</p>");
      $("#id_notify_modal").show();
      document.getElementById("id_close_button_2").addEventListener('click', function() {
        $('#id_notify_modal').hide();
        resolve();
      });
    });
  }

  var dlg_confirm = function dlg_confirm(msg) {
    return new Promise((resolve, reject) => {
      $("#id_confirm_text").html("<p>" + msg + "</p>");
      $("#id_confirm_modal").show();
      document.getElementById("id_yes_button").addEventListener('click', function() {
        $('#id_confirm_modal').hide();
        resolve(true);
      });
      document.getElementById("id_no_button").addEventListener('click', function() {
        $('#id_confirm_modal').hide();
        resolve(false);
      });
    });
  }

  var complete = function complete(new_words_array) {
    $('#new_words').val(JSON.stringify(new_words_array));
    $('#main_form').append("<input type='hidden' name='send' value='complete_move'>");
    $('#main_form').submit();
  }

  var get_words = async function get_words() {
    var words = {};
    table = $("#board_table")[0];
    for (i = 0; i < BOARD_SIZE; i++) {
      for (j = 0; j < BOARD_SIZE; j++) {
        input = table.rows[i].cells[j].firstElementChild;
        letter = input.value;
        if (input.matches('.hand_letter')) {
          {
            for (k = i; k >= 0; k--) {
              if (table.rows[k].cells[j].firstElementChild.value == '') {
                break;
              }
              vert_word_start = k;
            }
            for (k = vert_word_start; k < BOARD_SIZE; k++) {
              if (table.rows[k].cells[j].firstElementChild.value == '') {
                break;
              }
              vert_word_end = k;
            }
            if (vert_word_end > vert_word_start) {
              new_vert_word = "";
              for (k = vert_word_start; k <= vert_word_end; k++) {
                input = table.rows[k].cells[j].firstElementChild;
                new_vert_word += input.value;
              }
              if (!check_attachment('start', j, vert_word_start)) {
                msg = "Слово " + new_vert_word + " не привязано";
                await erudit.common.dlg_notify(msg);
                return {};
              }
              words[new_vert_word] = "1";
            }
            for (l = j; l >= 0; l--) {
              if (table.rows[i].cells[l].firstElementChild.value == '') {
                break;
              }
              horiz_word_start = l;
            }
            for (l = horiz_word_start; l < BOARD_SIZE; l++) {
              if (table.rows[i].cells[l].firstElementChild.value == '') {
                break;
              }
              horiz_word_end = l;
            }
            if (horiz_word_end > horiz_word_start) {
              new_horiz_word = "";
              attached = false;
              for (l = horiz_word_start; l <= horiz_word_end; l++) {
                input = table.rows[i].cells[l].firstElementChild;
                new_horiz_word += input.value;
              }
              if (!check_attachment('start', horiz_word_start, i)) {
                msg = "Слово(а) " + new_horiz_word + " не привязано(ы)";
                await erudit.common.dlg_notify(msg);
                return {};
              }
              words[new_horiz_word] = "1";
            }
          }
        }
      }
    }
    return Object.keys(words);
  }

  var get_used_words = function get_used_words() {
    var u_words = new Array();
    $(".word").each(function() {
      var words = $(this).text().replace("*", "").split(", ");
      words.forEach(x => {
        if (x) {
          u_words.push(x.trim())
        }
      });
    });
    return u_words;
  }

  var check_attachment = function check_attachment(initial_dir, x, y) {
    input = input = table.rows[y].cells[x].firstElementChild;
    if (input.matches('.board_letter') || input.matches('.white')) {
      return true;
    }
    if (!input.matches('.hand_letter')) {
      return false;
    }
    if (initial_dir != 'down' && y > 0) {
      if (check_attachment('up', x, y - 1)) {
        return true;
      }
    }
    if (initial_dir != 'left' && x < BOARD_SIZE - 1) {
      if (check_attachment('right', x + 1, y)) {
        return true;
      }
    }
    if (initial_dir != 'up' && y < BOARD_SIZE - 1) {
      if (check_attachment('down', x, y + 1)) {
        return true;
      }
    }
    if (initial_dir != 'right' && x > 0) {
      if (check_attachment('left', x - 1, y)) {
        return true;
      }
    }
    return false;
  }

  var get_help = function get_help() {
    if (typeof help_msg !== 'undefined') {
      $("#id_help_modal").show();
      return;
    }
    $("#id_help_button").prop('disabled', true);
    var http = new XMLHttpRequest();
    var url = $('#main_form').attr('action');
    var params = 'send=help';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
      $("#id_help_button").prop('disabled', false);
      $(".loader").hide();
      if (http.readyState == 4 && http.status == 200) {
        help_msg = http.responseText;
        $("#id_modal_text").html(help_msg);
        $("#id_help_modal").show();
      }
    }
    http.send(params);
    $(".loader").show();

  }

  var close_modal = function close_modal(modal_id) {
    $("#" + modal_id).hide();
  }

  var get_star_val = async function get_star_val() {
    star_val = (await dlg_prt("Какую букву заменяет звезда?")).toUpperCase();
    if(! /^[А-Я]$/.test(star_val)) {
      msg = "* может быть заменена только на буквы А-Я";
      await dlg_notify(msg);
      return false;
    }
    return star_val;
  }

  var swap = async function swap (src, dst) {
    src.orig = src[0];
    src.obj = src[1];
    src.cls = src[2];
    dst.orig = dst[0];
    dst.obj = dst[1];
    dst.cls = dst[2];

    new_src_val = dst.obj.val();
    new_dst_val = src.obj.val();
    if (src.obj.attr('id') == dst.obj.attr('id')) {
      return;
    }
    if (src.obj.val().includes("*") && dst.obj.val().includes("*")) {
      return;
    }
    if (src.obj.val().includes("*")) {
      if (dst.orig == "board") {
        star_val = await get_star_val();
        if (!star_val) {
          return false;
        }
        new_dst_val = "*"+star_val;
      }
      if (dst.orig == "hand") {
        new_dst_val = "*";
        if (src.cls == "board_letter") {
          src.cls = "";
          dst.cls = "";
        }
      }
    } else if (dst.obj.val().includes("*")) {
      if (src.orig == "hand") {
        new_src_val = "*";
        if (dst.cls == "board_letter") {
          src.cls = "";
          dst.cls = "";
        }
      }
      if (src.orig == "board") {
        star_val = await get_star_val();
        if (!star_val) {
          return false;
        }
        new_src_val = "*"+star_val;
      }
    }
    src.obj.removeClass(src.cls);
    src.obj.addClass(dst.cls);
    dst.obj.removeClass(dst.cls);
    dst.obj.addClass(src.cls);
    src.obj.val(new_src_val);
    dst.obj.val(new_dst_val);
    
  }

  return {dlg_prt: dlg_prt,
          dlg_notify: dlg_notify,
          dlg_confirm: dlg_confirm,
          complete: complete,
          get_words: get_words,
          get_used_words: get_used_words,
          check_attachment: check_attachment,
          get_help: get_help,
          close_modal: close_modal,
          swap: swap};

})()

