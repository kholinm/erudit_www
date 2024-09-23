<?php
//phpinfo();
#require_once("auth.php");
//phpinfo(); die;
$action = "display";
$subaction = "";
$output = "";
$game_id = 0;
$archive_id = 0;
$is_uat = true;
$SCRIPT_DIR = "/var/www/scripts/er_uat/";
if (!(strpos($_SERVER['PHP_SELF'], "_uat") !== false)) {
  $is_uat = false;
  $SCRIPT_DIR = "/var/www/scripts/er/";
}; 

require_once($SCRIPT_DIR."model.php");
require_once($SCRIPT_DIR."auth.php");

if(isset($_GET['qry'])) {
  $args = explode("/", $_GET['qry']);
  $game_id = htmlspecialchars($args[0]);
  if(count($args) == 2) {
    $archive_id = $args[1];
    $subaction = "show_archive";
  } else if (count($args) == 3) {
    $subaction = $args[1];
    $param = $args[2];
  }
}
if(isset($_POST['send'])) {
  $action=htmlspecialchars($_POST['send']);
}

$next_location = $_SERVER['PHP_SELF']."?qry=$game_id";
$er = new ERUDIT($game_id, $is_uat);
if ($subaction == "logout") {
  $er->auth->logout();
  header("Location: $next_location/auth/");
}
$er->auth->check_auth();
if (!$er->auth->is_auth && 
     !($action == "display" && 
       ($subaction == "auth" || $action == "auth" ))) {
  header("Location: $next_location/auth/");
}
if ($er->auth->is_auth && ($er->auth->get_expiry() - time()) < 3600*24*7) {
  $er->auth->refresh();
}
//echo "<br>Act: $action<br>Subact: $subaction";
//print_r($_POST); print_r($action); die;
switch ($action) {
  case "auth":
    $player_id = $_POST['p_id'];
    $er->auth->authenticate($player_id);
    header("Location: $next_location");
    break;
  case "display":
    switch ($subaction) {
      case "":
        $output=$er->display();
        break;
      case "show_archive":
        $output = $er->display_archive($archive_id);
        break;
      case "archive":
        $archive_id = $param;
        $output = $er->display_archive($archive_id);
        break;
      case "auth": 
        $output = $er->auth->gen_auth_page();
        require_once($SCRIPT_DIR."view_auth.php");
        die;
    }
    break;
  case "revert":
    $revert_move_no=($_POST['revert_move_no']);
    $er->revert($revert_move_no);
    header("Location: $next_location");
    break;
  case "check_words":
    $er->check_words(json_decode($_POST['new_words'], true));
    die;
  case "help":
    $er->suggest_words();
    die;
  case "complete_move":
    $er->new_move_no=($_POST['new_move_no']);
    $er->new_board=($_POST['arr_board']);
    $er->new_words=(json_decode($_POST['new_words'], true));
    //$er->hand=($_POST['arr_hand']);
    //$er->bank=($_POST['arr_bank']);
    $er->complete();
    header("Location: $next_location");
    //$output=$er->display();
    break;
  case "new_game":
    $er->start();
    header("Location: $next_location");
    //$output=$er->display();
    break;
  default:
    $output="Unknown action";
    break;
}
require_once($SCRIPT_DIR."view.php");

?>
