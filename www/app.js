// =========================================================
// 🚀 UNIMAN v1.3 BETA - CORE APPLICATION ENGINE
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
  ];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });

  const hedefModul = document.getElementById(`modul-${modulAdi}`);
  if (hedefModul) hedefModul.classList.remove("gizli");
};

window.anaSayfayaDon = function () {
  const bolumler = ["modul-not-hesaplayici", "modul-devamsizlik", "modul-agno", "modul-pomodoro"];
  bolumler.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("gizli");
  });
  document.getElementById("gorunum-ana-sayfa").classList.remove("gizli");
};

// --- 🧮 NOT HESAPLAYICI MODÜLÜ (DİNAMİK RENKLİ VE ROZETLİ) ---
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

  // 🎨 DİNAMİK RENK VE DUYGUSAL MESAJ
  let mesaj = "";
  let renkKodu = "";
  let arkaPlan = "";

  if (gerekliFinal > 100) {
    mesaj = `<strong>Kritik Durum:</strong> Finalden <b>${gerekliFinal}</b> alman lazım. Mucizelere ihtiyacımız var! 🚑`;
    renkKodu = "#ef4444"; // Kırmızı
    arkaPlan = "#fef2f2";
  } else if (gerekliFinal > 75) {
    mesaj = `<strong>Zorlu Görev:</strong> Finalden en az <b>${gerekliFinal}</b> almalısın. Sıkı çalışman gerekecek! 📚`;
    renkKodu = "#f59e0b"; // Turuncu
    arkaPlan = "#fffbeb";
  } else if (gerekliFinal > 40) {
    mesaj = `<strong>Hedef:</strong> Finalden en az <b>${gerekliFinal}</b> almalısın. Rahatlıkla yapabilirsin! 💪`;
    renkKodu = "var(--primary-blue, #2563eb)"; // Mavi
    arkaPlan = "#eff6ff";
  } else if (gerekliFinal > 0) {
    mesaj = `<strong>Çok Rahat:</strong> Finalden sadece <b>${gerekliFinal}</b> alman yetiyor. Kahveni al ve rahatla! ☕`;
    renkKodu = "#22c55e"; // Yeşil
    arkaPlan = "#f0fdf4";
  } else {
    mesaj = `<strong>Geçtin Bile:</strong> Finalden <b>0</b> alsan da geçiyorsun. Kralsın! 👑`;
    renkKodu = "#10b981"; // Koyu Yeşil
    arkaPlan = "#ecfdf5";
  }

  // Sonuç Kutusunu Şekillendir
  kutuSonuc.innerHTML = mesaj;
  kutuSonuc.style.border = `2px solid ${renkKodu}`;
  kutuSonuc.style.backgroundColor = arkaPlan;
  kutuSonuc.style.color = "#0f172a";
  kutuSonuc.style.padding = "16px";
  kutuSonuc.style.borderRadius = "12px";

  // Veriyi Kaydet
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
    // Rozet (Badge) Rengini Hedefe Göre Belirle
    let rozetRengi = "#3b82f6"; // Varsayılan Mavi
    if (d.hedef > 100) rozetRengi = "#ef4444"; // İmkansız (Kırmızı)
    else if (d.hedef > 75) rozetRengi = "#f59e0b"; // Zor (Turuncu)
    else if (d.hedef <= 40) rozetRengi = "#22c55e"; // Kolay (Yeşil)

    let hedefMetni = d.hedef > 0 ? d.hedef : "Geçti";

    // Jilet Gibi Kart Tasarımı (Koyu Çerçeveli)
    htmlIcerik += `
      <div class="ders-karti" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid #1e293b; margin-bottom: 12px;">
        
        <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
          <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600;">${d.ad}</h4>
          <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">Yıl İçi Puanı: <strong style="color: #0f172a;">${d.vize}</strong></span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: ${rozetRengi}; color: #ffffff; width: 50px; height: 50px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <span style="font-size: 0.65rem; opacity: 0.9; font-weight: 600; text-transform: uppercase;">Hedef</span>
            <span style="font-size: 1.2rem; font-weight: bold; line-height: 1.1;">${hedefMetni}</span>
          </div>
          
          <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; background-color: #fef2f2; color: #ef4444; border-radius: 12px; border: none; cursor: pointer;" onclick="dersiSil(${d.id})">🗑️</button>
        
        </div>

      </div>
    `;
  });
  alan.innerHTML = htmlIcerik;
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
    // 📊 Yüzde ve Renk Hesaplama
    let yuzde = (d.kullanilan / d.sinir) * 100;
    if (yuzde > 100) yuzde = 100;

    let barRengi = "#22c55e"; // Varsayılan Yeşil
    if (yuzde >= 80) barRengi = "#ef4444"; // Tehlike Kırmızı
    else if (yuzde >= 50) barRengi = "#f59e0b"; // Uyarı Turuncu

    htmlIcerik += `
      <div class="ders-karti" style="display: flex; flex-direction: column; gap: 16px; padding: 20px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid #1e293b; align-items: flex-start !important;">
        
        <div style="width: 100%; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; text-align: left;">
          <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600; width: 100%;">${d.ad}</h4>
          <span style="font-size: 0.95rem; color: #64748b; font-weight: 500; width: 100%;">
            Kullanılan: <strong style="color: ${barRengi}; font-size: 1.05rem;">${d.kullanilan}</strong> / ${d.sinir}
          </span>
        </div>

        <div style="width: 100%; height: 8px; background-color: #f1f5f9; border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${yuzde}%; background-color: ${barRengi}; border-radius: 4px; transition: width 0.4s ease, background-color 0.4s ease;"></div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 4px;">
          
          <div style="display: flex; gap: 10px;">
            <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: bold; background-color: var(--primary-blue, #2563eb); color: #ffffff; border-radius: 12px; border: none; cursor: pointer;" onclick="devArtir(${d.id})">+</button>
            <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; background-color: #f8fafc; color: #64748b; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer;" onclick="devAzalt(${d.id})">-</button>
          </div>

          <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; background-color: #fef2f2; color: #ef4444; border-radius: 12px; border: none; cursor: pointer;" onclick="devSil(${d.id})">🗑️</button>
          
        </div>

      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
};

// --- DEVAMSIZLIK BUTON İŞLEMLERİ ---

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

  // 🎨 EFSANE RENK PALETİ (AA'dan FF'ye kızaran geçiş)
  const renkPaleti = {
    AA: "#16a34a", // Zümrüt Yeşili (Mükemmel)
    BA: "#22c55e", // Normal Yeşil (Çok İyi)
    BB: "#84cc16", // Fıstık Yeşili (İyi)
    CB: "#eab308", // Sarı (Ortalama Üstü)
    CC: "#f59e0b", // Hardal (Ortalama)
    DC: "#f97316", // Turuncu (Sınırda)
    DD: "#ea580c", // Koyu Turuncu (Tehlikeli)
    FD: "#ef4444", // Kırmızı (Kaldı)
    FF: "#dc2626", // Koyu Kırmızı (Kesin Kaldı)
  };

  liste.forEach((d) => {
    tk += d.kredi;
    tp += d.kredi * d.harfDegeri;

    // Harfe karşılık gelen rengi objeden çek, bulamazsa standart gri yap
    let rozetRengi = renkPaleti[d.harfMetni] || "#64748b";

    // Jilet Gibi Kart Tasarımı (Koyu Çerçeveli)
    htmlIcerik += `
      <div class="ders-karti" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid #1e293b; margin-bottom: 12px;">
        
        <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
          <h4 style="margin: 0; font-size: 1.15rem; color: #0f172a; font-weight: 600;">${d.ad}</h4>
          <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">AKTS: <strong style="color: #0f172a;">${d.kredi}</strong></span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: ${rozetRengi}; color: #ffffff; width: 50px; height: 50px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <span style="font-size: 0.65rem; opacity: 0.9; font-weight: 600; text-transform: uppercase;">Not</span>
            <span style="font-size: 1.2rem; font-weight: bold; line-height: 1.1;">${d.harfMetni}</span>
          </div>
          
          <button style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; background-color: #fef2f2; color: #ef4444; border-radius: 12px; border: none; cursor: pointer;" onclick="agnoSil(${d.id})">🗑️</button>
        
        </div>

      </div>
    `;
  });

  alan.innerHTML = htmlIcerik;
  sonucEkrani.innerText = (tp / tk).toFixed(2);
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

// 🔔 Süre bitiminde çalacak zil sesi
const zilSesi = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

window.pomodoroGuncelle = function () {
  const dk = Math.floor(pomoSure / 60);
  const sn = pomoSure % 60;
  document.getElementById("zaman-gostergesi").innerText = `${dk.toString().padStart(2, "0")}:${sn
    .toString()
    .padStart(2, "0")}`;

  // Yuvarlak Çemberin Erimesi
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
      zilSesi.play(); // Zil Çalar
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
