// =========================================================
// 🚀 UNIMAN v1.3 BETA - CORE APPLICATION ENGINE
// Developer: Kerem Akdoğan
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tüm Sistemleri Tek Bir Çatı Altında Başlat
  hesaplayiciOlaylariniBaslat();
  devamsizlikOlaylariniBaslat();
  agnoOlaylariniBaslat();
  programOlaylariniBaslat();
  takvimOlaylariniBaslat();
  notOlaylariniBaslat(); // 🪄 YENİ: Notlar modülü marşa bastı!

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
      let aktifIndex = Math.round(slider.scrollLeft / slider.clientWidth);

      if (aktifIndex < 0) aktifIndex = 0;
      if (aktifIndex >= noktalar.length) aktifIndex = noktalar.length - 1;

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
window.modulYukle = function (modulAdi) {
  const bolumler = [
    "gorunum-ana-sayfa",
    "modul-not-hesaplayici",
    "modul-devamsizlik",
    "modul-agno",
    "modul-pomodoro",
    "modul-program",
    "modul-notlar", // 🪄 YENİ EKLENDİ
  ];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });

  const hedefModul = document.getElementById(`modul-${modulAdi}`);
  if (hedefModul) hedefModul.classList.remove("gizli");
};

window.anaSayfayaDon = function () {
  const bolumler = [
    "modul-not-hesaplayici",
    "modul-devamsizlik",
    "modul-agno",
    "modul-pomodoro",
    "modul-program",
    "modul-notlar", // 🪄 YENİ EKLENDİ
  ];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });
  document.getElementById("gorunum-ana-sayfa").classList.remove("gizli");
};

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

  let mesaj = "";
  let renkKodu = "";
  let arkaPlan = "";

  if (gerekliFinal > 100) {
    mesaj = `<strong>Kritik Durum:</strong> Finalden <b>${gerekliFinal}</b> alman lazım. Mucizelere ihtiyacımız var! 🚑`;
    renkKodu = "#ef4444";
    arkaPlan = "#fef2f2";
  } else if (gerekliFinal > 75) {
    mesaj = `<strong>Zorlu Görev:</strong> Finalden en az <b>${gerekliFinal}</b> almalısın. Sıkı çalışman gerekecek! 📚`;
    renkKodu = "#f59e0b";
    arkaPlan = "#fffbeb";
  } else if (gerekliFinal > 40) {
    mesaj = `<strong>Hedef:</strong> Finalden en az <b>${gerekliFinal}</b> almalısın. Rahatlıkla yapabilirsin! 💪`;
    renkKodu = "var(--primary-blue, #2563eb)";
    arkaPlan = "#eff6ff";
  } else if (gerekliFinal > 0) {
    mesaj = `<strong>Çok Rahat:</strong> Finalden sadece <b>${gerekliFinal}</b> alman yetiyor. Kahveni al ve rahatla! ☕`;
    renkKodu = "#22c55e";
    arkaPlan = "#f0fdf4";
  } else {
    mesaj = `<strong>Geçtin Bile:</strong> Finalden <b>0</b> alsan da geçiyorsun. Kralsın! 👑`;
    renkKodu = "#10b981";
    arkaPlan = "#ecfdf5";
  }

  kutuSonuc.innerHTML = mesaj;
  kutuSonuc.style.border = `2px solid ${renkKodu}`;
  kutuSonuc.style.backgroundColor = arkaPlan;
  kutuSonuc.style.color = "#0f172a";
  kutuSonuc.style.padding = "16px";
  kutuSonuc.style.borderRadius = "12px";

  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
  kaydedilenler.push({ id: Date.now(), ad: dersAdi, vize: toplamYilIciPuan.toFixed(1), hedef: gerekliFinal });
  localStorage.setItem("unimanDersler", JSON.stringify(kaydedilenler));
  kayitliDersleriYukle();
}

window.kayitliDersleriYukle = function () {
  const alan = document.getElementById("ders-listesi");
  if (!alan) return;
  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];

  if (kaydedilenler.length === 0) {
    alan.innerHTML = '<p class="soluk-metin">Henüz ders yok.</p>';
    return;
  }

  let htmlIcerik = "";
  kaydedilenler.forEach((d) => {
    let rozetRengi = "#3b82f6";
    if (d.hedef > 100) rozetRengi = "#ef4444";
    else if (d.hedef > 75) rozetRengi = "#f59e0b";
    else if (d.hedef <= 40) rozetRengi = "#22c55e";

    let hedefMetni = d.hedef > 0 ? d.hedef : "Geçti";

    htmlIcerik += `
      <div class="swipe-container" data-id="${d.id}" data-type="vize">
        <div class="swipe-background">🗑️ Sil</div>
        <div class="swipe-card" style="padding: 16px;">
          <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
            <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600;">${d.ad}</h4>
            <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">Yıl İçi Puanı: <strong style="color: #0f172a;">${d.vize}</strong></span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: ${rozetRengi}; color: #ffffff; width: 50px; height: 50px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <span style="font-size: 0.65rem; opacity: 0.9; font-weight: 600; text-transform: uppercase;">Hedef</span>
            <span style="font-size: 1.2rem; font-weight: bold; line-height: 1.1;">${hedefMetni}</span>
          </div>
        </div>
      </div>
    `;
  });
  alan.innerHTML = htmlIcerik;
  tumSwipeOlaylariniEkle();
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

  if (liste.length === 0) {
    alan.innerHTML = '<p class="soluk-metin">Henüz takip yok.</p>';
    return;
  }

  let htmlIcerik = "";
  liste.forEach((d) => {
    let yuzde = (d.kullanilan / d.sinir) * 100;
    if (yuzde > 100) yuzde = 100;

    let barRengi = "#22c55e";
    if (yuzde >= 80) barRengi = "#ef4444";
    else if (yuzde >= 50) barRengi = "#f59e0b";

    htmlIcerik += `
      <div class="swipe-container" data-id="${d.id}" data-type="devamsizlik">
        <div class="swipe-background">🗑️ Sil</div>
        <div class="swipe-card" style="flex-direction: column; gap: 16px; padding: 20px; align-items: flex-start;">
          <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; text-align: left;">
            <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600; width: 100%;">${d.ad}</h4>
            <span style="font-size: 0.95rem; color: #64748b; font-weight: 500; width: 100%;">
              Kullanılan: <strong style="color: ${barRengi}; font-size: 1.05rem;">${d.kullanilan}</strong> / ${d.sinir}
            </span>
          </div>
          <div style="width: 100%; height: 8px; background-color: #f1f5f9; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${yuzde}%; background-color: ${barRengi}; border-radius: 4px; transition: width 0.4s ease, background-color 0.4s ease;"></div>
          </div>
          <div style="display: flex; justify-content: flex-end; width: 100%; margin-top: 4px; gap: 10px;">
            <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: bold; background-color: var(--primary-blue, #2563eb); color: #ffffff; border-radius: 12px; border: none; cursor: pointer;" onclick="devArtir(${d.id})">+</button>
            <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; background-color: #f8fafc; color: #64748b; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer;" onclick="devAzalt(${d.id})">-</button>
          </div>
        </div>
      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
  tumSwipeOlaylariniEkle();
};

window.devArtir = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik"));
  let d = liste.find((x) => x.id === id);
  if (d) {
    if (d.kullanilan < d.sinir) {
      d.kullanilan++;
      localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
      devamsizlikListesiniYukle();
    } else {
      alert(`Dikkat! ${d.ad} dersi için devamsızlık sınırını zaten doldurdun.`);
    }
  }
};

window.devAzalt = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik"));
  let d = liste.find((x) => x.id === id);
  if (d) {
    if (d.kullanilan > 0) {
      d.kullanilan--;
      localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
      devamsizlikListesiniYukle();
    }
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

  let htmlIcerik = "";
  let tp = 0,
    tk = 0;

  const renkPaleti = {
    AA: "#16a34a",
    BA: "#22c55e",
    BB: "#84cc16",
    CB: "#eab308",
    CC: "#f59e0b",
    DC: "#f97316",
    DD: "#ea580c",
    FD: "#ef4444",
    FF: "#dc2626",
  };

  liste.forEach((d) => {
    tk += d.kredi;
    tp += d.kredi * d.harfDegeri;

    let rozetRengi = renkPaleti[d.harfMetni] || "#64748b";

    htmlIcerik += `
      <div class="swipe-container" data-id="${d.id}" data-type="agno">
        <div class="swipe-background">🗑️ Sil</div>
        <div class="swipe-card" style="padding: 16px;">
          <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
            <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600;">${d.ad}</h4>
            <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">AKTS: <strong style="color: #0f172a;">${d.kredi}</strong></span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: ${rozetRengi}; color: #ffffff; width: 50px; height: 50px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <span style="font-size: 0.65rem; opacity: 0.9; font-weight: 600; text-transform: uppercase;">Not</span>
            <span style="font-size: 1.2rem; font-weight: bold; line-height: 1.1;">${d.harfMetni}</span>
          </div>
        </div>
      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
  sonucEkrani.innerText = (tp / tk).toFixed(2);
  tumSwipeOlaylariniEkle();
};

window.agnoSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanAgno")).filter((d) => d.id !== id);
  localStorage.setItem("unimanAgno", JSON.stringify(liste));
  agnoListesiniYukle();
};

// --- 🔔 POP-UP & İLETİŞİM KONTROL ---
window.kapatPopup = function () {
  const popup = document.getElementById("dev-popup");
  if (popup) {
    popup.style.animation = "popupBuyume 0.3s reverse forwards";
    setTimeout(() => {
      popup.style.display = "none";
    }, 300);
  }
};

window.geriBildirimGonder = function () {
  const email = "akdogankerem81@gmail.com";
  const konu = encodeURIComponent("UniMan Geri Bildirim");
  const govde = encodeURIComponent("Merhaba Kerem, UniMan uygulaması hakkında önerim/hatam şudur:\n\n");
  window.location.href = `mailto:${email}?subject=${konu}&body=${govde}`;
};

// --- ⏱️ POMODORO MODÜLÜ ---
let pomoToplamSure = 25 * 60; // 25 dakika
let pomoSure = pomoToplamSure;
let pomoZamanlayici = null;
let pomoCalisiyor = false;

const zilSesi = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

window.pomodoroGuncelle = function () {
  const dk = Math.floor(pomoSure / 60);
  const sn = pomoSure % 60;
  document.getElementById("zaman-gostergesi").innerText = `${dk.toString().padStart(2, "0")}:${sn
    .toString()
    .padStart(2, "0")}`;

  const cember = document.getElementById("pomo-cember");
  if (cember) {
    let yuzde = pomoSure / pomoToplamSure;
    let eksilenMiktar = 283 - 283 * yuzde;
    cember.style.strokeDashoffset = eksilenMiktar;
  }
};

window.pomodoroBaslat = function () {
  if (pomoCalisiyor) return;
  pomoCalisiyor = true;
  document.getElementById("pomodoro-durum").innerText = "Odaklanılıyor...";

  pomoZamanlayici = setInterval(() => {
    if (pomoSure > 0) {
      pomoSure--;
      window.pomodoroGuncelle();
    } else {
      window.pomodoroDuraklat();
      zilSesi.play();
      document.getElementById("pomodoro-durum").innerText = "Mola Vakti!";
      alert("Tebrikler Kero! 25 dakikalık seansı tamamladın. Şimdi 5 dakika mola vakti.");
    }
  }, 1000);
};

window.pomodoroDuraklat = function () {
  pomoCalisiyor = false;
  clearInterval(pomoZamanlayici);
  if (pomoSure > 0) {
    document.getElementById("pomodoro-durum").innerText = "Duraklatıldı";
  }
};

window.pomodoroSifirla = function () {
  window.pomodoroDuraklat();
  pomoSure = pomoToplamSure;
  window.pomodoroGuncelle();
  document.getElementById("pomodoro-durum").innerText = "Çalışma Zamanı";
};

// --- 🗓️ HAFTALIK DERS PROGRAMI MODÜLÜ ---
let seciliGun = "Pazartesi";

window.programOlaylariniBaslat = function () {
  const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  let bugun = gunler[new Date().getDay()];

  if (bugun === "Cumartesi" || bugun === "Pazar") {
    bugun = "Pazartesi";
  }
  gunSec(bugun);
};

window.gunSec = function (gunAdi) {
  seciliGun = gunAdi;

  const butonlar = document.querySelectorAll(".gun-btn");
  butonlar.forEach((btn) => {
    if (btn.innerText === gunAdi) {
      btn.style.background = "var(--primary-blue, #2563eb)";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.boxShadow = "0 4px 10px rgba(37, 99, 235, 0.25)";
    } else {
      btn.style.background = "#f8fafc";
      btn.style.color = "#64748b";
      btn.style.border = "1px solid #e2e8f0";
      btn.style.boxShadow = "none";
    }
  });

  programiYukle();
};

// 🪄 Yeni Ders Formunu O Anki Güne Senkronize Ederek Aç
window.yeniDersFormuAc = function () {
  const gunSecici = document.getElementById("prog-gun");
  if (gunSecici) {
    gunSecici.value = seciliGun; // Açılır kutuyu, ana ekranda bulunduğun güne otomatik ayarlar
  }
  modulYukle("program");
};

window.programaDersEkle = function () {
  const gun = document.getElementById("prog-gun").value;
  const ad = document.getElementById("prog-ders-adi").value.trim();
  const baslangic = document.getElementById("prog-baslangic").value;
  const bitis = document.getElementById("prog-bitis").value;
  const sinif = document.getElementById("prog-sinif").value.trim();

  if (!ad || !baslangic || !bitis) return alert("Lütfen dersin adını ve saatlerini eksiksiz gir!");

  let liste = JSON.parse(localStorage.getItem("unimanProgram")) || [];
  liste.push({ id: Date.now(), gun: gun, ad: ad, baslangic: baslangic, bitis: bitis, sinif: sinif });

  liste.sort((a, b) => (a.baslangic || a.saat).localeCompare(b.baslangic || b.saat));
  localStorage.setItem("unimanProgram", JSON.stringify(liste));

  document.getElementById("prog-ders-adi").value = "";
  document.getElementById("prog-baslangic").value = "";
  document.getElementById("prog-bitis").value = "";
  document.getElementById("prog-sinif").value = "";

  gunSec(gun);
  anaSayfayaDon();
};

window.programiYukle = function () {
  const alan = document.getElementById("program-listesi");
  if (!alan) return;

  let liste = JSON.parse(localStorage.getItem("unimanProgram")) || [];
  let gununDersleri = liste.filter((d) => d.gun === seciliGun);

  if (gununDersleri.length === 0) {
    alan.innerHTML = `<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;"><p style="color: #64748b; font-weight: 500; margin: 0;">${seciliGun} günü dersin yok. Gönlünce dinlen! ☕</p></div>`;
    return;
  }

  let htmlIcerik = "";
  gununDersleri.forEach((d) => {
    let gosterilecekSaat = d.baslangic
      ? `<strong style="color: #0f172a; font-size: 1.05rem; display: block;">${d.baslangic}</strong><span style="color: #64748b; font-size: 0.8rem; font-weight: 700; display: block; margin-top: 2px;">${d.bitis}</span>`
      : `<strong style="color: #0f172a; font-size: 1.1rem; display: block;">${d.saat}</strong>`;

    htmlIcerik += `
      <div class="swipe-container" data-id="${d.id}" data-type="program">
        <div class="swipe-background">🗑️ Sil</div>
        <div class="swipe-card" style="padding: 16px;">
          <div style="display: flex; gap: 15px; align-items: center;">
            <div style="background: #f1f5f9; padding: 10px; border-radius: 12px; text-align: center; min-width: 75px;">
              ${gosterilecekSaat}
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
              <h4 style="margin: 0; font-size: 1.1rem; color: #0f172a; font-weight: 600;">${d.ad}</h4>
              <span style="font-size: 0.9rem; color: #64748b; font-weight: 500;">📍 ${
                d.sinif || "Sınıf Girilmedi"
              }</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
  tumSwipeOlaylariniEkle();
};

window.programdanSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanProgram")) || [];
  liste = liste.filter((d) => d.id !== id);
  localStorage.setItem("unimanProgram", JSON.stringify(liste));
  programiYukle();
};

// =========================================================
// 📅 TAKVİM VE PROJE TAKİP MOTORU
// =========================================================

let aktifTarih = new Date();
let seciliTakvimGunu = "";

window.takvimOlaylariniBaslat = function () {
  takvimiCiz();
};

window.ayDegistir = function (yon) {
  aktifTarih.setMonth(aktifTarih.getMonth() + yon);
  takvimiCiz();
};

window.takvimiCiz = function () {
  const izgara = document.getElementById("takvim-izgarasi");
  const baslik = document.getElementById("takvim-ay-yil");
  if (!izgara) return;

  const aylar = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const yil = aktifTarih.getFullYear();
  const ay = aktifTarih.getMonth();

  baslik.innerText = `${aylar[ay]} ${yil}`;
  izgara.innerHTML = "";

  let ilkGun = new Date(yil, ay, 1).getDay();
  ilkGun = ilkGun === 0 ? 6 : ilkGun - 1;

  const ayinGunSayisi = new Date(yil, ay + 1, 0).getDate();
  const bugun = new Date();

  let gorevler = JSON.parse(localStorage.getItem("unimanGorevler")) || [];

  for (let i = 0; i < ilkGun; i++) {
    izgara.innerHTML += `<div class="takvim-gun bos-hucre"></div>`;
  }

  for (let g = 1; g <= ayinGunSayisi; g++) {
    const hucreTarihi = `${yil}-${ay + 1}-${g}`;

    const gorevVarMi = gorevler.some((grv) => grv.tarih === hucreTarihi);
    const isBugun = g === bugun.getDate() && ay === bugun.getMonth() && yil === bugun.getFullYear();

    let siniflar = "takvim-gun";
    if (isBugun) siniflar += " bugun";
    if (gorevVarMi) siniflar += " dolu";

    izgara.innerHTML += `<div class="${siniflar}" onclick="gunDetayAc('${hucreTarihi}', '${g} ${aylar[ay]}')">${g}</div>`;
  }
};

window.yeniGorevFormuGoster = function () {
  const btnAc = document.getElementById("btn-yeni-gorev-ac");
  const formAlan = document.getElementById("yeni-gorev-formu");
  const inputAlan = document.getElementById("yeni-gorev-metni");

  if (btnAc) btnAc.style.display = "none";
  if (formAlan) formAlan.style.display = "flex";
  if (inputAlan) inputAlan.focus();
};

window.yeniGorevFormuGizle = function () {
  const btnAc = document.getElementById("btn-yeni-gorev-ac");
  const formAlan = document.getElementById("yeni-gorev-formu");
  const inputAlan = document.getElementById("yeni-gorev-metni");

  if (btnAc) btnAc.style.display = "block";
  if (formAlan) formAlan.style.display = "none";
  if (inputAlan) inputAlan.value = "";
};

window.gunDetayAc = function (tarihKodu, okunakliTarih) {
  seciliTakvimGunu = tarihKodu;
  document.getElementById("gorev-popup-baslik").innerText = `${okunakliTarih} Görevleri`;
  document.getElementById("gorev-popup").style.display = "block";

  yeniGorevFormuGizle();
  seciliGunGorevleriniYukle();
};

window.kapatGorevPopup = function () {
  document.getElementById("gorev-popup").style.display = "none";
  takvimiCiz();
};

window.takvimGorevEkle = function () {
  const metin = document.getElementById("yeni-gorev-metni").value.trim();
  if (!metin) return;

  let gorevler = JSON.parse(localStorage.getItem("unimanGorevler")) || [];
  gorevler.push({
    id: Date.now(),
    tarih: seciliTakvimGunu,
    metin: metin,
    tamamlandi: false,
  });

  localStorage.setItem("unimanGorevler", JSON.stringify(gorevler));
  seciliGunGorevleriniYukle();

  yeniGorevFormuGizle();
  takvimiCiz();
};

window.seciliGunGorevleriniYukle = function () {
  const alan = document.getElementById("popup-gorev-listesi");
  let gorevler = JSON.parse(localStorage.getItem("unimanGorevler")) || [];

  let gununGorevleri = gorevler.filter((g) => g.tarih === seciliTakvimGunu);

  if (gununGorevleri.length === 0) {
    alan.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:0.9rem; margin-top:20px;">Bu gün için kayıtlı görev yok.</p>`;
    return;
  }

  let html = "";
  gununGorevleri.forEach((g) => {
    let textStyle = g.tamamlandi ? "text-decoration: line-through; color: #94a3b8;" : "color: #0f172a;";
    let bgDurum = g.tamamlandi
      ? "background: #f8fafc; border-color: #e2e8f0;"
      : "background: #ffffff; border-color: #cbd5e1;";

    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 12px; border: 1px solid #cbd5e1; ${bgDurum} transition: all 0.2s;">
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1;" onclick="gorevDurumGuncelle(${
          g.id
        })">
          <input type="checkbox" ${
            g.tamamlandi ? "checked" : ""
          } style="width: 18px; height: 18px; accent-color: var(--primary-blue, #2563eb); pointer-events: none;">
          <span style="font-weight: 600; font-size: 0.95rem; ${textStyle}">${g.metin}</span>
        </div>
        <button onclick="gorevSil(${
          g.id
        })" style="background: none; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer;">🗑️</button>
      </div>
    `;
  });
  alan.innerHTML = html;
};

window.gorevDurumGuncelle = function (id) {
  let gorevler = JSON.parse(localStorage.getItem("unimanGorevler")) || [];
  let gorev = gorevler.find((g) => g.id === id);
  if (gorev) {
    gorev.tamamlandi = !gorev.tamamlandi;
    localStorage.setItem("unimanGorevler", JSON.stringify(gorevler));
    seciliGunGorevleriniYukle();
  }
};

window.gorevSil = function (id) {
  let gorevler = JSON.parse(localStorage.getItem("unimanGorevler")) || [];
  gorevler = gorevler.filter((g) => g.id !== id);
  localStorage.setItem("unimanGorevler", JSON.stringify(gorevler));
  seciliGunGorevleriniYukle();
  takvimiCiz();
};

// =========================================================
// 📝 AKILLI NOTLAR VE GÖRSEL MODÜLÜ (V2)
// =========================================================

window.notOlaylariniBaslat = function () {
  iceAktarmaUyarisiniKontrolEt();
  notKlasorleriniYukle();
};

window.iceAktarmaUyarisiniKontrolEt = function () {
  const uyariKutusu = document.getElementById("notlar-ice-aktar-uyari");
  if (!uyariKutusu) return;

  // Kullanıcı uyarıyı daha önce kapattıysa veya zaten not eklediyse gösterme
  const uyariKapatildi = localStorage.getItem("unimanNotlarIceAktarKapatildi") === "true";
  let programDersleri = JSON.parse(localStorage.getItem("unimanProgram")) || [];

  if (!uyariKapatildi && programDersleri.length > 0) {
    uyariKutusu.style.display = "block";
  } else {
    uyariKutusu.style.display = "none";
  }
};

window.iceAktarmaUyarisiniKapat = function () {
  localStorage.setItem("unimanNotlarIceAktarKapatildi", "true");
  document.getElementById("notlar-ice-aktar-uyari").style.display = "none";
};

window.dersleriNotOlarakEkle = function () {
  let programDersleri = JSON.parse(localStorage.getItem("unimanProgram")) || [];
  let notlar = JSON.parse(localStorage.getItem("unimanNotlar")) || [];

  // Ders programındaki her benzersiz ders adını bul
  let benzersizDersler = [...new Set(programDersleri.map((d) => d.ad))];

  const aylar = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const bugun = new Date();
  const tarihMetni = `${bugun.getDate()} ${aylar[bugun.getMonth()]} ${bugun.getFullYear()}`;

  benzersizDersler.forEach((dersAdi) => {
    // Eğer bu başlıkta bir not zaten yoksa ekle
    if (!notlar.some((n) => n.baslik === dersAdi)) {
      notlar.push({
        id: Date.now() + Math.floor(Math.random() * 1000), // Benzersiz ID
        baslik: dersAdi,
        icerik: "",
        resim: "",
        tarih: tarihMetni,
      });
    }
  });

  localStorage.setItem("unimanNotlar", JSON.stringify(notlar));
  iceAktarmaUyarisiniKapat();
  notKlasorleriniYukle();
  alert("Dersler başarıyla Not Başlığı olarak eklendi! 😎");
};

// --- EKRAN GEÇİŞLERİ ---
window.yeniNotEkraniAc = function () {
  document.getElementById("notlar-liste-gorunumu").style.display = "none";
  document.getElementById("notlar-duzenleyici-gorunumu").style.display = "block";
  document.getElementById("duzenleyici-baslik").innerText = "Yeni Not";

  // Formu Temizle
  document.getElementById("aktif-not-id").value = "";
  document.getElementById("aktif-not-baslik").value = "";
  document.getElementById("aktif-not-icerik").value = "";
  resmiSil(false); // Sadece arayüzden resmi temizle
};

window.notDetayEkraniAc = function (id) {
  let notlar = JSON.parse(localStorage.getItem("unimanNotlar")) || [];
  let seciliNot = notlar.find((n) => n.id === id);
  if (!seciliNot) return;

  document.getElementById("notlar-liste-gorunumu").style.display = "none";
  document.getElementById("notlar-duzenleyici-gorunumu").style.display = "block";
  document.getElementById("duzenleyici-baslik").innerText = "Notu Düzenle";

  // Formu Doldur
  document.getElementById("aktif-not-id").value = seciliNot.id;
  document.getElementById("aktif-not-baslik").value = seciliNot.baslik;
  document.getElementById("aktif-not-icerik").value = seciliNot.icerik;

  // Resim varsa göster, yoksa gizle
  if (seciliNot.resim) {
    document.getElementById("aktif-not-resim-onizleme").src = seciliNot.resim;
    document.getElementById("resim-onizleme-alani").style.display = "block";
    document.getElementById("resim-yukleme-buton-alani").style.display = "none";
  } else {
    resmiSil(false);
  }
};

window.notListesineDon = function () {
  document.getElementById("notlar-duzenleyici-gorunumu").style.display = "none";
  document.getElementById("notlar-liste-gorunumu").style.display = "block";
};

// --- RESİM İŞLEMLERİ (BASE64) ---
window.resimSecildi = function (event) {
  const dosya = event.target.files[0];
  if (!dosya) return;

  const okuyucu = new FileReader();
  okuyucu.onload = function (e) {
    const base64Resim = e.target.result;
    document.getElementById("aktif-not-resim-onizleme").src = base64Resim;
    document.getElementById("resim-onizleme-alani").style.display = "block";
    document.getElementById("resim-yukleme-buton-alani").style.display = "none";
  };
  // Resmi metne çevirerek LocalStorage'da tutabilmemizi sağlar
  okuyucu.readAsDataURL(dosya);
};

window.resmiSil = function (uyariGoster = true) {
  if (uyariGoster && !confirm("Görseli silmek istediğine emin misin?")) return;

  document.getElementById("aktif-not-resim-onizleme").src = "";
  document.getElementById("aktif-not-resim-input").value = "";
  document.getElementById("resim-onizleme-alani").style.display = "none";
  document.getElementById("resim-yukleme-buton-alani").style.display = "block";
};

// --- KAYDETME VE LİSTELEME ---
window.notuKaydetVeDon = function () {
  const idStr = document.getElementById("aktif-not-id").value;
  const baslik = document.getElementById("aktif-not-baslik").value.trim() || "İsimsiz Not";
  const icerik = document.getElementById("aktif-not-icerik").value.trim();
  const resim = document.getElementById("aktif-not-resim-onizleme").src;

  // Resim yoksa (src tarayıcının base URL'sine dönerse) boş string kaydet
  const kaydedilecekResim = resim.includes("data:image") ? resim : "";

  if (!baslik && !icerik && !kaydedilecekResim) return alert("Boş not kaydedilemez Kero!");

  let notlar = JSON.parse(localStorage.getItem("unimanNotlar")) || [];

  const aylar = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const bugun = new Date();
  const tarihMetni = `${bugun.getDate()} ${aylar[bugun.getMonth()]} ${bugun.getFullYear()}`;

  if (idStr) {
    // Var olan notu GÜNCELLE
    const id = parseInt(idStr);
    let index = notlar.findIndex((n) => n.id === id);
    if (index !== -1) {
      notlar[index].baslik = baslik;
      notlar[index].icerik = icerik;
      notlar[index].resim = kaydedilecekResim;
      notlar[index].tarih = tarihMetni; // Son güncellenme tarihi
    }
  } else {
    // YENİ not Ekle
    notlar.push({
      id: Date.now(),
      baslik: baslik,
      icerik: icerik,
      resim: kaydedilecekResim,
      tarih: tarihMetni,
    });
  }

  localStorage.setItem("unimanNotlar", JSON.stringify(notlar));
  notKlasorleriniYukle();
  notListesineDon();
};

window.notKlasorleriniYukle = function () {
  const alan = document.getElementById("not-klasor-listesi");
  if (!alan) return;

  let notlar = JSON.parse(localStorage.getItem("unimanNotlar")) || [];
  notlar.sort((a, b) => b.id - a.id); // Yeniler üstte

  if (notlar.length === 0) {
    alan.innerHTML = `<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;"><p style="color: #64748b; font-weight: 500; margin: 0;">Henüz defterin boş. 📝</p></div>`;
    return;
  }

  let htmlIcerik = "";
  notlar.forEach((n) => {
    // İçerik özetini oluştur (İlk 40 karakter)
    let kisaIcerik = n.icerik
      ? n.icerik.substring(0, 40) + (n.icerik.length > 40 ? "..." : "")
      : "İçerik yok...";
    let resimIkonu = n.resim
      ? `<span style="background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; margin-left: 8px;">📸 Görsel var</span>`
      : "";

    htmlIcerik += `
      <div class="swipe-container" data-id="${n.id}" data-type="notlar" style="cursor: pointer;">
        <div class="swipe-background">🗑️ Sil</div>
        <div class="swipe-card" style="padding: 16px; flex-direction: column; align-items: flex-start;" onclick="notDetayEkraniAc(${n.id})">
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 6px;">
            <div style="display: flex; align-items: center;">
              <span style="font-size: 1.5rem; margin-right: 10px;">📁</span>
              <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 700;">${n.baslik}</h4>
            </div>
            <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 800; background: #f1f5f9; padding: 4px 8px; border-radius: 8px;">${n.tarih}</span>
          </div>
          <div style="display: flex; align-items: center; width: 100%;">
            <p style="margin: 0; font-size: 0.9rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${kisaIcerik}</p>
            ${resimIkonu}
          </div>
        </div>
      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
  tumSwipeOlaylariniEkle();
};

window.notSil = function (id) {
  let notlar = JSON.parse(localStorage.getItem("unimanNotlar")) || [];
  notlar = notlar.filter((n) => n.id !== id);
  localStorage.setItem("unimanNotlar", JSON.stringify(notlar));
  notKlasorleriniYukle();
};

// =========================================================
// 👆 EVRENSEL SWIPE-TO-DELETE (GÜNCELLENDİ)
// =========================================================

window.tumSwipeOlaylariniEkle = function () {
  const kartlar = document.querySelectorAll(".swipe-card:not(.swipe-aktif)");

  kartlar.forEach((kart) => {
    kart.classList.add("swipe-aktif");

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragBasladi = false; // Sadece tıklama mı yoksa kaydırma mı olduğunu anlamak için

    const container = kart.parentElement;
    const id = parseInt(container.getAttribute("data-id"));
    const type = container.getAttribute("data-type");

    const startDrag = (e) => {
      if (e.target.tagName.toLowerCase() === "button" || e.target.tagName.toLowerCase() === "input") return;

      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
      isDragging = true;
      dragBasladi = false;
    };

    const onDrag = (e) => {
      if (!isDragging) return;
      const x = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
      currentX = x - startX;

      if (currentX > 10) {
        dragBasladi = true; // 10 pikselden fazla kaydıysa bu bir "swipe" işlemidir
        kart.classList.add("dragging");
        kart.style.transform = `translateX(${currentX}px)`;

        // Tıklama eventinin (onclick) tetiklenmesini engelle
        e.preventDefault();
      }
    };

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      kart.classList.remove("dragging");

      if (dragBasladi) {
        // Kaydırma (Swipe) işlemi bittiyse
        e.stopPropagation(); // Tıklamanın alt elementlere gitmesini engelle

        if (currentX > 280) {
          kart.style.transition = "transform 0.3s ease";
          kart.style.transform = `translateX(100%)`;

          setTimeout(() => {
            if (type === "vize") dersiSil(id);
            else if (type === "devamsizlik") devSil(id);
            else if (type === "agno") agnoSil(id);
            else if (type === "program") programdanSil(id);
            else if (type === "notlar") notSil(id);
          }, 300);
        } else {
          kart.style.transform = `translateX(0)`;
        }
      }
      currentX = 0;
    };

    kart.addEventListener("touchstart", startDrag, { passive: false });
    kart.addEventListener("touchmove", onDrag, { passive: false });
    kart.addEventListener("touchend", endDrag);

    kart.addEventListener("mousedown", startDrag);
    kart.addEventListener("mousemove", onDrag);
    kart.addEventListener("mouseup", endDrag);
    kart.addEventListener("mouseleave", endDrag);
  });
};
