import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

    // Tambah notifikasi sukses
    const notif = document.createElement("p");
    notif.textContent = "✅ Surat berhasil disimpan dan ditampilkan!";
    notif.style.color = "green";
    document.getElementById("previewSurat").appendChild(notif);
  } catch (error) {
    alert("❌ Gagal menyimpan ke Firebase. Periksa konfigurasi atau koneksi.");
    console.error("Firebase Error:", error);
  }
});

window.exportPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById("previewSurat").innerText, 10, 10);
  doc.save("surat-tugas.pdf");
};
