$(document).ready(function () {
    let activeFilter = "semua";
    let favorites = [];
    let choices = [];
    let currentMenu = null;

    function loadSavedNames(key) {
        try {
            const savedNames = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(savedNames) ? savedNames : [];
        } catch (error) {
            return [];
        }
    }

    favorites = loadSavedNames("gadoGadoFavorites");
    choices = loadSavedNames("gadoGadoChoices");

    function persistUserLists() {
        localStorage.setItem("gadoGadoFavorites", JSON.stringify(favorites));
        localStorage.setItem("gadoGadoChoices", JSON.stringify(choices));
    }

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

    const menuMarketData = {
        "Gado-Gado Surabaya": { price: "Rp 15.000–25.000", location: "Surabaya, Jawa Timur", condiments: "Bumbu kacang, bawang putih, cabai, petis, jeruk limau", benefits: "Sayuran menyediakan serat; kacang dan tahu menyumbang protein nabati." },
        "Gado-Gado Sederhana": { price: "Rp 12.000–20.000", location: "Jakarta dan kota-kota Indonesia", condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa", benefits: "Sayuran beragam memberi serat dan mikronutrien; tahu atau tempe menambah protein nabati." },
        "Gado-Gado Fusilli": { price: "Rp 20.000–32.000", location: "Kawasan kuliner modern di kota besar", condiments: "Bumbu kacang, bawang putih, cabai, kecap manis, jeruk limau", benefits: "Sayuran memberi serat, sementara fusilli menjadi sumber energi dari karbohidrat." },
        "Gado-Gado Malang": { price: "Rp 15.000–25.000", location: "Malang, Jawa Timur", condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa", benefits: "Sayuran menyumbang serat dan tahu atau tempe menyediakan protein nabati." },
        "Gado-Gado Betawi": { price: "Rp 18.000–30.000", location: "Pasar Santa dan kawasan kuliner Jakarta", condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa", benefits: "Sayuran menyediakan serat; telur dan kacang menyumbang protein." },
        "Gado-Gado Ayam Cirebon": { price: "Rp 20.000–32.000", location: "Cirebon, Jawa Barat", condiments: "Bumbu kacang, bawang putih, cabai, kecap manis, jeruk limau", benefits: "Sayuran memberi serat dan ayam menjadi sumber protein hewani." },
        "Gado-Gado Solo": { price: "Rp 15.000–25.000", location: "Solo, Jawa Tengah", condiments: "Bumbu kacang, bawang putih, cabai, gula merah, air asam jawa", benefits: "Sayuran memberi serat; kacang dan tahu menyumbang protein nabati." },
        "Gado-Gado Bangka": { price: "Rp 15.000–25.000", location: "Pangkalpinang dan wilayah Bangka Belitung", condiments: "Bumbu kacang, bawang putih, cabai, gula merah, jeruk kunci", benefits: "Sayuran menyediakan serat dan kacang menjadi sumber protein nabati." },
        "Gado-Gado Padang": { price: "Rp 15.000–27.000", location: "Padang, Sumatra Barat", condiments: "Bumbu kacang, bawang putih, cabai, jeruk nipis, rempah", benefits: "Sayuran menyumbang serat; kacang dan tahu menambah protein nabati." },
        "Gado-Gado Khas Bali": { price: "Rp 18.000–30.000", location: "Denpasar dan kawasan kuliner Bali", condiments: "Bumbu kacang, bawang putih, cabai, kencur, jeruk limau", benefits: "Sayuran memberi serat dan rempah memberi karakter rasa tanpa mengubah manfaat dasarnya." },
        "Gado-Gado Sunda": { price: "Rp 15.000–25.000", location: "Bandung dan wilayah Jawa Barat", condiments: "Bumbu kacang, bawang putih, cabai, kencur, jeruk limau", benefits: "Sayuran segar memberi serat; kacang dan tahu menyumbang protein nabati." }
    };

    Object.keys(menuData).forEach(function (name) {
        Object.assign(menuData[name], menuMarketData[name]);
    });

    const defaultContent = {
        heroDescription: $(".hero-description").text().trim(),
        aboutDescription: $("#aboutDescription").text().trim()
    };
    const defaultFaqs = [
        { question: "Apa itu gado-gado?", answer: "Gado-gado adalah hidangan Indonesia berisi sayuran dan pelengkap yang disajikan dengan saus kacang." },
        { question: "Berapa kisaran harga satu porsi?", answer: "Harga bervariasi menurut daerah dan pelengkap. Lihat kisaran indikatif pada detail masing-masing menu." },
        { question: "Bagaimana mencari penjual di dekat saya?", answer: "Buka detail menu dan pilih tombol lokasi untuk melihat hasil pencarian penjual di Google Maps." }
    ];
    let savedAdminData = {};

    try {
        savedAdminData = JSON.parse(localStorage.getItem("gadoGadoAdminData") || "{}");
    } catch (error) {
        savedAdminData = {};
    }

    if (savedAdminData.menus) {
        Object.keys(savedAdminData.menus).forEach(function (name) {
            if (menuData[name]) {
                Object.assign(menuData[name], savedAdminData.menus[name]);
            }
        });
    }

    let siteContent = Object.assign({}, defaultContent, savedAdminData.content || {});
    let faqs = Array.isArray(savedAdminData.faqs) ? savedAdminData.faqs : defaultFaqs;
    let editingMenuName = Object.keys(menuData)[0];

    function persistAdminData() {
        localStorage.setItem("gadoGadoAdminData", JSON.stringify({
            menus: menuData,
            content: siteContent,
            faqs: faqs
        }));
        renderAdminDashboard();
    }

    function renderAdminDashboard() {
        $("#adminMenuCount").text(Object.keys(menuData).length);
        $("#adminChoiceCount").text(choices.length);
        $("#adminFavoriteCount").text(favorites.length);

        const choiceList = $("#adminChoiceList").empty();
        const favoriteList = $("#adminFavoriteList").empty();
        const menuList = $("#adminMenuList").empty();

        Object.keys(menuData).forEach(function (name) {
            $("<li>").text(name).appendTo(menuList);
        });

        choices.forEach(function (name) {
            $("<li>").text(name).appendTo(choiceList);
        });

        favorites.forEach(function (name) {
            $("<li>").text(name).appendTo(favoriteList);
        });

        $("#adminEmptyChoices").toggle(choices.length === 0);
        $("#adminEmptyFavorites").toggle(favorites.length === 0);
    }

    function renderFaqs() {
        const faqList = $("#faqList").empty();

        faqs.forEach(function (faq) {
            const item = $("<details>").addClass("faq-item");
            $("<summary>").text(faq.question).appendTo(item);
            $("<p>").text(faq.answer).appendTo(item);
            faqList.append(item);
        });

        const adminFaqList = $("#adminFaqList").empty();
        faqs.forEach(function (faq, index) {
            const row = $("<div>").addClass("admin-faq-row");
            const text = $("<span>").text(faq.question);
            const remove = $("<button>", { type: "button", "data-index": index, "aria-label": "Hapus FAQ" }).text("Hapus");
            row.append(text, remove);
            adminFaqList.append(row);
        });
    }

    function renderMenuCards() {
        $(".menu-card").each(function () {
            const card = $(this);
            const name = card.find("h3").text();
            const menu = menuData[name];

            if (!menu) {
                return;
            }

            card.find(".card-content > p").text(menu.description);
            const ingredients = card.find(".ingredients").empty();
            menu.ingredients.slice(0, 3).forEach(function (ingredient) {
                $("<span>").text(ingredient).appendTo(ingredients);
            });
        });
    }

    function loadAdminMenu(name) {
        const menu = menuData[name];

        if (!menu) {
            return;
        }

        editingMenuName = name;
        $("#adminMenuDescription").val(menu.description);
        $("#adminMenuPrice").val(menu.price);
        $("#adminMenuLocation").val(menu.location);
        $("#adminMenuIngredients").val(menu.ingredients.join(", "));
        $("#adminMenuCondiments").val(menu.condiments);
        $("#adminMenuBenefits").val(menu.benefits);
    }

    function applySiteContent() {
        $(".hero-description").text(siteContent.heroDescription);
        $("#aboutDescription").text(siteContent.aboutDescription);
        $("#adminHeroDescription").val(siteContent.heroDescription);
        $("#adminAboutDescription").val(siteContent.aboutDescription);
    }

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
        persistUserLists();
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
        persistUserLists();

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
        persistUserLists();
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
        persistUserLists();

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
        $("#modalPrice").text(menu.price);
        $("#modalLocation").text(menu.location);
        $("#modalLocationLink").attr("href", "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("penjual " + name + " " + menu.location));
        $("#modalCondiments").text(menu.condiments);
        $("#modalBenefits").text(menu.benefits);

        $("#modalIngredients").empty();

        menu.ingredients.forEach(function (ingredient) {
            $("<span>").text(ingredient).appendTo("#modalIngredients");
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
        persistUserLists();

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

    $("#adminOpen").on("click", function () {
        $("#adminModal").addClass("show");
        $("body").css("overflow", "hidden");
        $("#adminMenuSelect").empty();

        Object.keys(menuData).forEach(function (name) {
            $("<option>").val(name).text(name).appendTo("#adminMenuSelect");
        });

        $("#adminMenuSelect").val(editingMenuName);
        loadAdminMenu(editingMenuName);
        applySiteContent();
        renderFaqs();
        renderAdminDashboard();
    });

    function closeAdmin() {
        $("#adminModal").removeClass("show");
        $("body").css("overflow", "");
    }

    $("#adminClose").on("click", closeAdmin);
    $("#adminModal").on("click", function (event) {
        if ($(event.target).is("#adminModal")) {
            closeAdmin();
        }
    });

    $("#adminMenuSelect").on("change", function () {
        loadAdminMenu($(this).val());
    });

    $("#adminSaveContent").on("click", function () {
        siteContent.heroDescription = $("#adminHeroDescription").val().trim();
        siteContent.aboutDescription = $("#adminAboutDescription").val().trim();
        applySiteContent();
        persistAdminData();
        showToast("Konten utama berhasil disimpan.");
    });

    $("#adminSaveMenu").on("click", function () {
        const menu = menuData[editingMenuName];
        menu.description = $("#adminMenuDescription").val().trim();
        menu.price = $("#adminMenuPrice").val().trim();
        menu.location = $("#adminMenuLocation").val().trim();
        menu.ingredients = $("#adminMenuIngredients").val().split(",").map(function (item) {
            return item.trim();
        }).filter(Boolean);
        menu.condiments = $("#adminMenuCondiments").val().trim();
        menu.benefits = $("#adminMenuBenefits").val().trim();

        renderMenuCards();
        persistAdminData();
        showToast("Informasi menu berhasil disimpan.");
    });

    $("#adminAddFaq").on("click", function () {
        const question = $("#adminFaqQuestion").val().trim();
        const answer = $("#adminFaqAnswer").val().trim();

        if (!question || !answer) {
            showToast("Isi pertanyaan dan jawaban FAQ terlebih dahulu.");
            return;
        }

        faqs.push({ question: question, answer: answer });
        $("#adminFaqQuestion, #adminFaqAnswer").val("");
        renderFaqs();
        persistAdminData();
        showToast("FAQ berhasil ditambahkan.");
    });

    $("#adminFaqList").on("click", "button", function () {
        faqs.splice(Number($(this).data("index")), 1);
        renderFaqs();
        persistAdminData();
        showToast("FAQ berhasil dihapus.");
    });

    $("#adminClearChoices").on("click", function () {
        choices = [];
        renderChoices();
        persistUserLists();
        renderAdminDashboard();
        showToast("Pilihan Saya berhasil dikosongkan.");
    });

    $("#adminClearFavorites").on("click", function () {
        favorites = [];
        updateFavoriteButtons();
        renderFavorites();
        persistUserLists();
        renderAdminDashboard();
        showToast("Favorit Saya berhasil dikosongkan.");
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
    applySiteContent();
    renderMenuCards();
    renderFaqs();
    renderAdminDashboard();
    updateCounters();
    applyFilter();
});