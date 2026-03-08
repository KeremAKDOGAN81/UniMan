// --- UNIMAN SPA (Single Page Application) MİMARİSİ ---
document.addEventListener("DOMContentLoaded", () => {
  // Sayfa yüklendiğinde tüm sistemleri bir kez başlat
  hesaplayiciOlaylariniBaslat();
  devamsizlikOlaylariniBaslat();
});

function modulYukle(modulAdi) {
  // Önce her yeri gizle
  document.getElementById("gorunum-ana-sayfa").classList.add("gizli");
  document.getElementById("modul-not-hesaplayici").classList.add("gizli");
  document.getElementById("modul-devamsizlik").classList.add("gizli");

  // Sadece istenen modülü göster
  document.getElementById(`modul-${modulAdi}`).classList.remove("gizli");
}

function anaSayfayaDon() {
  document.getElementById("modul-not-hesaplayici").classList.add("gizli");
  document.getElementById("modul-devamsizlik").classList.add("gizli");
  document.getElementById("gorunum-ana-sayfa").classList.remove("gizli");
}

// --- NOT HESAPLAYICI FONKSİYONLARI ---
function hesaplayiciOlaylariniBaslat() {
  const inptDersAdi = document.getElementById("ders-adi");
  const inptGecmeNotu = document.getElementById("gecme-notu");
  const inptVizeNotu = document.getElementById("vize-notu");
  const inptVizeYuzdesi = document.getElementById("vize-yuzdesi");
  const btnEtkinlikEkle = document.getElementById("btn-etkinlik-ekle");
  const etkinliklerKapsayici = document.getElementById("etkinlikler-kapsayici");
  const btnHesapla = document.getElementById("btn-hesapla");
  const kutuSonuc = document.getElementById("sonuc-alani");

  kayitliDersleriYukle();

  btnEtkinlikEkle.addEventListener("click", () => {
    const yeniSatir = document.createElement("div");
    yeniSatir.className = "etkinlik-satiri ek-etkinlik";
    yeniSatir.style.cssText = "display: flex; align-items: flex-end; gap: 10px; margin-bottom: 15px;";
    yeniSatir.innerHTML = `
      <button type="button" class="btn-etkinlik-sil" style="background-color: #ff4c4c; color: #fff; border: none; border-radius: 8px; width: 42px; height: 42px; font-size: 1.5rem; font-weight: bold; cursor: pointer; flex-shrink: 0; margin-bottom: 2px;">-</button>
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

  btnHesapla.addEventListener("click", () => {
    let dersAdi = inptDersAdi.value.trim() || "İsimsiz Ders";
    const gecmeNotu = parseFloat(inptGecmeNotu.value) || 60;
    const vizeNotu = parseFloat(inptVizeNotu.value) || 0;
    const vizeYuzdesi = parseFloat(inptVizeYuzdesi.value) || 0;

    let toplamYilIciPuan = vizeNotu * (vizeYuzdesi / 100);
    let toplamYilIciYuzde = vizeYuzdesi;

    document.querySelectorAll(".etkinlik-satiri").forEach((satir) => {
      const not = parseFloat(satir.querySelector(".etkinlik-notu").value) || 0;
      const yuzde = parseFloat(satir.querySelector(".etkinlik-yuzdesi").value) || 0;
      toplamYilIciPuan += not * (yuzde / 100);
      toplamYilIciYuzde += yuzde;
    });

    const finalYuzdesi = 100 - toplamYilIciYuzde;
    if (finalYuzdesi <= 0) {
      kutuSonuc.innerHTML =
        "Dostum, girdiğin yüzdelerin toplamı 100'ü buldu veya geçti! Yüzdelerini kontrol et.";
      kutuSonuc.classList.remove("gizli");
      kutuSonuc.style.borderLeftColor = "#ff4c4c";
      return;
    }

    let gerekliFinal = Math.ceil((gecmeNotu - toplamYilIciPuan) / (finalYuzdesi / 100));
    kutuSonuc.classList.remove("gizli");

    if (gerekliFinal > 100) {
      kutuSonuc.innerHTML = `<strong>Kritik Durum:</strong> Puanın <strong>${toplamYilIciPuan.toFixed(1)}</strong>. Geçmek için finalden ${gerekliFinal} alman gerekiyor. UniMan bile zor kurtarır! 🦸‍♂️`;
      kutuSonuc.style.borderLeftColor = "#ff4c4c";
    } else if (gerekliFinal <= 0) {
      kutuSonuc.innerHTML = `<strong>Rahat Ol:</strong> Puanın <strong>${toplamYilIciPuan.toFixed(1)}</strong>. Sadece adını yazsan geçiyorsun! 🎉`;
      kutuSonuc.style.borderLeftColor = "#4caf50";
      gerekliFinal = 0;
    } else {
      let renkTonu = Math.max(0, Math.min(120, 120 - (gerekliFinal / 100) * 120));
      let dinamikRenk = `hsl(${renkTonu}, 100%, 50%)`;
      kutuSonuc.innerHTML = `<strong>Hedef Belli:</strong> Puanın <strong>${toplamYilIciPuan.toFixed(1)}</strong>. Dersi kurtarmak için finalden en az <span style="font-size: 1.5rem; color: ${dinamikRenk}; font-weight: bold;">${gerekliFinal}</span> almalısın. 🚀`;
      kutuSonuc.style.borderLeftColor = dinamikRenk;
    }

    const kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
    kaydedilenler.push({
      id: Date.now(),
      ad: dersAdi,
      vize: toplamYilIciPuan.toFixed(1),
      hedef: gerekliFinal > 100 ? "İmkansız" : gerekliFinal,
    });
    localStorage.setItem("unimanDersler", JSON.stringify(kaydedilenler));
    kayitliDersleriYukle();
    inptDersAdi.value = "";
  });
}

window.kayitliDersleriYukle = function () {
  const alan = document.getElementById("ders-listesi");
  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
  if (kaydedilenler.length === 0) {
    alan.innerHTML = '<p class="soluk-metin" style="font-size: 0.9rem;">Henüz kaydedilmiş bir ders yok.</p>';
    return;
  }
  alan.innerHTML = "";
  kaydedilenler.forEach((ders) => {
    alan.innerHTML += `
      <div class="ders-karti">
          <div class="ders-karti-bilgi">
              <h4>${ders.ad}</h4>
              <p>Yıl İçi: ${ders.vize} | Hedef: <strong>${ders.hedef}</strong></p>
          </div>
          <button class="btn-sil" onclick="dersiSil(${ders.id})">🗑️</button>
      </div>`;
  });
};

window.dersiSil = function (id) {
  let kaydedilenler = JSON.parse(localStorage.getItem("unimanDersler")) || [];
  localStorage.setItem("unimanDersler", JSON.stringify(kaydedilenler.filter((d) => d.id !== id)));
  kayitliDersleriYukle();
};

// --- DEVAMSIZLIK FONKSİYONLARI ---
function devamsizlikOlaylariniBaslat() {
  devamsizlikListesiniYukle();
  document.getElementById("btn-dev-ekle").addEventListener("click", () => {
    const ad = document.getElementById("dev-ders-adi").value.trim();
    const sinir = parseInt(document.getElementById("dev-sinir").value) || 4;
    if (!ad) return alert("Dostum önce bir ders adı girmelisin!");

    let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
    liste.push({ id: Date.now(), ad: ad, kullanilan: 0, sinir: sinir });
    localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
    devamsizlikListesiniYukle();
    document.getElementById("dev-ders-adi").value = "";
  });
}

window.devamsizlikListesiniYukle = function () {
  const alan = document.getElementById("dev-listesi");
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
  if (liste.length === 0) {
    alan.innerHTML = '<p class="soluk-metin" style="font-size: 0.9rem;">Henüz takip edilen bir ders yok.</p>';
    return;
  }
  alan.innerHTML = "";
  liste.forEach((ders) => {
    const kalan = ders.sinir - ders.kullanilan;
    let renk = "#4caf50",
      msg = "Rahatsın 😎";
    if (kalan < 0) {
      renk = "#ff4c4c";
      msg = "Dersten Kaldın 💀";
    } else if (kalan === 0) {
      renk = "#ff4c4c";
      msg = "Son Şansın! 🚨";
    } else if (kalan === 1) {
      renk = "var(--kahraman-turuncu)";
      msg = "Dikkatli Ol ⚠️";
    }

    alan.innerHTML += `
      <div class="ders-karti" style="border-left-color: ${renk};">
        <div class="ders-karti-bilgi" style="flex: 1;">
            <h4>${ders.ad}</h4>
            <p>Kullanılan: <strong style="color: ${renk}; font-size: 1.1rem;">${ders.kullanilan}</strong> / ${ders.sinir} <span style="font-size: 0.8rem; color: ${renk};">${msg}</span></p>
        </div>
        <div style="display: flex; gap: 8px;">
            <button onclick="devArtir(${ders.id})" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; width: 35px; height: 35px; cursor: pointer; font-size: 1.2rem;">+</button>
            <button onclick="devAzalt(${ders.id})" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; width: 35px; height: 35px; cursor: pointer; font-size: 1.2rem;">-</button>
            <button class="btn-sil" onclick="devSil(${ders.id})">🗑️</button>
        </div>
      </div>`;
  });
};

window.devArtir = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
  let d = liste.find((x) => x.id === id);
  if (d) {
    d.kullanilan++;
    localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
    devamsizlikListesiniYukle();
  }
};

window.devAzalt = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
  let d = liste.find((x) => x.id === id);
  if (d && d.kullanilan > 0) {
    d.kullanilan--;
    localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste));
    devamsizlikListesiniYukle();
  }
};

window.devSil = function (id) {
  let liste = JSON.parse(localStorage.getItem("unimanDevamsizlik")) || [];
  localStorage.setItem("unimanDevamsizlik", JSON.stringify(liste.filter((d) => d.id !== id)));
  devamsizlikListesiniYukle();
};
