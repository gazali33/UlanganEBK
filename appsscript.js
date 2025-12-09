// Fungsi untuk menyimpan data hasil tes ke Google Sheets
function saveQuizResult(data) {
  try {
    // Dapatkan spreadsheet aktif
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Cek apakah sheet "Data" ada, jika tidak buat baru
    var dataSheet = sheet.getSheetByName("Data");
    if (!dataSheet) {
      dataSheet = sheet.insertSheet("Data");
      
      // Buat header jika sheet baru
      var headers = ["Timestamp", "Nama", "Kelas", "Nilai"];
      dataSheet.appendRow(headers);
      
      // Format header
      var headerRange = dataSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#4285F4");
      headerRange.setFontColor("white");
      headerRange.setFontWeight("bold");
    }
    
    // Ambil data dari request
    var nama = data.nama;
    var kelas = data.kelas || "XI DPIB";
    var nilai = data.nilai;
    var timestamp = new Date();
    
    // Validasi data
    if (!nama || nilai === undefined) {
      return { status: "error", message: "Data tidak lengkap" };
    }
    
    // Tambahkan baris baru ke sheet
    dataSheet.appendRow([
      timestamp,
      nama,
      kelas,
      nilai
    ]);
    
    // Format timestamp
    var lastRow = dataSheet.getLastRow();
    var timestampCell = dataSheet.getRange(lastRow, 1);
    timestampCell.setNumberFormat("dd/mm/yyyy hh:mm:ss");
    
    // Format nilai
    var nilaiCell = dataSheet.getRange(lastRow, 4);
    nilaiCell.setNumberFormat("0");
    
    // Kembalikan response sukses
    return { 
      status: "success", 
      message: "Data berhasil disimpan",
      data: {
        nama: nama,
        kelas: kelas,
        nilai: nilai,
        timestamp: timestamp
      }
    };
    
  } catch (error) {
    // Kembalikan response error
    return { 
      status: "error", 
      message: "Terjadi kesalahan: " + error.message 
    };
  }
}

// Fungsi untuk menangani HTTP POST request
function doPost(e) {
  try {
    // Set header CORS
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Parse request body
    var requestData = JSON.parse(e.postData.contents);
    
    // Simpan data dan dapatkan response
    var result = saveQuizResult(requestData);
    
    // Kembalikan response JSON
    output.setContent(JSON.stringify(result));
    return output;
    
  } catch (error) {
    // Handle error
    var errorResponse = {
      status: "error",
      message: "Terjadi kesalahan dalam memproses request: " + error.message
    };
    
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(errorResponse));
    return output;
  }
}

// Fungsi untuk menangani HTTP GET request (untuk testing)
function doGet(e) {
  try {
    // Set header CORS
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Kembalikan response JSON
    output.setContent(JSON.stringify({
      status: "success",
      message: "API untuk menyimpan hasil tes Estimasi Biaya Konstruksi",
      version: "1.0"
    }));
    return output;
    
  } catch (error) {
    // Handle error
    var errorResponse = {
      status: "error",
      message: "Terjadi kesalahan: " + error.message
    };
    
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(errorResponse));
    return output;
  }
}
