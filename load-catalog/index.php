<?php

error_reporting(-1);
ini_set('display_errors', 'Off');

$error_recipients = 'kevin.boydstun@nasa.gov, jason.duley@nasa.gov';
$error_from = 'code.nasa.gov@no-reply.nasa.gov';
$catalog_git_url = 'https://raw.githubusercontent.com/nasa/Open-Source-Catalog/master/catalog.json';

$catalog_filename = 'catalog.json';
$code_folder = dirname(dirname(__FILE__));
$write_to = $code_folder . '/data/' . $catalog_filename;

$json = file_get_contents($catalog_git_url);
$data = code_valid_json($json);

if ($data) {
  $current_json = file_exists($write_to) ? file_get_contents($write_to) : '';
  $old_md5 = md5($current_json);
  $new_md5 = md5($json);

  //print "OLD MD5: " . $old_md5 . '<br />';
  //print "NEW MD5: " . $new_md5 . '<br />';

  if ($old_md5 != $new_md5) {

    $saved = file_put_contents($write_to, $json);
    if($saved){
    	chmod($write_to, 0777);
    	print 'NEW catalog.json file writtent to /data folder.';
    }else{
    	print 'check permissions of output file';
    }
  } else {
    die('SAME FILE CONTENTS');
  }

} else {
  code_send_error();
}

function code_valid_json($json) {
  $data = FALSE;
  if (!empty($json)) {
    $json_decoded = json_decode($json, TRUE);
    if (count($json_decoded) > 50) {
      if ('NASA Center' == current(array_keys(current($json_decoded)))) {
        $data = $json_decoded;
      }
    }
  }
  return $data;
}

function code_send_error() {
  global $catalog_git_url, $error_recipients, $error_from;
  $subject = 'CODE.NASA.GOV - Invalid catalog.json file detected';
  print $subject;
  $message_parts = array(
      'Please check the file on github for errors:',
      $catalog_git_url,
      'Date: ' . date('c', time()),
  );
  $message = implode(PHP_EOL . PHP_EOL, $message_parts);
  mail($error_recipients, $subject, $message, 'FROM: ' . $error_from . "\r\n");
}
