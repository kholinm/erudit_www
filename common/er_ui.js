erudit.ui = (function() {

  var click_board="";
  var click_hand="";
  var state = 0;
  var b_move_made = false;

  $(".board_cell").on("click", async function() {
    switch (state) {
      case 0:
        if ($(this).hasClass("hand_letter")) {
          $(this).addClass("highlight");
          click_board = $(this);
          state = 1;
          break;
        }
        if ($(this).hasClass("board_letter") && $(this).val().includes("*")) {
          $(this).addClass("highlight");
          click_board = $(this);
          state = 1;
          break;
        }
        break;
      case 1:
        if (click_board) {
          if ($(this).hasClass("empty")) {
            if (click_board.hasClass("hand_letter")) {
              erudit.common.swap(["board", click_board, "hand_letter"], ["board", $(this), "empty"]);
            } else if (click_board.hasClass("empty")) {
              ;
            } else if (click_board.hasClass("board_letter")) {
              ;
            }
            click_board.removeClass("highlight");
            click_board = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("board_letter")) {
            if (click_board.hasClass("hand_letter")) {
              if ($(this).val().includes("*") && !click_board.val().includes("*") && $(this).val().includes(click_board.val())) {
                erudit.common.swap(["board", click_board, "hand_letter"], ["board", $(this), "board_letter"]);
              }
            } else if (click_board.hasClass("empty")){
              ;
            } else if (click_board.hasClass("board_letter")) {
              ;
            }
            click_board.removeClass("highlight");
            click_board = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("hand_letter")) {
            if (click_board.hasClass("hand_letter")) {
              erudit.common.swap(["board", click_board, "hand_letter"], ["board", $(this), "hand_letter"]);
            } else if (click_board.hasClass("empty")){
              erudit.common.swap(["board", click_board], ["board", $(this)]);
            } else if (click_board.hasClass("board_letter")) {
              ;
            }
            click_board.removeClass("highlight");
            click_board = "";
            state = 0;
            break;
          }
        }
        if (click_hand) {
          if ($(this).hasClass("empty")) {
            if (click_hand.hasClass("hand_letter")) {
              erudit.common.swap(["hand", click_hand, "hand_letter"], ["board", $(this), "empty"]);
            }
            click_hand.removeClass("highlight");
            click_hand = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("hand_letter")) {
            if (click_hand.hasClass("hand_letter")) {
              erudit.common.swap(["hand", click_hand, "hand_letter"], ["board", $(this), "hand_letter"]);
            } else if (click_hand.hasClass("empty")){
              ;
            } else if (click_hand.hasClass("board_letter")) {
              ;
            }
            click_hand.removeClass("highlight");
            click_hand = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("board_letter")) {
            if (click_hand.hasClass("hand_letter")) {
              if ($(this).val().includes("*") && !click_hand.val().includes("*") && $(this).val().includes(click_hand.val())) {
                erudit.common.swap(["hand", click_hand, "board_letter"], ["board", $(this), "hand_letter"]);
              }

            } else if (click_hand.hasClass("empty")){
              ;
            } else if (click_hand.hasClass("board_letter")) {
              ;
            }
            click_hand.removeClass("highlight");
            click_hand = "";
            state = 0;
            break;
          }
        }
      }
  })

  $(".hand_cell").on("click", function() {
    switch (state) {
      case 0:
        if ($(this).hasClass("hand_letter")) {
          click_hand = $(this);
          $(this).addClass("highlight");
          state = 1;
        }
        break;
      case 1:
        if (click_board) {
          if ($(this).hasClass("empty")) {
            if (click_board.hasClass("hand_letter")) {
              erudit.common.swap(["board", click_board, "hand_letter"], ["hand", $(this), "empty"]);
            } else if (click_board.hasClass("empty")) {
              ;
            } else if (click_board.hasClass("board_letter")) {
              ;
            }
            click_board.removeClass("highlight");
            click_board = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("hand_letter")) {
            if (click_board.hasClass("hand_letter")) {
              erudit.common.swap(["board", click_board, "hand_letter"], ["hand", $(this), "hand_letter"]);
            } else if (click_board.hasClass("empty")){
              ;
            } else if (click_board.hasClass("board_letter")) {
                if (click_board.val().includes("*") && !$(this).val().includes("*") && click_board.val().includes($(this).val())) {
                  erudit.common.swap(["board", click_board, "board_letter"], ["hand", $(this), "hand_letter"]);
                }
            }
            click_board.removeClass("highlight");
            click_board = "";
            state = 0;
            break;
          }
        }
        if (click_hand) {
          if ($(this).hasClass("empty")) {
            if (click_hand.hasClass("hand_letter")) {
              erudit.common.swap(["hand", click_hand, "hand_letter"], ["hand", $(this), "empty"]);
            } 
            click_hand.removeClass("highlight");
            click_hand = "";
            state = 0;
            break;
          }
          if ($(this).hasClass("hand_letter")) {
            if (click_hand.hasClass("hand_letter")) {
              erudit.common.swap(["hand", click_hand, "hand_letter"], ["hand", $(this), "hand_letter"]);
            } else if (click_hand.hasClass("empty")){
              erudit.common.swap(["hand", click_hand, "empty"], ["hand", $(this), "hand_letter"]);
            }
            click_hand.removeClass("highlight");
            click_hand = "";
            state = 0;
            break;
          }
        }
        break;
    }
  })

  $("#id_complete_move").click(async function(e) {
    p_id = $('#id_p_id').val();
    exp_p_id = $('#id_exp_p_id').val();
    if (p_id != exp_p_id) {
      msg = "Уверены, что будете ходить вне очереди?";
      res = await erudit.common.dlg_confirm(msg);
      if (!res) {
        return false;
      }
    }
    move_made = false;
    $('.hand_cell').each(function() {
      if (!$(this).val()) {
        move_made = true;
        return;
      }
    });
    if (move_made) {
      //$('#main_form').submit();
      new_words = await erudit.common.get_words();
      used_words = erudit.common.get_used_words();
      if (used_words && new_words.constructor.toString().indexOf("Array") > -1) {
        var violating_words = "";
        new_words.forEach((word) => {
          if (used_words.includes(word.replace("*", ""))) {
            violating_words += " " + word.replace("*", "");
          }
        });
        if (violating_words) {
          msg = violating_words + " уже использовалoсь";
          await erudit.common.dlg_notify(msg);
          return false;
        }
      }
      if (jQuery.isEmptyObject(new_words)) {
        return false;
      }
      var http = new XMLHttpRequest();
      var url = $('#main_form').attr('action');
      var params = 'send=check_words&new_words=' + JSON.stringify(new_words);
      http.open('POST', url, true);
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      http.onreadystatechange = async function() {
        if (http.readyState == 4 && http.status == 200) {
          new_words_array = JSON.parse(http.responseText);
          var bad_words = new_words_array.filter(function(word) {
            return word.valid == 0;
          });
          if (bad_words.length > 0) {
            //console.log(bad_words);
            msg = "Эрудиту неизвестно значение слов(а) " + bad_words.map(word_rec => {
              return word_rec['word']
            }).join(", ") + "\nУверены?";
            res = await erudit.common.dlg_confirm(msg);
            if (!res) {
              return false;
            }
          }
          erudit.common.complete(new_words_array);
          return true;
        }
      }
      http.send(params);
      return false;
      //$('#new_words').val(JSON.stringify(new_words));
      //console.log($('#new_words').val())i;
    }
    msg = "Буквы не использованы. Точно следующий ход?";
    if (await erudit.common.dlg_confirm(msg)) {
      erudit.common.complete();
      return true;
    }
    return false;
  })

  $("#id_new_game").click(async function(e) {
    msg = "Уверены, что хотите начать новую игру?";
    res = await erudit.common.dlg_confirm(msg);
    if (res) {
      $('#main_form').append("<input type='hidden' name='send' value='new_game'>");
      $('#main_form').submit();
    }
    /*html2canvas(document.querySelector(".box")).then( canvas => {
      //document.body.appendChild(canvas);
      $('#main_form').append("<input type='hidden' name='game_shot' value='"+canvas.toDataURL('image/png')+"'>");
      $('#main_form').append("<input type='hidden' name='send' value='new_game'>");
      $('#main_form').submit();
    });
    return false;*/
  });


  $("#id_revert").click(async function(e) {
    hist_p_id = $("#id_hist_p_id").val();
    curr_p_id = $("#id_p_id").val();
    if (hist_p_id != curr_p_id) {
      msg = "Отменить последний ход может только сделавший его игрок";
      await erudit.common.dlg_notify(msg);
      return false;

    }
    msg = "Уверены, что хотите отменить свой последний код?";
    res = await erudit.common.dlg_confirm(msg);
    if (!res) {
      return false;
    }
    /*
    $can_submit = false;
    $(".moves").each(function() {
      if (parseInt($(this).text()) == return_move_no) {
        $("#revert_move_no").val(return_move_no);
        $can_submit = true;
      }
    });
    if (!$can_submit) {
      return false;
    }*/
    $('#main_form').append("<input type='hidden' name='send' value='revert'>");
    $('#main_form').submit();
  });
  
  return {b_move_made: b_move_made}

})()



