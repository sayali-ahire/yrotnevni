<?php
	
	include 'koneksi.php';
	$postdata = file_get_contents("php://input");
	// print_r($_POST);
	// print_r($postdata);die;
	$request = json_decode($postdata, true);

	// print_r($request);die;
	$totalitem = count($request['items']);
	$totalcost = $request['totalCost'];
	$bayar = $request['bayar'];
	$kembali = $request['kembali'];
	$date = $request['date'];

	$first_name =  $request['first_name'];
	$last_name =  $request['last_name'];
	$mobile_no =  $request['mobile_no'];
	$payment_type = $request['payment_type'];
	

	$query = mysql_query("INSERT INTO transaksi VALUES('','$totalitem','$totalcost','$bayar','$kembali','$first_name','$last_name','$mobile_no','$payment_type', '$date')");

	$last_id = mysql_insert_id();
	foreach ($request['items'] as $key => $value) {
		$id = $value['id'];
		$quantity = $value['quantity'];	
		$base = $value['base'];
		$product_name_qty = $value['product_name_qty'];	
		$total_qty = $value['product_name_qty'] * $quantity;
		mysql_query("INSERT INTO detail_transaksi VALUES('$last_id','$id','$quantity','$base','$product_name_qty','$total_qty')");
	 	// Kurangin Stok
		$viewProduk = mysql_query("SELECT * FROM inventory WHERE id='$base'");
		$resultView = mysql_fetch_array($viewProduk);
		$available_stock = $resultView['available_stock'];
		$totalstok = $available_stock - $total_qty;
		$minStok = mysql_query("UPDATE inventory SET available_stock='$totalstok' WHERE id='$base'");
	}
	echo $last_id;



 ?>