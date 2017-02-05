<?php 
	header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
	header("Pragma: no-cache"); // HTTP 1.0.
	header("Expires: 0"); // Proxies.

	include 'koneksi.php';
	if (isset($_GET['action']) && $_GET['action']=='get') {
		$query = mysql_query("SELECT * FROM produk ORDER BY idproduk DESC");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}

	elseif (isset($_GET['action']) && $_GET['action']=='getdetail') {
		$idData = $_GET['id'];
		$query = mysql_query("SELECT * FROM produk where idproduk='$idData' ");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}

	elseif (isset($_GET['action']) && $_GET['action']=='delete') {
		$idData = $_GET['id'];
		$query = mysql_query("DELETE FROM produk where idproduk='$idData' ");
		if ($query) {
			echo "success delete";
		}
	}
	elseif (isset($_GET['action']) && $_GET['action']=='deleteInventory') {
		$idData = $_GET['id'];
		$query = mysql_query("DELETE FROM inventory where id='$idData' ");
		if ($query) {
			echo "success delete";
		}
	}
	
	elseif (isset($_GET['action']) && $_GET['action']=='add') {
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata, true);

		$productname = $request['name'];
		$productprice = $request['price'];
		$productstock = 0;
		$productbase = $request['base_selected'];

		$query = mysql_query("INSERT INTO produk VALUES ('','$productname','$productprice','$productstock','$productbase')");
		if ($query) {
			echo "success";
		}
		
	}elseif (isset($_GET['action']) && $_GET['action']=='add_inv') {
		
		$postdata = file_get_contents("php://input");
		$request = json_decode($postdata, true);

		$productname = $request['name'];
		$productprice = 0;
		$productstock = $request['stok'];
		$availablestock = $request['stok'];
		$date = date("Y-m-d h:i:s");
		$query = mysql_query("INSERT INTO inventory VALUES ('','$productname','$productprice','$productstock','$availablestock','$date')");
		if ($query) {
			echo "success";
		}
	}else if (isset($_GET['action']) && $_GET['action']=='get_inv') {
		$query = mysql_query("SELECT * FROM inventory ORDER BY id DESC");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}	elseif (isset($_GET['action']) && $_GET['action']=='getdetail_inv') {
		$idData = $_GET['id'];
		$query = mysql_query("SELECT * FROM inventory where id='$idData' ");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}elseif (isset($_GET['action']) && $_GET['action']=='get_base') {
		$query = mysql_query("SELECT * FROM inventory;");
		if ($query) {
			$arrayData = array();
			while ($data = mysql_fetch_array($query)) {
				$arrayData[] = $data;
			}
			echo json_encode($arrayData);
		}
	}

	
	

 ?>
