<?php 
	header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
	header("Pragma: no-cache"); // HTTP 1.0.
	header("Expires: 0"); // Proxies.
	include 'koneksi.php';
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata, true);

	if (isset($_GET['action']) && $_GET['action']=='get') {
		$query = mysql_query("SELECT * FROM transaksi ORDER BY idtransaksi DESC");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}

	elseif (isset($_GET['action']) && $_GET['action']=='getnew') {
		$query = mysql_query("SELECT * FROM transaksi WHERE view='0'");
		$row = mysql_num_rows($query);
		$arrayData = array();
		$arrayData[] = $row;
				
		echo json_encode($arrayData);			
	}

	elseif (isset($_GET['action']) && $_GET['action']=='getreport') {
		$query = mysql_query("SELECT DATE( DATE ) DateOnly, SUM( totalcost ) As total 
FROM transaksi
GROUP BY DateOnly
ORDER BY DateOnly DESC 
LIMIT 7");
		
		$arrayData = array();
		while ($data = mysql_fetch_array($query)) {
				$arrayData['tanggal'][] = $data['DateOnly'];
				$arrayData['jumlah'][] = $data['total'];
		}
				
		echo json_encode($arrayData);
		// print_r ($arrayData);			
	}

	elseif (isset($_GET['action']) && $_GET['action']=='getbestproduct') {
		$query = mysql_query("SELECT p.nama_produk,SUM(quantity) FROM detail_transaksi AS d INNER JOIN produk as p ON d.idproduk=p.idproduk  GROUP BY d.idproduk LIMIT 7");
		
		$arrayData = array();
		while ($data = mysql_fetch_array($query)) {
				$arrayData['produk'][] = $data['nama_produk'];
				$arrayData['jumlah'][] = $data['SUM(quantity)'];
		}
				
		echo json_encode($arrayData);
		// print_r ($arrayData);			
	}

	elseif (isset($_GET['action']) && $_GET['action']=='getdetail') {
			$idtrans = $_GET['id'];
			$query = mysql_query("	SELECT t.*, p.nama_produk, p.harga, td.idproduk, td.quantity FROM transaksi as t 
									INNER JOIN detail_transaksi as td ON t.idtransaksi=td.idtransaksi 
									INNER JOIN produk as p ON td.idproduk=p.idproduk
									WHERE t.idtransaksi='$idtrans'");
			if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}			
	}

	elseif (isset($request) && $request['action']=='update_product') {
			$idtrans = $request['id'];
			$nama_produk = $request['nama_produk'];
			$harga = $request['harga'];	
			$id_cat = $request['idkategori'];	
			$query = mysql_query("UPDATE produk set nama_produk = '$nama_produk',harga='$harga',idkategori='$id_cat' where idproduk = '$idtrans' ");
			if ($query) {
			  echo true;
			}else{
				echo false;
			}		
		}	
		elseif (isset($request) && $request['action']=='update_inventory') {
			$idtrans = $request['id'];
			$inventory_name = $request['inventory_name'];
			$stok = $request['stok'];	
			$available_stock=$request['available_stock'];	
			$query = mysql_query("UPDATE inventory set inventory_name = '$inventory_name',stok='$stok',available_stock='$available_stock' where id = '$idtrans' ");
			if ($query) {
			  echo true;
			}else{
				echo false;
			}		
		}			
	
	
 ?>
