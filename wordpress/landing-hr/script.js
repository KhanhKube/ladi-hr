(function () {
    "use strict";

    // --- Header shadow on scroll ---
    var header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 10) header.classList.add("scrolled");
            else header.classList.remove("scrolled");
        });
    }

    // --- Mobile nav toggle ---
    var navToggle = document.getElementById("navToggle");
    var nav = document.getElementById("nav");
    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            nav.classList.toggle("open");
            navToggle.classList.toggle("open");
        });
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("open");
                navToggle.classList.remove("open");
            });
        });
    }

    // --- Scroll reveal animation ---
    var revealEls = document.querySelectorAll(
        ".problem-card, .benefit-card, .why-card, .job-card, .testi-card, .visa-card, .industry-card, .news-card, .condition-card, .section-head, .register-copy, .register-form, .conditions-head, .conditions-panel, .program-media, .program-text, .why-media, .visa-block"
    );
    revealEls.forEach(function (el) { el.classList.add("reveal"); });

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    // --- Image carousel (auto slide) ---
    document.querySelectorAll(".carousel").forEach(function (carousel) {
        var track = carousel.querySelector(".carousel-track");
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-slide"));
        var dotsWrap = carousel.querySelector(".carousel-dots");
        var prevBtn = carousel.querySelector(".carousel-btn.prev");
        var nextBtn = carousel.querySelector(".carousel-btn.next");
        var index = 0;
        var timer = null;
        if (!track || slides.length < 1) return;

        var dots = [];
        if (dotsWrap) {
            slides.forEach(function (_, i) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "Ảnh " + (i + 1));
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", function () { go(i); restart(); });
                dotsWrap.appendChild(dot);
                dots.push(dot);
            });
        }

        function go(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = "translateX(" + (-index * 100) + "%)";
            dots.forEach(function (d, di) { d.classList.toggle("active", di === index); });
        }
        function nextSlide() { go(index + 1); }
        function restart() {
            if (slides.length < 2) return;
            clearInterval(timer);
            timer = setInterval(nextSlide, 4000);
        }

        if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); restart(); });
        if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); restart(); });
        carousel.addEventListener("mouseenter", function () { clearInterval(timer); });
        carousel.addEventListener("mouseleave", restart);

        if (slides.length < 2) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
        }
        restart();
    });

    // --- Horizontal auto carousels (industry 4, testimonials 3) ---
    function initHCarousel(rootId, cardSel, trackSel, prevSel, nextSel, gap, getVisible) {
        var root = document.getElementById(rootId);
        if (!root) return;
        var track = root.querySelector(trackSel);
        var cards = Array.prototype.slice.call(root.querySelectorAll(cardSel));
        var prevBtn = root.querySelector(prevSel);
        var nextBtn = root.querySelector(nextSel);
        if (!track || cards.length < 1) return;

        var index = 0;
        var timer = null;

        function maxIndex() {
            return Math.max(0, cards.length - getVisible());
        }

        function go(i) {
            var max = maxIndex();
            index = ((i % (max + 1)) + (max + 1)) % (max + 1);
            // Đo khoảng thực tế giữa 2 thẻ (tránh lệch do viền/margin)
            var step = cards.length > 1
                ? (cards[1].offsetLeft - cards[0].offsetLeft)
                : (cards[0].offsetWidth + gap);
            if (!step || step < 1) step = cards[0].offsetWidth + gap;
            track.style.transform = "translateX(" + (-index * step) + "px)";
        }

        function next() {
            var max = maxIndex();
            go(index >= max ? 0 : index + 1);
        }

        function prev() {
            var max = maxIndex();
            go(index <= 0 ? max : index - 1);
        }

        function restart() {
            clearInterval(timer);
            if (cards.length <= getVisible()) return;
            timer = setInterval(next, 3000);
        }

        if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
        if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
        root.addEventListener("mouseenter", function () { clearInterval(timer); });
        root.addEventListener("mouseleave", restart);
        window.addEventListener("resize", function () { go(Math.min(index, maxIndex())); restart(); });

        // Vuốt ngang trên mobile
        var touchX = 0;
        var touchY = 0;
        root.addEventListener("touchstart", function (e) {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            touchX = e.changedTouches[0].clientX;
            touchY = e.changedTouches[0].clientY;
            clearInterval(timer);
        }, { passive: true });
        root.addEventListener("touchend", function (e) {
            if (!e.changedTouches || !e.changedTouches[0]) return;
            var dx = e.changedTouches[0].clientX - touchX;
            var dy = e.changedTouches[0].clientY - touchY;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) next();
                else prev();
            }
            restart();
        }, { passive: true });

        go(0);
        restart();
    }

    initHCarousel(
        "industryCarousel",
        ".industry-card",
        ".industry-track",
        ".industry-nav.prev",
        ".industry-nav.next",
        20,
        function () {
            if (window.innerWidth <= 720) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 4;
        }
    );

    initHCarousel(
        "jobsCarousel",
        ".job-card",
        ".jobs-track",
        ".jobs-nav.prev",
        ".jobs-nav.next",
        14,
        function () {
            if (window.innerWidth <= 720) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }
    );

    initHCarousel(
        "testiCarousel",
        ".testi-card",
        ".testi-track",
        ".testi-nav.prev",
        ".testi-nav.next",
        10,
        function () {
            if (window.innerWidth <= 720) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }
    );

    function initNewsCarousel() {
        initHCarousel(
            "newsCarousel",
            ".news-card",
            ".news-track",
            ".news-nav.prev",
            ".news-nav.next",
            20,
            function () {
                if (window.innerWidth <= 720) return 1;
                if (window.innerWidth <= 1024) return 2;
                return 4;
            }
        );
    }

    // --- Activity image gallery ---
    (function initActivityGallery() {
        var root = document.getElementById("activityGallery");
        if (!root) return;
        var thumbsWrap = root.querySelector(".media-thumbs");
        var thumbs = Array.prototype.slice.call(root.querySelectorAll(".media-thumb"));
        var mainImg = document.getElementById("activityMain");
        var prevBtn = root.querySelector(".media-nav.prev");
        var nextBtn = root.querySelector(".media-nav.next");
        var index = 0;

        function show(i) {
            if (!thumbs.length || !mainImg) return;
            index = ((i % thumbs.length) + thumbs.length) % thumbs.length;
            thumbs.forEach(function (t, n) {
                t.classList.toggle("active", n === index);
            });
            var src = thumbs[index].getAttribute("data-src");
            if (src) mainImg.src = src;
            if (thumbsWrap) {
                var t = thumbs[index];
                var left = t.offsetLeft - (thumbsWrap.clientWidth - t.offsetWidth) / 2;
                thumbsWrap.scrollLeft = Math.max(0, left);
            }
        }

        thumbs.forEach(function (t, n) {
            t.addEventListener("click", function () { show(n); });
        });
        if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
        if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });
        show(0);
    })();

    // --- YouTube video gallery ---
    (function initVideoGallery() {
        var root = document.getElementById("videoGallery");
        if (!root) return;
        var thumbsWrap = root.querySelector(".media-thumbs");
        var thumbs = Array.prototype.slice.call(root.querySelectorAll(".media-thumb"));
        var iframe = document.getElementById("videoMain");
        var prevBtn = root.querySelector(".media-nav.prev");
        var nextBtn = root.querySelector(".media-nav.next");
        var index = 0;

        function show(i) {
            if (!thumbs.length || !iframe) return;
            index = ((i % thumbs.length) + thumbs.length) % thumbs.length;
            thumbs.forEach(function (t, n) {
                t.classList.toggle("active", n === index);
            });
            var id = thumbs[index].getAttribute("data-video");
            if (id) iframe.src = "https://www.youtube.com/embed/" + id;
            if (thumbsWrap) {
                var t = thumbs[index];
                var left = t.offsetLeft - (thumbsWrap.clientWidth - t.offsetWidth) / 2;
                thumbsWrap.scrollLeft = Math.max(0, left);
            }
        }

        thumbs.forEach(function (t, n) {
            t.addEventListener("click", function () { show(n); });
        });
        if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
        if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });
    })();

    // --- Registration form (demo tĩnh; WordPress dùng Ninja Form id=2) ---
    var form = document.getElementById("registerForm");
    var note = document.getElementById("formNote");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            note.textContent = "";
            note.className = "form-note";

            var name = form.fullname;
            var email = form.email;
            var phone = form.phone;
            var address = form.address;
            var valid = true;

            [name, email, phone, address].forEach(function (f) { f.classList.remove("invalid"); });

            if (!name.value.trim()) { name.classList.add("invalid"); valid = false; }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.classList.add("invalid");
                valid = false;
            }

            var phoneClean = phone.value.replace(/[\s.\-()]/g, "");
            if (!/^(0|\+84)\d{9,10}$/.test(phoneClean)) {
                phone.classList.add("invalid");
                valid = false;
            }

            if (!address.value.trim()) { address.classList.add("invalid"); valid = false; }

            if (!valid) {
                note.textContent = "Vui lòng nhập đầy đủ Họ và tên, Email, Số điện thoại và Địa chỉ hợp lệ.";
                note.classList.add("error");
                return;
            }

            note.textContent = "Cảm ơn " + name.value.trim() + "! HR Global sẽ liên hệ tư vấn cho bạn trong thời gian sớm nhất.";
            note.classList.add("success");
            form.reset();
        });
    }

    // --- News cards from WordPress REST (when available) ---
    (function loadNews() {
        var track = document.getElementById("newsTrack");
        if (!track) {
            initNewsCarousel();
            return;
        }

        var cfg = window.HR_LANDING || {};
        var api = cfg.wpApi || "https://hrglobal.vn/wp-json/wp/v2";
        var perPage = cfg.newsPerPage || 100;
        var category = cfg.newsCategory != null ? cfg.newsCategory : 3;

        function stripHtml(html) {
            var d = document.createElement("div");
            d.innerHTML = html || "";
            return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
        }

        function pickImage(post) {
            try {
                var media = post._embedded["wp:featuredmedia"][0];
                var sizes = media.media_details && media.media_details.sizes;
                if (sizes) {
                    if (sizes.medium_large) return sizes.medium_large.source_url;
                    if (sizes.large) return sizes.large.source_url;
                    if (sizes.medium) return sizes.medium.source_url;
                }
                return media.source_url || "";
            } catch (e) {
                return "";
            }
        }

        function cardHtml(post) {
            var title = stripHtml(post.title && post.title.rendered);
            var excerpt = stripHtml(post.excerpt && post.excerpt.rendered);
            if (excerpt.length > 180) excerpt = excerpt.slice(0, 177) + "...";
            var img = pickImage(post);
            var link = post.link || "#";
            var imgTag = img
                ? '<img src="' + img + '" alt="' + title.replace(/"/g, "&quot;") + '" loading="lazy" />'
                : "";
            return (
                '<a class="news-card" href="' + link + '" target="_blank" rel="noopener noreferrer">' +
                    '<div class="news-media">' +
                        imgTag +
                        '<div class="news-ribbon"><span>' + title + "</span></div>" +
                    "</div>" +
                    '<div class="news-body">' +
                        "<h3>" + title + "</h3>" +
                        "<p>" + excerpt + "</p>" +
                    "</div>" +
                "</a>"
            );
        }

        var qs = "/posts?per_page=" + perPage + "&_embed=1";
        if (category !== "" && category !== false) qs += "&categories=" + category;

        fetch(api + qs)
            .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
            .then(function (posts) {
                if (Array.isArray(posts) && posts.length) {
                    track.innerHTML = posts.map(cardHtml).join("");
                }
            })
            .catch(function () { /* keep static fallback cards */ })
            .then(function () { initNewsCarousel(); });
    })();
})();
