import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Tambah data
document.getElementById("suratForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const nip = document.getElementById("nip").value.trim();
  const jabatan = document.getElementById("jabatan").value.trim();
  const tujuan = document.getElementById("tujuan").value.trim();
  const keperluan = document.getElementById("keperluan").value.trim();
  const tanggal = document.getElementById("tanggal").value;

  if (!nama || !nip || !jabatan || !tujuan || !keperluan || !tanggal) {
    alert("❌ Semua kolom wajib diisi!");
    return;
  }

  const isiSurat = `
Surat Tugas
==========================
Yang bertanda tangan di bawah ini, menugaskan kepada:
Nama       : ${nama}
NIP        : ${nip}
Jabatan    : ${jabatan}

Untuk melaksanakan tugas ke ${tujuan} pada tanggal ${tanggal}
Dalam rangka: ${keperluan}

Demikian surat ini dibuat untuk digunakan sebagaimana mestinya.
`;

  document.getElementById("previewSurat").innerText = isiSurat;

  try {
    await addDoc(collection(db, "surat_tugas"), {
      nama, nip, jabatan, tujuan, keperluan, tanggal, isiSurat, waktu: new Date()
    });

    showNotif("✅ Surat berhasil disimpan dan ditampilkan!");
    loadRiwayat();
  } catch (error) {
    alert("❌ Gagal menyimpan ke Firebase.");
    console.error("Firebase Error:", error);
  }
});

function showNotif(msg) {
  const notif = document.createElement("p");
  notif.textContent = msg;
  notif.style.color = "green";
  document.getElementById("previewSurat").appendChild(notif);
}

// Export ke PDF
window.exportPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById("previewSurat").innerText, 10, 10);
  doc.save("surat-tugas.pdf");
};

// Export ke Word
window.exportWord = function () {
  const header = "<html><head><meta charset='utf-8'><title>Surat Tugas</title></head><body>";
  const content = document.getElementById("previewSurat").innerText.replace(/\n/g, "<br>");
  const footer = "</body></html>";
  const sourceHTML = header + content + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = 'surat-tugas.doc';
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

// Tampilkan Riwayat Surat
async function loadRiwayat() {
  const q = query(collection(db, "surat_tugas"), orderBy("waktu", "desc"));
  const querySnapshot = await getDocs(q);
  const riwayatDiv = document.getElementById("riwayatSurat");
  riwayatDiv.innerHTML = "<h3>Riwayat Surat Tugas</h3>";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("div");
    item.style.margin = "10px 0";
    item.style.padding = "10px";
    item.style.border = "1px solid #ccc";
    item.innerHTML = `<strong>${data.nama}</strong> - ${data.tanggal}<br>${data.tujuan} (${data.keperluan})`;
    riwayatDiv.appendChild(item);
  });
}

loadRiwayat();
