var click_board="";
var click_hand="";
var state=0;
const BOARD_SIZE=15;

function dlg_prt(question) {
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

function dlg_notify(msg) {
    return new Promise((resolve, reject) => {
      $("#id_notify_text").html("<p>"+msg+"</p>");
      $("#id_notify_modal").show();
      document.getElementById("id_close_button_2").addEventListener('click', function() {
        $('#id_notify_modal').hide();
        resolve();
      });
    });
}

function dlg_confirm(msg) {
    return new Promise((resolve, reject) => {
      $("#id_confirm_text").html("<p>"+msg+"</p>");
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


$(".board_cell").on("click", async function() {
  switch(state) {
    case 0:
      if ($(this).hasClass("hand_letter")) {
        $(this).removeClass("cyan");
        $(this).addClass("highlight");
        click_board=$(this);
        state=1;
        break;
      }
      if ($(this).hasClass("board_letter") && $(this).val().includes("*")) {
        $(this).removeClass("white");
        $(this).addClass("highlight");
        click_board=$(this);
        state=1;
        break;
      }
      break;
    case 1:
      if (click_board) {
        if ($(this).hasClass("hand_letter") && !click_board.hasClass("board_letter")) {
          if (this != click_board[0]) {
            sel_val=$(this).val();
            if (sel_val.includes("*")) {
              star_val = (await dlg_prt("Какую букву заменяет звезда?")).toUpperCase();
              if(! /^[А-Я]$/.test(star_val)) {
                msg = "* может быть заменена только на буквы А-Я";
                await dlg_notify(msg);
                return false;
              }
              sel_val = "*"+star_val;
            }
            board_val = click_board.val();
            if (board_val.includes("*")) {
              star_val = (await dlg_prt("Какую букву заменяет звезда?")).toUpperCase();
              if(! /^[А-Я]$/.test(star_val)) {
                msg = "* может быть заменена только на буквы А-Я";
                await dlg_notify(msg);
                return false;
              }
              board_val = "*"+star_val;
            }
            $(this).val(board_val);
            click_board.val(sel_val);
          }
          click_board.addClass("cyan");
        }
        if($(this).hasClass("empty") && !click_board.hasClass("board_letter")) {
          $(this).val(click_board.val());
          $(this).removeClass("empty");
          $(this).addClass("hand_letter");
          $(this).removeClass("black");
          $(this).addClass("cyan");
          click_board.val("");
          click_board.removeClass("hand_letter");
          click_board.removeClass("board_letter");
          click_board.addClass("empty");
          click_board.addClass("black");
          click_board.removeClass("highlight");
        }
        if($(this).hasClass("board_letter") && click_board.hasClass("hand_letter")) {
          click_board.addClass("cyan");
        }
        click_board.removeClass("highlight");
        click_board="";
        state=0;
        break;
      }
      if (click_hand) {
        if($(this).hasClass("empty")) {
          $(this).val(click_hand.val());
          if(click_hand.val()=="*") {
            star_val= (await dlg_prt("Какую букву заменяет звезда?")).toUpperCase();
            if(! /^[А-Я]$/.test(star_val)) {
              msg = "* может быть заменена только на буквы А-Я";
              await dlg_notify(msg);
              return false;
            }
            $(this).val("*"+star_val);
          }
          $(this).removeClass("empty");
          $(this).addClass("hand_letter");
          $(this).removeClass("black");
          $(this).addClass("cyan");
          click_hand.removeClass("hand_letter");
          click_hand.addClass("empty");
          click_hand.removeClass("cyan");
          click_hand.addClass("white");
          click_hand.val("");
        } else if ($(this).hasClass("board_letter") && 
                   $(this).val().includes("*") && 
                   $(this).val().includes(click_hand.val()) &&
                   !click_hand.val().includes("*"))  {
          $(this).val(click_hand.val());
          click_hand.val("*");
          click_hand.addClass("cyan");
        } else if ($(this).hasClass("hand_letter") && click_hand.val() != "*") {
          tmp_val = $(this).val();
          $(this).val(click_hand.val());
          $(click_hand.val(tmp_val));
          click_hand.addClass("cyan");
        } else {
          click_hand.addClass("cyan");
        }
        click_hand.removeClass("highlight");
        click_hand="";
        state=0;
      }
      break;
  }
})

$(".hand_cell").on("click", function() {
  switch(state) {
    case 0:
      if($(this).hasClass("hand_letter")) {
        click_hand=$(this);
        $(this).removeClass("cyan");
        $(this).addClass("highlight");
        state=1;
      }
      break;
    case 1:
      if(click_board) {
        if($(this).hasClass("empty") && !click_board.hasClass("board_letter")) {
          if(click_board.val().includes("*")) {
            click_board.val("*");
          }
          $(this).val(click_board.val());
          click_board.val("");
          $(this).removeClass("empty");
          $(this).removeClass("white");
          $(this).addClass("hand_letter");
          $(this).addClass("cyan");
          click_board.removeClass("hand_letter");
          click_board.addClass("empty");
          click_board.removeClass("highlight");
          click_board.addClass("black");
          click_board="";
          state=0;
          break;
        }
        if($(this).hasClass("hand_letter") && 
            click_board.hasClass("board_letter") && 
            click_board.val().includes("*") && 
            $(this).val() == click_board.val().replace("*","")) {
          click_board.val($(this).val());
          $(this).val("*");
          click_board.removeClass("highlight");
          click_board.addClass("white");
          click_board="";
          state=0;
          break;
        }
        click_board.removeClass("highlight");
        if(click_board.hasClass("board_letter") && $(this).val()=="*") {
          click_board.addClass("white");
        }
        if(click_board.hasClass("hand_letter")) { 
          if ($(this).val()=="*") {
            click_board.addClass("cyan");
          } else {
            tmp_val = click_board.val();
            if (tmp_val.includes("*")) {
              tmp_val = "*";
            }
            click_board.val($(this).val());
            $(this).val(tmp_val);
            click_board.addClass("cyan");
          }
        }
        click_board="";
        state=0;
        break;
      }
      if(click_hand) {
        if($(this).hasClass("empty")) {
          $(this).val(click_hand.val());
          click_hand.val("");
          $(this).removeClass("empty");
          $(this).addClass("hand_letter");
          $(this).removeClass("white");
          $(this).addClass("cyan");
          click_hand.removeClass("hand_letter");
          click_hand.removeClass("cyan");
          click_hand.addClass("empty");
          click_hand.addClass("white");
          click_hand.removeClass("highlight");
          click_hand="";
          state=0;
          break;
        }
        if($(this).hasClass("hand_letter")) {
          sel_val=$(this).val();
          $(this).val(click_hand.val());
          click_hand.val(sel_val);
          click_hand.addClass("cyan");
        }
        click_hand.removeClass("highlight");
        click_hand="";
        state=0;
      }
      break;
  }
})

$("#id_complete_move").click(async function(e) {
  move_made=false;
  $('.hand_cell').each(function(){
    if(!$(this).val()){
      move_made=true;
      return; 
    }});
  if(move_made) {
    //$('#main_form').submit();
    new_words = await get_words();
    used_words = get_used_words();
    if(used_words && new_words.constructor.toString().indexOf("Array") > -1) {
      var violating_words = "";
      new_words.forEach((word) => {
         if(used_words.includes(word.replace("*", ""))) {
         violating_words += " "+word.replace("*", "");
        }
      });
      if(violating_words) {
        msg = violating_words + " уже использовалoсь";
        await dlg_notify(msg);
        return false;
      }
    }
    if(jQuery.isEmptyObject(new_words)) {
      return false;
    }
    var http = new XMLHttpRequest();
    var url = $('#main_form').attr('action');
    var params = 'send=check_words&new_words='+JSON.stringify(new_words);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = async function() {
      if(http.readyState == 4 && http.status == 200) {
        new_words_array=JSON.parse(http.responseText);
        var bad_words=new_words_array.filter(function (word) {
          return word.valid==0;
        });
        if (bad_words.length>0) {
          //console.log(bad_words);
          msg = "Эрудиту неизвестно значение слов(а) "+bad_words.map(word_rec => {return word_rec['word']}).join(", ")+"\nУверены?";
          res = await dlg_confirm(msg);
          if (!res) {
            return false;
          }
        }
        complete(new_words_array);
        return true;
      }
    }
    http.send(params);
    return false;
    //$('#new_words').val(JSON.stringify(new_words));
    //console.log($('#new_words').val())i;
  }
  msg = "Буквы не использованы. Точно следующий ход?";
  if (await dlg_confirm(msg)) {
    complete();
    return true;
  }
  return false;
})

function complete(new_words_array) {
  $('#new_words').val(JSON.stringify(new_words_array));
  $('#main_form').append("<input type='hidden' name='send' value='complete_move'>");
  $('#main_form').submit();
}

function start_game() {
  $('#main_form').append("<input type='hidden' name='send' value='new_game'>");
  $('#main_form').submit();
}

$("#id_new_game").click(async function(e) {
  msg = "Уверены, что хотите начать новую игру?";
  res = await dlg_confirm(msg);
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
  msg = "К началу какого номера хода вернуть?";
  move_no = await dlg_prt(msg);
  if(isNaN(move_no) || move_no < 1) {
    return false;
  }
  $can_submit=false;
  $(".moves").each(function() {
    if(parseInt($(this).text())==move_no) {
      $("#revert_move_no").val(move_no);
      $can_submit=true;
    }
  });
  if(!$can_submit) {
    return false;
  }
  $('#main_form').append("<input type='hidden' name='send' value='revert'>");
  $('#main_form').submit();
});


async function get_words() {
    var words={};
    table=$("#board_table")[0];
    for(i=0; i<BOARD_SIZE; i++) {
      for(j=0; j<BOARD_SIZE; j++) {
        input=table.rows[i].cells[j].firstElementChild;
        letter=input.value;
        if(input.matches('.hand_letter')) {
        {
          for(k=i; k>=0; k--) {
            if(table.rows[k].cells[j].firstElementChild.value=='') {
              break;
            }
            vert_word_start=k;
          }
          for(k=vert_word_start; k<BOARD_SIZE; k++) {
            if(table.rows[k].cells[j].firstElementChild.value=='') {
              break;
            }
            vert_word_end=k;
          }
          if(vert_word_end>vert_word_start) {
            new_vert_word="";
            for(k=vert_word_start; k<=vert_word_end; k++) {
              input=table.rows[k].cells[j].firstElementChild;
              new_vert_word+=input.value;
            }
            if(!check_attachment('start', j, vert_word_start)) {
              msg = "Слово "+new_vert_word+" не привязано";
              await dlg_notify(msg);
              return {};
            }
            words[new_vert_word]="1";
          }
          for(l=j; l>=0; l--) {
            if(table.rows[i].cells[l].firstElementChild.value=='') {
              break;
            }
            horiz_word_start=l;
          }
          for(l=horiz_word_start; l<BOARD_SIZE; l++) {
            if(table.rows[i].cells[l].firstElementChild.value=='') {
              break;
            }
            horiz_word_end=l;
          }
          if(horiz_word_end>horiz_word_start) {
            new_horiz_word="";
            attached=false;
            for(l=horiz_word_start; l<=horiz_word_end; l++) {
              input=table.rows[i].cells[l].firstElementChild;
              new_horiz_word+=input.value;
            }
            if(!check_attachment('start', horiz_word_start, i)) {
              msg = "Слово(а) "+new_horiz_word+" не привязано(ы)";
              await dlg_notify(msg);
              return {};
            }
            words[new_horiz_word]="1";
          }
        }
      }
    }
  }
  return Object.keys(words);
}

function get_used_words(){
  var u_words = new Array();
  $(".word").each(function() {
    var words = $(this).text().replace("*", "").split(", ");
    words.forEach(x => {if (x) { u_words.push(x.trim()) }});
  });
  return u_words;
}

function check_attachment(initial_dir, x, y) {
  input=input=table.rows[y].cells[x].firstElementChild;
  if(input.matches('.board_letter') || input.matches('.white')) {
    return true;
  }
  if(!input.matches('.hand_letter')) {
    return false;
  }
  if(initial_dir!='down' && y>0) {
    if(check_attachment('up', x, y-1)) {
      return true;
    }
  }
  if(initial_dir!='left' && x<BOARD_SIZE-1) {
    if(check_attachment('right', x+1, y)) {
      return true;
    }
  }
  if(initial_dir!='up' && y<BOARD_SIZE-1) {
    if(check_attachment('down', x, y+1)) {
      return true;
    }
  }
  if(initial_dir!='right' && x>0) {
    if(check_attachment('left', x-1, y)) {
      return true;
    }
  }
  return false;
}

function get_help() {
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
    if(http.readyState == 4 && http.status == 200) {
      help_msg = http.responseText;
      $("#id_modal_text").html(help_msg);
      $("#id_help_modal").show();
    }
  }
  http.send(params);
  $(".loader").show();

}

function close_modal(modal_id) {
  $("#"+modal_id).hide();
}
