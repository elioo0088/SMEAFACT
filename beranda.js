import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5yhUCxpWaZan1oJWdTVb9oJVO32xYv10",
  authDomain: "smeafact.firebaseapp.com",
  projectId: "smeafact",
  storageBucket: "smeafact.firebasestorage.app",
  messagingSenderId: "770573575881",
  appId: "1:770573575881:web:a67263962a304006cf0f18"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const wadahPengumuman = document.getElementById("daftarPengumuman");
const q = query(collection(db, "pengumuman"), orderBy("tanggal", "desc"));

function pilihIkonKategori(kategori) {
    switch (kategori) {
        case 'Akademik': return '📚';
        case 'Kegiatan OSIS': return '🚀';
        case 'Beasiswa': return '🎓';
        default: return '📢';
    }
}

onSnapshot(q, (snapshot) => {
    wadahPengumuman.innerHTML = ""; 

    if (snapshot.empty) {
        wadahPengumuman.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 16px;">
                <p style="font-size: 40px; margin-bottom: 10px;">🏝️</p>
                <p style="color: #64748b; font-weight: 600;">Belum ada pengumuman saat ini. Cek lagi nanti ya!</p>
            </div>
        `;
        return;
    }

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let teksTanggal = "Waktu tidak diketahui";
        
        if (data.tanggal) {
            const dateObj = data.tanggal.toDate();
            teksTanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const ikon = pilihIkonKategori(data.kategori);

        let bagianLampiran = "";
        if (data.fileUrl && data.fileUrl.trim() !== "") {
            bagianLampiran = `
                <div class="lampiran-box">
                    <span style="font-size: 13px; color: #475569; font-weight: 600;">📎 Berkas / Lampiran Terkait</span>
                    <a href="${data.fileUrl}" target="_blank">Buka / Unduh Berkas</a>
                </div>
            `;
        }

        const kartu = document.createElement("div");
        kartu.className = "kartu-pengumuman";
        kartu.innerHTML = `
            <div class="kartu-header-img">
                <span>${ikon}</span>
            </div>
            <div class="kartu-body">
                <div class="meta-info">
                    <span class="kategori">${data.kategori}</span>
                    <span class="tanggal">📅 ${teksTanggal}</span>
                </div>
                <h2 class="judul">${data.judul}</h2>
                <p class="isi">${data.isi}</p>
                ${bagianLampiran}
                <div class="footer-kartu" style="margin-top: 15px;">
                    <small>✍️ Ditulis oleh: <strong>${data.penulis}</strong></small>
                    <small>✨ SMEAFACT Official</small>
                </div>
            </div>
        `;

        wadahPengumuman.appendChild(kartu);
    });
});