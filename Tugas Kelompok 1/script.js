const buah = document.querySelectorAll(".buah");
const areaKiri = document.getElementById("areaKiri");
const areaKanan = document.getElementById("areaKanan");
const beratKiriElement = document.getElementById("beratKiri");
const beratKananElement = document.getElementById("beratKanan");
const statusEmoji = document.getElementById("statusEmoji");
const statusText = document.getElementById("statusText");
const selisihElement = document.getElementById("selisih");
const inputBerat = document.getElementById("inputBerat");
const tambahKiri = document.getElementById("tambahKiri");
const tambahKanan = document.getElementById("tambahKanan");
const resetBtn = document.getElementById("resetBtn");
const batang = document.getElementById("batang");

let beratKiri = 0;
let beratKanan = 0;

buah.forEach(function(item) {
    item.addEventListener("dragstart", function(event) {
        const berat = item.getAttribute("data-berat");
        const emoji = item.querySelector(".buah-emoji").textContent;

        event.dataTransfer.setData("berat", berat);
        event.dataTransfer.setData("emoji", emoji);
    });
});

function aktifkanDrop(area) {
    area.addEventListener("dragover", function(event) {
        event.preventDefault();
        area.classList.add("drag-over");
    });

    area.addEventListener("dragleave", function() {
        area.classList.remove("drag-over");
    });

    area.addEventListener("drop", function(event) {
        event.preventDefault();
        area.classList.remove("drag-over");

        const berat = Number(event.dataTransfer.getData("berat"));
        const emoji = event.dataTransfer.getData("emoji");

        if (berat > 0) {
            if (area === areaKiri) {
                beratKiri = beratKiri + berat;
            } else {
                beratKanan = beratKanan + berat;
            }

            tampilkanBuah(area, emoji);
            tampilkanHasil();
        }
    });
}

aktifkanDrop(areaKiri);
aktifkanDrop(areaKanan);

function tampilkanBuah(area, emoji) {
    const tulisan = area.querySelector(".drop-text");

    if (tulisan) {
        tulisan.remove();
    }

    const buahBaru = document.createElement("span");
    buahBaru.textContent = emoji;
    buahBaru.classList.add("buah-masuk");
    area.appendChild(buahBaru);
}

function tampilkanHasil() {
    beratKiriElement.textContent = beratKiri;
    beratKananElement.textContent = beratKanan;

    const selisih = Math.abs(beratKiri - beratKanan);
    selisihElement.textContent = selisih;

    if (beratKiri === beratKanan) {
        statusEmoji.textContent = "⚖️";
        statusText.textContent = "Timbangan seimbang";
        batang.style.transform = "rotate(0deg)";
    } else if (beratKiri > beratKanan) {
        statusEmoji.textContent = "⬅️";
        statusText.textContent = "Sisi kiri lebih berat";
        batang.style.transform = "rotate(-8deg)";
    } else {
        statusEmoji.textContent = "➡️";
        statusText.textContent = "Sisi kanan lebih berat";
        batang.style.transform = "rotate(8deg)";
    }
}

tambahKiri.addEventListener("click", function() {
    const berat = Number(inputBerat.value);

    if (berat <= 0) {
        alert("Masukkan berat terlebih dahulu.");
    } else {
        beratKiri = beratKiri + berat;
        tampilkanBuah(areaKiri, "📦");
        inputBerat.value = "";
        tampilkanHasil();
    }
});

tambahKanan.addEventListener("click", function() {
    const berat = Number(inputBerat.value);

    if (berat <= 0) {
        alert("Masukkan berat terlebih dahulu.");
    } else {
        beratKanan = beratKanan + berat;
        tampilkanBuah(areaKanan, "📦");
        inputBerat.value = "";
        tampilkanHasil();
    }
});

resetBtn.addEventListener("click", function() {
    beratKiri = 0;
    beratKanan = 0;

    areaKiri.innerHTML = '<span class="drop-text">Tarik buah ke sini</span>';
    areaKanan.innerHTML = '<span class="drop-text">Tarik buah ke sini</span>';

    inputBerat.value = "";
    tampilkanHasil();
});
