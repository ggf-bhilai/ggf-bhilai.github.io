<?php
$lat = $_GET['lat'];
$lon = $_GET['lon'];

$file = fopen("location.txt","a");
fwrite($file,"Latitude: ".$lat." Longitude: ".$lon."\n");
fclose($file);
?>