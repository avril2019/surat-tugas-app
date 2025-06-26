import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("suratForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const nip = document.getElementById("nip").value;
  const jabatan = document.getElementById("jabatan").value;
  const tujuan = document.getElementById("tujuan").value;
  const keperluan = document.getElementById("keperluan").value;
  const tanggal = document.getElementById("tanggal").value;

  const isiSurat = \`
    Surat Tugas
    ==========================
    Yang bertanda tangan di bawah ini, menugaskan kepada:
    Nama: \${nama}
    NIP: \${nip}
    Jabatan: \${jabatan}

    Untuk melaksanakan tugas ke \${tujuan} pada tanggal \${tanggal}
    Dalam rangka: \${keperluan}

    Demikian surat ini dibuat untuk digunakan sebagaimana mestinya.
  \`;

  document.getElementById("previewSurat").innerText = isiSurat;

  await addDoc(collection(db, "surat_tugas"), {
    nama, nip, jabatan, tujuan, keperluan, tanggal, isiSurat, waktu: new Date()
  });

  alert("Surat berhasil disimpan ke database!");
});

window.exportPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById("previewSurat").innerText, 10, 10);
  doc.save("surat-tugas.pdf");
};
