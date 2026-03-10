// =========================================================
// 🚀 UNIMAN v3.3 BETA - CORE APPLICATION ENGINE
// Developer: Kerem Akdoğan
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tüm Sistemleri Tek Bir Çatı Altında Başlat
  hesaplayiciOlaylariniBaslat();
  devamsizlikOlaylariniBaslat();
  agnoOlaylariniBaslat();

  // 2. Beta Pop-up'ı 1 Saniye Gecikmeyle Göster
  setTimeout(() => {
    const popup = document.getElementById("dev-popup");
    if (popup) {
      popup.style.display = "block";
    }
  }, 1000);

  // 3. 🔵 SLIDER NOKTA (DOT) KONTROLÜ
  const slider = document.getElementById("ana-slider");
  const noktalar = document.querySelectorAll(".nokta");

  if (slider && noktalar.length > 0) {
    slider.addEventListener("scroll", () => {
      // Hangi kartın ekranda olduğunu hesapla
      let aktifIndex = Math.round(slider.scrollLeft / slider.clientWidth);

      // Güvenlik: Index sınırları aşmasın
      if (aktifIndex < 0) aktifIndex = 0;
      if (aktifIndex >= noktalar.length) aktifIndex = noktalar.length - 1;

      // Tüm noktalardan aktif sınıfını temizle ve doğru olana ekle
      noktalar.forEach((n, i) => {
        if (i === aktifIndex) {
          n.classList.add("aktif");
        } else {
          n.classList.remove("aktif");
        }
      });
    });
  }
});

// --- 🗺️ SPA NAVIGATION (SAYFA GEÇİŞLERİ) ---
function modulYukle(modulAdi) {
  // Önce her yeri gizle
  const bolumler = ["gorunum-ana-sayfa", "modul-not-hesaplayici", "modul-devamsizlik", "modul-agno"];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });

  // Sadece istenen modülü göster
  const hedefModul = document.getElementById(`modul-${modulAdi}`);
  if (hedefModul) hedefModul.classList.remove("gizli");
}

function anaSayfayaDon() {
  // Tüm modülleri gizle ve ana sayfayı aç
  const bolumler = ["modul-not-hesaplayici", "modul-devamsizlik", "modul-agno"];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });
  document.getElementById("gorunum-ana-sayfa").classList.remove("gizli");
}

// --- 🧮 NOT HESAPLAYICI MODÜLÜ ---
function hesaplayiciOlaylariniBaslat() {
  const btnEtkinlikEkle = document.getElementById("btn-etkinlik-ekle");
  const btnHesapla = document.getElementById("btn-hesapla");
  const etkinliklerKapsayici = document.getElementById("etkinlikler-kapsayici");

  kayitliDersleriYukle();

  if (btnEtkinlikEkle) {
    btnEtkinlikEkle.addEventListener("click", () => {
      const yeniSatir = document.createElement("div");
      yeniSatir.className = "etkinlik-satiri ek-etkinlik";
      yeniSatir.style.cssText = "display: flex; align-items: flex-end; gap: 10px; margin-bottom: 15px;";
      yeniSatir.innerHTML = `
        <button type="button" class="btn-etkinlik-sil" style="background-color: #ff4c4c; color: #fff; border: none; border-radius: 12px; width: 45px; height: 45px; font-size: 1.5rem; font-weight: bold; cursor: pointer;">-</button>
        <div class="girdi-grubu" style="margin-bottom: 0; flex: 1;">
            <label>Ek Etkinlik Notu</label>
            <input type="number" class="etkinlik-notu" placeholder="Not" min="0" max="100">
        </div>
        <div class="girdi-grubu" style="margin-bottom: 0; flex: 1;">
            <label>Yüzdesi (%)</label>
            <input type="number" class="etkinlik-yuzdesi" placeholder="Örn: 10" min="0" max="100">
        </div>`;
      yeniSatir.querySelector(".btn-etkinlik-sil").addEventListener("click", () => yeniSatir.remove());
      etkinliklerKapsayici.appendChild(yeniSatir);
    });
  }

  if (btnHesapla) {
    btnHesapla.addEventListener("click", hesaplaVizeFinal);
  }
}

function hesaplaVizeFinal() {
  const inptDersAdi = document.getElementById("ders-adi");
  const inptGecmeNotu = document.getElementById("gecme-notu");
  const inptVizeNotu = document.getElementById("vize-notu");
  const inptVizeYuzdesi = document.getElementById("vize-yuzdesi");
  const kutuSonuc = document.getElementById("sonuc-alani");

  let dersAdi = inptDersAdi.value.trim() || "İsimsiz Ders";
  const gecmeNotu = parseFloat(inptGecmeNotu.value) || 60;
  const vizeNotu = parseFloat(inptVizeNotu.value) || 0;
  const vizeYuzdesi = parseFloat(inptVizeYuzdesi.value) || 0;

  let toplamYilIciPuan = vizeNotu * (vizeYuzdesi / 100);
  let toplamYilIciYuzde = vizeYuzdesi;

  document.querySelectorAll(".etkinlik-satiri:not(:first-child)").forEach((satir) => {
    const nt = parseFloat(satir.querySelector(".etkinlik-notu").value) || 0;
    const yz = parseFloat(satir.querySelector(".etkinlik-yuzdesi").value) || 0;
    toplamYilIciPuan += nt * (yz / 100);
    toplamYilIciYuzde += yz;
  });

  const finalYuzdesi = 100 - toplamYilIciYuzde;
  if (finalYuzdesi <= 0) {
    alert("Yüzdeler toplamı 100'ü geçemez!");
    return;
  }

  let gerekliFinal = Math.ceil((gecmeNotu - toplamYilIciPuan) / (finalYuzdesi / 100));
  kutuSonuc.classList.remove("gizli");

  if (gerekliFinal > 100) {
    kutuSonuc.innerHTML = `<strong>Kritik Durum:</strong> Finalden ${gerekliFinal} alman lazım. Zor görünüyor!`;
    kutuSonuc.style.borderLeftColor = "#ff4c4c";
  } else {
    kutuSonuc.innerHTML = `<strong>Hedef:</strong> Finalden en az <b>${Math.max(
      0,
      gerekliFinal,
    )}</b> almalısın.`;
    kutuSonuc.style.borderLeftColor = "var(--primary-blue)";
  }

  // Kaydet
  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
  kaydedilenler.push({ id: Date.now(), ad: dersAdi, vize: toplamYilIciPuan.toFixed(1), hedef: gerekliFinal });
  localStorage.setItem("unimanDersler", JSON.stringify(kaydedilenler));
  kayitliDersleriYukle();
}

window.kayitliDersleriYukle = function () {
  const alan = document.getElementById("ders-listesi");
  if (!alan) return;
  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
  alan.innerHTML = kaydedilenler.length === 0 ? '<p class="soluk-metin">Henüz ders yok.</p>' : "";
  kaydedilenler.forEach((d) => {
    alan.innerHTML += `<div class="ders-karti"><div class="ders-karti-bilgi"><h4>${d.ad}</h4><p>Yıl İçi: ${d.vize} | Hedef: ${d.hedef}</p></div><button class="btn-sil" onclick="dersiSil(${d.id})">🗑️</button></div>`;
  });
};

window.dersiSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDersler")).filter((d) => d.id !== id);
  localStorage.setItem("unimanDersler", JSON.stringify(liste));
  kayitliDersleriYukle();
};

// --- 📅 DEVAMSIZLIK MODÜLÜ ---
function devamsizlikOlaylariniBaslat() {
  devamsizlikListesiniYukle();
  const btnDevEkle = document.getElementById("btn-dev-ekle");
  if (btnDevEkle) {
    btnDevEkle.addEventListener("click", () => {
      const ad = document.getElementById("dev-ders-adi").value.trim();
      const sinir = parseInt(document.getElementById("dev-sinir").value) || 4;
      if (!ad) return alert("Ders adı boş olamaz!");
      let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
      liste.push({ id: Date.now(), ad: ad, kullanilan: 0, sinir: sinir });
      localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
      devamsizlikListesiniYukle();
      document.getElementById("dev-ders-adi").value = "";
    });
  }
}

window.devamsizlikListesiniYukle = function () {
  const alan = document.getElementById("dev-listesi");
  if (!alan) return;
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
  alan.innerHTML = liste.length === 0 ? '<p class="soluk-metin">Henüz takip yok.</p>' : "";
  liste.forEach((d) => {
    alan.innerHTML += `<div class="ders-karti"><h4>${d.ad}</h4><p>${d.kullanilan}/${d.sinir}</p><div><button onclick="devArtir(${d.id})">+</button><button class="btn-sil" onclick="devSil(${d.id})">🗑️</button></div></div>`;
  });
};

window.devArtir = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik"));
  let d = liste.find((x) => x.id === id);
  if (d) {
    d.kullanilan++;
    localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
    devamsizlikListesiniYukle();
  }
};

window.devSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")).filter((d) => d.id !== id);
  localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
  devamsizlikListesiniYukle();
};

// --- 🎓 AGNO (ORTALAMA) MODÜLÜ ---
function agnoOlaylariniBaslat() {
  agnoListesiniYukle();
  const btnAgnoEkle = document.getElementById("btn-agno-ekle");
  if (btnAgnoEkle) {
    btnAgnoEkle.addEventListener("click", () => {
      const ad = document.getElementById("agno-ders-adi").value.trim();
      const kredi = parseFloat(document.getElementById("agno-kredi").value);
      const harfDegeri = parseFloat(document.getElementById("agno-harf").value);
      const harfMetni = document
        .getElementById("agno-harf")
        .options[document.getElementById("agno-harf").selectedIndex].text.split(" ")[0];

      if (!ad || !kredi) return alert("Bilgileri eksiksiz gir!");

      let liste = JSON.parse(localStorage.getItem("unimanAgno")) || [];
      liste.push({ id: Date.now(), ad: ad, kredi: kredi, harfDegeri: harfDegeri, harfMetni: harfMetni });
      localStorage.setItem("unimanAgno", JSON.stringify(liste));
      agnoListesiniYukle();
      document.getElementById("agno-ders-adi").value = "";
      document.getElementById("agno-kredi").value = "";
    });
  }
}

window.agnoListesiniYukle = function () {
  const alan = document.getElementById("agno-listesi");
  const sonucEkrani = document.getElementById("agno-genel-sonuc");
  if (!alan) return;
  let liste = JSON.parse(localStorage.getItem("unimanAgno")) || [];

  if (liste.length === 0) {
    alan.innerHTML = '<p class="soluk-metin">Ders eklenmedi.</p>';
    sonucEkrani.innerText = "0.00";
    return;
  }

  alan.innerHTML = "";
  let tp = 0,
    tk = 0;
  liste.forEach((d) => {
    tk += d.kredi;
    tp += d.kredi * d.harfDegeri;
    alan.innerHTML += `<div class="ders-karti"><div class="ders-karti-bilgi"><h4>${d.ad}</h4><p>AKTS: ${d.kredi} | Not: ${d.harfMetni}</p></div><button class="btn-sil" onclick="agnoSil(${d.id})">🗑️</button></div>`;
  });
  sonucEkrani.innerText = (tp / tk).toFixed(2);
};

window.agnoSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanAgno")).filter((d) => d.id !== id);
  localStorage.setItem("unimanAgno", JSON.stringify(liste));
  agnoListesiniYukle();
};

// --- 🔔 POP-UP & İLETİŞİM KONTROL ---
function kapatPopup() {
  const popup = document.getElementById("dev-popup");
  if (popup) {
    popup.style.animation = "popupBuyume 0.3s reverse forwards";
    setTimeout(() => {
      popup.style.display = "none";
    }, 300);
  }
}

function geriBildirimGonder() {
  const email = "akdogankerem81@gmail.com";
  const konu = encodeURIComponent("UniMan Geri Bildirim");
  const govde = encodeURIComponent("Merhaba Kerem, UniMan uygulaması hakkında önerim/hatam şudur:\n\n");

  window.location.href = `mailto:${email}?subject=${konu}&body=${govde}`;
}
