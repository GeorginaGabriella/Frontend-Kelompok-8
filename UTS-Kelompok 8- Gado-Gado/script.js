$(document).ready(function () {
    let activeFilter = "semua";
    let favorites = [];
    let choices = [];
    let currentMenu = null;

    // Data menu
    const menuData = {
        "Gado-Gado Surabaya": {
            image: "images/surabaya.png",
            region: "SURABAYA",
            rating: "4.8",
            description: "Sayuran segar dengan lontong, tahu, tempe, dan saus kacang yang khas. Gado-gado Surabaya menjadi salah satu variasi kuliner yang menarik untuk dikenali.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu", "🌱 Tauge"]
        },
        "Gado-Gado Sederhana": {
            image: "images/sederhana.png",
            region: "NUSANTARA",
            rating: "4.7",
            description: "Pilihan gado-gado sederhana dengan bahan yang mudah ditemukan seperti sayuran rebus, tahu, tempe, dan saus kacang.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Tahu", "🍢 Tempe"]
        },
        "Gado-Gado Fusilli": {
            image: "images/fusilli.png",
            region: "KREASI MODERN",
            rating: "4.6",
            description: "Kreasi gado-gado dengan tambahan pasta fusilli. Perpaduan kuliner tradisional dan sentuhan modern.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍝 Fusilli", "🥚 Telur"]
        },
        "Gado-Gado Malang": {
            image: "images/malang.png",
            region: "MALANG",
            rating: "4.8",
            description: "Perpaduan sayuran, tahu, tempe, dan bahan pelengkap dengan karakter khas Malang.",
            ingredients: ["🥬 Sayuran", "🍘 Tahu", "🥜 Saus Kacang", "🥚 Telur"]
        },
        "Gado-Gado Betawi": {
            image: "images/betawi.png",
            region: "BETAWI",
            rating: "4.9",
            description: "Gado-gado dengan sayuran segar, lontong, tahu, tempe, telur, dan saus kacang yang menjadi bagian dari kuliner khas Betawi.",
            ingredients: ["🥬 Sayuran", "🥚 Telur", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu"]
        },
        "Gado-Gado Ayam Cirebon": {
            image: "images/cirebon.png",
            region: "CIREBON",
            rating: "4.7",
            description: "Gado-gado dengan tambahan ayam sebagai sumber protein dan pelengkap hidangan.",
            ingredients: ["🥬 Sayuran", "🍗 Ayam", "🥜 Saus Kacang", "🥚 Telur"]
        },
        "Gado-Gado Solo": {
            image: "images/solo.png",
            region: "SOLO",
            rating: "4.8",
            description: "Hidangan sayuran dengan karakter rasa yang khas dari daerah Solo dan berbagai bahan pelengkap.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Lontong", "🍢 Tahu"]
        },
        "Gado-Gado Bangka": {
            image: "images/bangka.png",
            region: "BANGKA",
            rating: "4.6",
            description: "Variasi gado-gado dengan cita rasa daerah Bangka yang menggunakan berbagai bahan pelengkap.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🍘 Tahu", "🌱 Tauge"]
        },
        "Gado-Gado Padang": {
            image: "images/padang.png",
            region: "PADANG",
            rating: "4.7",
            description: "Perpaduan sayuran dengan karakter bumbu yang terinspirasi dari cita rasa Padang.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌶️ Bumbu", "🍘 Tahu"]
        },
        "Gado-Gado Khas Bali": {
            image: "images/bali.png",
            region: "BALI",
            rating: "4.8",
            description: "Kreasi gado-gado dengan sentuhan bahan dan cita rasa khas Bali serta berbagai komponen sayuran.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌿 Rempah", "🍘 Tahu"]
        },
        "Gado-Gado Sunda": {
            image: "images/sunda.png",
            region: "SUNDA",
            rating: "4.8",
            description: "Perpaduan sayuran segar dan bumbu kacang dengan karakter khas Sunda.",
            ingredients: ["🥬 Sayuran", "🥜 Saus Kacang", "🌿 Lalapan", "🍘 Tahu"]
        }
    };

    // Menampilkan notifikasi
    function showToast(message) {
        $("#toastMessage").text(message);
        $("#toast").addClass("show");

        setTimeout(function () {
            $("#toast").removeClass("show");
        }, 2200);
    }

    // Memperbarui jumlah favorit dan pilihan
    function updateCounters() {
        $("#favoriteCounter").text(favorites.length);
        $("#choiceCounter").text(choices.length);
        $("#profileFavorite").text(favorites.length);
        $("#profileChoice").text(choices.length);
    }

    // Memperbarui tombol favorit
    function updateFavoriteButtons() {
        $(".favorite-button").each(function () {
            let name = $(this).data("name");

            if (favorites.includes(name)) {
                $(this).addClass("active");
                $(this).text("♥");
            } else {
                $(this).removeClass("active");
                $(this).text("♡");
            }
        });
    }

    // Menampilkan daftar favorit
    function renderFavorites() {
        $("#favoriteList").empty();

        if (favorites.length === 0) {
            $("#emptyFavorite").show();
            updateCounters();
            return;
        }

        $("#emptyFavorite").hide();

        favorites.forEach(function (name) {
            let menu = menuData[name];

            if (!menu) {
                return;
            }

            let item = `
                <div class="favorite-item">
                    <img src="${menu.image}" alt="${name}">
                    <button class="remove-favorite" data-name="${name}">♥</button>
                    <div class="favorite-item-content">
                        <small>${menu.region}</small>
                        <h4>${name}</h4>
                    </div>
                </div>
            `;

            $("#favoriteList").append(item);
        });

        updateCounters();
    }

    // Menampilkan daftar pilihan
    function renderChoices() {
        $("#daftarPilihan").empty();

        if (choices.length === 0) {
            $("#pesanKosong").show();
            updateCounters();
            return;
        }

        $("#pesanKosong").hide();

        choices.forEach(function (name, index) {
            let item = `
                <li>
                    <div class="choice-name">
                        <span class="choice-number">${index + 1}</span>
                        <span>${name}</span>
                    </div>
                    <button class="hapus" data-name="${name}">Hapus</button>
                </li>
            `;

            $("#daftarPilihan").append(item);
        });

        updateCounters();
    }

    // Menjalankan pencarian dan filter
    function applyFilter() {
        let keyword = $("#cariMenu").val().toLowerCase();
        let visibleCount = 0;

        $(".menu-card").each(function () {
            let name = $(this).data("name").toLowerCase();
            let category = $(this).data("group");

            let matchSearch = name.includes(keyword);
            let matchFilter = activeFilter === "semua" || category === activeFilter;

            if (matchSearch && matchFilter) {
                $(this).fadeIn(180);
                visibleCount++;
            } else {
                $(this).hide();
            }
        });

        $("#menuCount").text(visibleCount);

        if (visibleCount === 0) {
            $("#emptySearch").show();
        } else {
            $("#emptySearch").hide();
        }
    }

    // Filter menu
    $(".filter-btn").on("click", function () {
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");

        activeFilter = $(this).data("filter");

        applyFilter();
    });

    // Pencarian menu
    $("#cariMenu").on("keyup", function () {
        if ($(this).val().length > 0) {
            $("#clearSearch").show();
        } else {
            $("#clearSearch").hide();
        }

        applyFilter();
    });

    // Menghapus pencarian
    $("#clearSearch").on("click", function () {
        $("#cariMenu").val("");
        $(this).hide();

        applyFilter();
        $("#cariMenu").focus();
    });

    // Menambah dan menghapus favorit
    $(".favorite-button").on("click", function () {
        let name = $(this).data("name");

        if (favorites.includes(name)) {
            favorites = favorites.filter(function (item) {
                return item !== name;
            });

            showToast(name + " dihapus dari favorit.");
        } else {
            favorites.push(name);
            showToast(name + " ditambahkan ke favorit.");
        }

        updateFavoriteButtons();
        renderFavorites();
    });

    // Menambahkan menu ke pilihan
    $(".add-button").on("click", function () {
        let name = $(this).data("name");

        if (choices.includes(name)) {
            showToast(name + " sudah ada di Pilihan Saya.");
            return;
        }

        choices.push(name);
        renderChoices();

        showToast(name + " ditambahkan ke Pilihan Saya.");

        $("#pilihan")[0].scrollIntoView({
            behavior: "smooth"
        });
    });

    // Menghapus menu dari pilihan
    $("#daftarPilihan").on("click", ".hapus", function () {
        let name = $(this).data("name");

        choices = choices.filter(function (item) {
            return item !== name;
        });

        renderChoices();
        showToast(name + " berhasil dihapus.");
    });

    // Menghapus favorit dari daftar
    $("#favoriteList").on("click", ".remove-favorite", function () {
        let name = $(this).data("name");

        favorites = favorites.filter(function (item) {
            return item !== name;
        });

        updateFavoriteButtons();
        renderFavorites();

        showToast(name + " dihapus dari favorit.");
    });

    // Membuka detail menu
    $(".detail-button").on("click", function () {
        let name = $(this).closest(".menu-card").find("h3").text();
        let menu = menuData[name];

        if (!menu) {
            return;
        }

        currentMenu = name;

        $("#modalImage").attr("src", menu.image);
        $("#modalImage").attr("alt", name);
        $("#modalRegion").text(menu.region);
        $("#modalTitle").text(name);
        $("#modalRating").text(menu.rating);
        $("#modalDescription").text(menu.description);

        $("#modalIngredients").empty();

        menu.ingredients.forEach(function (ingredient) {
            $("#modalIngredients").append(
                "<span>" + ingredient + "</span>"
            );
        });

        $("#detailModal").addClass("show");
        $("body").css("overflow", "hidden");
    });

    // Menutup modal detail
    $("#detailClose").on("click", function () {
        $("#detailModal").removeClass("show");
        $("body").css("overflow", "");
    });

    $("#detailModal").on("click", function (event) {
        if ($(event.target).is("#detailModal")) {
            $("#detailModal").removeClass("show");
            $("body").css("overflow", "");
        }
    });

    // Menambahkan menu dari modal
    $("#modalAdd").on("click", function () {
        if (!currentMenu) {
            return;
        }

        if (choices.includes(currentMenu)) {
            showToast(currentMenu + " sudah ada di Pilihan Saya.");
            return;
        }

        choices.push(currentMenu);
        renderChoices();

        $("#detailModal").removeClass("show");
        $("body").css("overflow", "");

        showToast(currentMenu + " ditambahkan ke Pilihan Saya.");
    });

    // Membuka profil
    $("#profileButton").on("click", function () {
        $("#profileModal").addClass("show");
        $("body").css("overflow", "hidden");
    });

    // Menutup profil
    $("#profileClose").on("click", function () {
        $("#profileModal").removeClass("show");
        $("body").css("overflow", "");
    });

    $("#profileModal").on("click", function (event) {
        if ($(event.target).is("#profileModal")) {
            $("#profileModal").removeClass("show");
            $("body").css("overflow", "");
        }
    });

    $("#profileExplore").on("click", function () {
        $("#profileModal").removeClass("show");
        $("body").css("overflow", "");
    });

    // Membuka menu mobile
    $("#menuToggle").on("click", function () {
        $("#mobileNav").toggleClass("show");
    });

    $(".mobile-nav a").on("click", function () {
        $("#mobileNav").removeClass("show");
    });

    // Menandai navigasi sesuai posisi halaman
    $(window).on("scroll", function () {
        let currentPosition = $(window).scrollTop();

        $("section[id]").each(function () {
            let sectionTop = $(this).offset().top - 120;
            let sectionBottom = sectionTop + $(this).outerHeight();
            let sectionId = $(this).attr("id");

            if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
                $(".nav-link").removeClass("active");
                $('.nav-link[href="#' + sectionId + '"]').addClass("active");
            }
        });
    });

    renderChoices();
    renderFavorites();
    updateFavoriteButtons();
    updateCounters();
    applyFilter();
});