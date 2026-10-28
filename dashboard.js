import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5yhUCxpWaZan1oJWdTVb9oJVO32xYv10",
  authDomain: "smeafact.firebaseapp.com",
  projectId: "smeafact",
  storageBucket: "smeafact.firebasestorage.app",
  messagingSenderId: "770573575881",
  appId: "1:770573575881:web:a67263962a304006cf0f18"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const kontenDashboard = document.getElementById("kontenDashboard");
const adminEmailDisplay = document.getElementById("adminEmail");
const btnLogout = document.getElementById("btnLogout");
const formPengumuman = document.getElementById("formPengumuman");
const tabelPengumuman = document.getElementById("tabelPengumuman");

onAuthStateChanged(auth, (user) => {
    if (user) {
        kontenDashboard.style.display = "block";
        adminEmailDisplay.textContent = user.email;
    } else {
        window.location.href = "index.html";
    }
});

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        signOut(auth).catch(console.error);
    });
}

if (formPengumuman) {
    formPengumuman.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nilaiJudul = document.getElementById("judul").value;
        const nilaiKategori = document.getElementById("kategori").value;
        const nilaiIsi = document.getElementById("isi").value;
        const nilaiFileUrl = document.getElementById("fileUrlInput").value;

        try {
            await addDoc(collection(db, "pengumuman"), {
                judul: nilaiJudul,
                kategori: nilaiKategori,
                isi: nilaiIsi,
                fileUrl: nilaiFileUrl,
                penulis: auth.currentUser.email,
                tanggal: serverTimestamp()
            });
            alert("Pengumuman berhasil diterbitkan!");
            formPengumuman.reset();
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            alert("Gagal menerbitkan pengumuman.");
        }
    });
}

const q = query(collection(db, "pengumuman"), orderBy("tanggal", "desc"));
onSnapshot(q, (snapshot) => {
    tabelPengumuman.innerHTML = ""; 
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const baris = document.createElement("tr");
        baris.innerHTML = `
            <td><strong>${data.judul}</strong></td>
            <td><span class="kategori">${data.kategori}</span></td>
            <td>${data.penulis}</td>
            <td>
                <button class="btn-hapus" data-id="${docSnap.id}">Hapus</button>
            </td>
        `;
        tabelPengumuman.appendChild(baris);
    });
});

tabelPengumuman.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-hapus")) {
        const idPengumuman = e.target.getAttribute("data-id");
        if (confirm("Yakin ingin menghapus pengumuman ini?")) {
            try {
                await deleteDoc(doc(db, "pengumuman", idPengumuman));
            } catch (error) {
                console.error("Gagal hapus:", error);
            }
        }
    }
});