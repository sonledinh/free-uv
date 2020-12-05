var app = app || {};
!(function () {
    "use strict";
    app.Section = Backbone.Model.extend({
        urlRoot: "",
        defaults: { id: "", title: "", content: "" },
        parse: function (e) {
            return e;
        },
    });
})();
app = app || {};
!(function (t) {
    "use strict";
    app.Loader = Backbone.View.extend({
        el: function () {
            return document.getElementsByTagName("body")[0];
        },
        options: {},
        quoteTimer: 1e3,
        quotes: [],
        speed: 1,
        soundID: "LoaderSound",
        currentViews: {},
        events: {},
        initialize: function () {
            console.log("Preloader View Initialized"), (this.quotes = app.loaderQuotes), (this.quoteTimer = app.loaderQuotesTimer), this.setLoader();
        },
        toggleLoader: function () {
            t(".loader").toggleClass("active"), t(".noise").toggleClass("opened"), t(".cnav").show();
        },
        setLoader: function () {
            var e = this;
            new Vivus("loaderlogo", { duration: 200, dashGap: 10 }, function () {
                app.windowLoaded && ((app.windowLoaded = !1), app.core.toggleLoader(), clearInterval(e.quoteInterval)), (e.runback = !e.runback), e.runback ? this.play(-e.speed) : (this.reset(), this.play(e.speed));
            }).play(e.speed),
                e.quoteTimer &&
                    e.quotes.length &&
                    (e.quoteInterval = setInterval(function () {
                        e.displayQuote();
                    }, e.quoteTimer));
        },
        displayQuote: function () {
            var e = this.quotes.shift();
            this.quotes.push(e), t("div.loaderquote").html(e);
        },
    });
})(jQuery);
app = app || {};
!(function (i) {
    "use strict";
    app.QuotesView = Backbone.View.extend({
        el: function () {
            return document.getElementsByTagName("body")[0];
        },
        options: {},
        someVariable: !1,
        currentViews: {},
        events: { "click .bullet": "switchQuote" },
        initialize: function () {
            console.log("Quotes View Initialized"), i(this.el).find(".quote").first().addClass("active"), i(this.el).find(".bullets .bullet").first().addClass("active");
        },
        switchQuote: function (e) {
            var t = i(".bullets .bullet").index(i(e.target));
            i(this.el).find(".quote").removeClass("active"), i(this.el).find(".quote").eq(t).addClass("active"), i(this.el).find(".bullets .bullet").removeClass("active"), i(this.el).find(".bullets .bullet").eq(t).addClass("active");
        },
    });
})(jQuery); 
app = app || {};
!(function (r) {
    "use strict";
    app.CoreView = Backbone.View.extend({
        el: function () {
            return document.getElementsByTagName("body")[0];
        },
        options: {},
        canAnimate: !0,
        currentSlide: 0,
        screenratio: 1920 / 1080,
        mscreenratio: 0.5625,
        isSection: !1,
        isOther: !1,
        speed: 1.25,
        isVertical: !1,
        partnerSelected: !1,
        selectedPartner: {},
        currentViews: {},
        events: {
            "click .zt-control": "initRouter",
            "click .zt-more": "showMore",
            "click .hamburger.menu": "toggleMenu",
            "click .readmorepanel .hamburger": "hideMore",
            "click #mbars": "toggleSound",
            "click .homeindicator a": "indicatorClicked",
            "click .opensection": "showSection",
            "click .gohome": "showHome",
            "click .tabtrigger": "switchReviewTab",
            "mouseenter .slidenav": "dimmBackgrounds",
            "mouseleave .slidenav": "dimmBackgrounds",
            "click .uvnav": "uvnavClicked",
            "mouseenter .partnerboard img": "showPartnerInfo",
            "mouseleave .partnerboard img": "hidePartnerInfo",
            "click .partnerboard img": "selectPartner",
            "click .wechattoggle": "toggleWechat",
            "click div.morecross": "showreadmoremenu",
        },
        showreadmoremenu: function (e) {
            r(window).width() < 768 && (r(e.currentTarget).next().toggle(), r(e.currentTarget).next().toggleClass("readmoremenu"));
        },
        initialize: function () {
            console.log("Core View Initialized"),
                0 == r("#container").length && (this.isOther = !0),
                r(window).width() < r(window).height() && ((this.isVertical = !0), (this.screenratio = this.mscreenratio), (this.speed = 1)),
                "false" == Cookies.get("music") && r("#mbars .mbar").toggleClass("animate");
            var o = this;
            (app.loader = new app.Loader()),
                this.setIndicators(),
                this.setHomeSlides(),
                this.resizeBackgrounds(),
                this.adjustSectionNavigation(!0),
                r(window).on("load", function () {
                    app.windowLoaded = !0;
                }),
                r(window).on("resize", function () {
                    o.resizeBackgrounds();
                });
            o = this;
            r("body").on("mousewheel DOMMouseScroll", "#container", function (e) {
                if (0 < e.originalEvent.wheelDelta / 120 || 0 < e.originalEvent.detail / 3) {
                    var t = "up";
                    e.webkitDirectionInvertedFromDevice && (t = "down"), e.originalEvent.webkitDirectionInvertedFromDevice && (t = "down"), /firefox/i.test(navigator.userAgent) && (t = "down");
                } else {
                    t = "down";
                    e.webkitDirectionInvertedFromDevice && (t = "up"), e.originalEvent.webkitDirectionInvertedFromDevice && (t = "up"), /firefox/i.test(navigator.userAgent) && (t = "up");
                }
                o.wheelNavigation(t);
            }),
                r("body")
                    .find("#container")
                    .swipe({
                        swipe: function (e, t, i, n, s, a) {
                            "left" == t ? (t = "down") : "right" == t ? (t = "up") : "up" == t ? (t = "down") : "down" == t && (t = "up"), o.wheelNavigation(t);
                        },
                        swipeLeft: function (e, t, i, n, s) {},
                        swipeRight: function (e, t, i, n, s) {},
                    }),
                r("div.comment p").each(function (e) {
                    var t = r(this).find("a").text();
                    t &&
                        r(this)
                            .find("a")
                            .text(t.substring(0, 25) + "...");
                });
        },
        toggleWechat: function (e) {
            e.preventDefault(), r(".wechatqr").toggleClass("active");
        },
        uvnavClicked: function (e) {
            var t = "up";
            r(e.target).hasClass("right") && (t = "down"), r(e.target).hasClass("left") && (t = "up"), r(e.target).hasClass("down") && (t = "down"), r(e.target).hasClass("up") && (t = "up"), this.wheelNavigation(t);
        },
        setContainers: function () {
            (this.isOther = !1), 0 == r("#container").length && (r("body").prepend("<div id='container'></div>"), r("#newscontainer").remove());
        },
        resizeBackgrounds: function () {
            var e = r(window).width(),
                t = r(window).height(),
                i = e / t;
            this.screenratio < i ? r("div.innerbackground").css("background-size", e + "px " + (t * i) / this.screenratio + "px") : r("div.innerbackground").css("background-size", (e * this.screenratio) / i + "px " + t + "px");
        },
        toggleLoader: function () {
            r(".menupanel").hasClass("opened") && this.toggleMenu(), r(".loader").toggleClass("active"), r(".noise").toggleClass("opened"), r(".preloading").removeClass("preloading");
        },
        setIndicators: function () {
            this.isSection ? (r(".uvnav.landing").hide(), r(".uvnav.section").show(), r(".homeindicator").addClass("section")) : (r(".uvnav.landing").show(), r(".uvnav.section").hide(), r(".homeindicator").removeClass("section")),
                this.isOther && (r(".uvnav.landing").hide(), r(".uvnav.section").hide()),
                r(".homeindicator").empty();
            for (var e = 0; e < r(".innerbackground").length; e++) r(".homeindicator").append("<a></a>");
            r(".homeindicator a:first").toggleClass("selected");
        },
        setSectionSlides: function () {
            TweenMax.set(r(".innerbackground"), { width: "100%" }),
                TweenMax.set(r(".innerbackground"), { height: "100%" }),
                this.isSection
                    ? (TweenMax.set(r(".innerbackground"), { height: "0%" }), TweenMax.set(r(".innerbackground:first"), { height: "100%" }))
                    : (TweenMax.set(r(".innerbackground"), { width: "0%" }), TweenMax.set(r(".innerbackground:first"), { width: "100%" })),
                r(".slidenav").each(function () {
                    var e = r(this).prev().width(),
                        t = r(this).parent().find("a").width();
                    r(this).css("width", e),
                        r(this)
                            .parent()
                            .find(".line")
                            .css("width", e - t - 15);
                }),
                r(".info div.centered").each(function () {
                    var e = r(this).height() + 10;
                    r(this).css("height", e), r(this).css("overflow", "hidden");
                }),
                r(".info").each(function () {
                    r(this).css("height", "100%"), r(this).css("overflow", "hidden");
                }),
                r(".info").css("display", "none"),
                r(".info:first").css("display", "block");
        },
        setHomeSlides: function () {
            TweenMax.set(r(".innerbackground"), { width: "100%" }),
                TweenMax.set(r(".innerbackground"), { height: "100%" }),
                this.isSection
                    ? (TweenMax.set(r(".innerbackground"), { height: "0%" }), TweenMax.set(r(".innerbackground:first"), { height: "100%" }))
                    : (TweenMax.set(r(".innerbackground"), { width: "0%" }), TweenMax.set(r(".innerbackground").eq(this.currentSlide), { width: "100%" })),
                r(".slidenav").each(function () {
                    var e = r(this).prev().width(),
                        t = r(this).parent().find("a").width();
                    r(this).css("width", e),
                        r(this)
                            .parent()
                            .find(".line")
                            .css("width", e - t - 15);
                }),
                r(".info div.centered").each(function () {
                    var e = r(this).height() + 10;
                    r(this).css("height", e), r(this).css("overflow", "hidden");
                }),
                r(".info_tl,.info_tr,.info_bl,.info_br").each(function () {
                    r(this).is(":empty") && r(this).css("display", "none");
                }),
                TweenMax.set(r(".info div.centered").find("div:first").eq(this.currentSlide), { y: "140%" }),
                r(".info").css("display", "none"),
                r(".info").eq(this.currentSlide).css("display", "block"),
                TweenMax.fromTo(r(".info div.centered").find("div:first").eq(this.currentSlide), 1.5, { y: "140%" }, { y: "0%", ease: Power2.easeInOut });
        },
        adjustSectionNavigation: function (e) {
            e ? (r("a.gohome").hide(), r("a.bookings").show()) : (r("a.gohome").show(), r("a.bookings").hide());
        },
        wheelNavigation: function (e) {
            if (this.canAnimate) {
                var t = this.currentSlide + 1;
                "up" == e && (t = this.currentSlide - 1),
                    t > r(".innerbackground").length - 1 && (t = 0),
                    t < 0 && (t = r(".innerbackground").length - 1),
                    r(".homeindicator a").removeClass("selected"),
                    r(".homeindicator a").eq(t).addClass("selected"),
                    this.isSection ? this.switchBackgroundS(t) : this.switchBackground(t);
            }
        },
        indicatorClicked: function (e) {
            if ((e.preventDefault(), this.canAnimate)) {
                var t = r(".homeindicator a").index(r(e.target));
                r(".homeindicator a").removeClass("selected"), r(".homeindicator a").eq(t).addClass("selected"), this.isSection ? this.switchBackgroundS(t) : this.switchBackground(t);
            }
        },
        switchBackgroundS: function (e) {
            r(".background").removeClass("dimmed");
            if (!this.canAnimate || this.currentSlide == e) return !1;
            this.canAnimate = !1;
            r(".innerbackground").length;
            r(".innerbackground").eq(e).css("top", ""),
                r(".innerbackground").eq(e).css("bottom", ""),
                r(".innerbackground").eq(this.currentSlide).css("top", ""),
                r(".innerbackground").eq(this.currentSlide).css("bottom", ""),
                (e < this.currentSlide && 0 != e) || (e == r(".innerbackground").length - 1 && 0 == this.currentSlide) || (0 == e && 1 == this.currentSlide)
                    ? (r(".innerbackground").eq(e).css("top", "0px"), r(".innerbackground").eq(this.currentSlide).css("bottom", "0px"))
                    : (r(".innerbackground").eq(e).css("bottom", "0px"), r(".innerbackground").eq(this.currentSlide).css("top", "0px")),
                TweenMax.fromTo(r(".innerbackground").eq(this.currentSlide), this.speed, { height: "100%" }, { height: "0%", ease: Power1.easeInOut }),
                TweenMax.fromTo(r(".innerbackground").eq(e), this.speed, { height: "0%" }, { height: "100%", ease: Power1.easeInOut, onCompleteScope: this, onComplete: this.resetBackgrounds }),
                this.animateInfoS(e),
                (this.currentSlide = e);
        },
        switchBackground: function (e) {
            r(".background").removeClass("dimmed");
            if (!this.canAnimate || this.currentSlide == e) return !1;
            this.canAnimate = !1;
            r(".innerbackground").length;
            r(".innerbackground").eq(e).css("left", ""),
                r(".innerbackground").eq(e).css("right", ""),
                r(".innerbackground").eq(this.currentSlide).css("left", ""),
                r(".innerbackground").eq(this.currentSlide).css("right", ""),
                (e < this.currentSlide && 0 != e) || (e == r(".innerbackground").length - 1 && 0 == this.currentSlide) || (0 == e && 1 == this.currentSlide)
                    ? (r(".innerbackground").eq(e).css("left", "0px"), r(".innerbackground").eq(this.currentSlide).css("right", "0px"))
                    : (r(".innerbackground").eq(e).css("right", "0px"), r(".innerbackground").eq(this.currentSlide).css("left", "0px")),
                TweenMax.fromTo(r(".innerbackground").eq(this.currentSlide), this.speed, { width: "100%" }, { width: "0%", ease: Power1.easeInOut }),
                TweenMax.fromTo(r(".innerbackground").eq(e), this.speed, { width: "0%" }, { width: "100%", ease: Power1.easeInOut, onCompleteScope: this, onComplete: this.resetBackgrounds }),
                this.animateInfo(e),
                (this.currentSlide = e);
        },
        animateInfo: function (e) {
            r(".info").eq(e).css("display", "block"),
                TweenMax.fromTo(r(".info").eq(this.currentSlide).find("div.centered div:first"), 0.5, { y: "0%" }, { y: "140%", ease: Power2.easeInOut }),
                TweenMax.fromTo(r(".info").eq(e).find("div.centered div:first"), 1.5, { y: "140%" }, { delay: 0.5, y: "0%", ease: Power2.easeInOut }),
                TweenMax.fromTo(r(".info").eq(this.currentSlide).find(".info_tl,.info_tr,.info_bl,.info_br"), 0.5, { alpha: 1 }, { alpha: 0, ease: Power2.easeInOut }),
                TweenMax.fromTo(r(".info").eq(e).find(".info_tl,.info_tr,.info_bl,.info_br"), 1.5, { alpha: 0 }, { delay: 0.5, alpha: 1, ease: Power2.easeInOut });
            var t = r(".info").eq(e).find(".line").width();
            TweenMax.fromTo(r(".info").eq(e).find(".line"), 1.5, { width: "0" }, { delay: 1.5, width: t, ease: Power2.easeOut });
        },
        animateInfoS: function (e) {
            r(".info").eq(e).css("display", "block"),
                TweenMax.fromTo(r(".info").eq(this.currentSlide).find("div"), 0.5, { alpha: 1 }, { alpha: 0, ease: Power2.easeInOut }),
                TweenMax.fromTo(r(".info").eq(e).find("div"), 1.5, { alpha: 0 }, { delay: 0.5, alpha: 1, ease: Power2.easeInOut });
        },
        resetBackgrounds: function () {
            r(".info").css("display", "none"), r(".info").eq(this.currentSlide).css("display", "block"), (this.canAnimate = !0), r(".background").addClass("dimmed");
        },
        dimmBackgrounds: function () {
            r(".background").toggleClass("dimmed");
        },
        toggleSound: function (e) {
            e.preventDefault(),
                r("#mbars .mbar").toggleClass("animate"),
                r("#mbars .mbar").hasClass("animate") ? ((app.instanceMSound.muted = !1), Cookies.set("music", "true", { expires: 7 })) : ((app.instanceMSound.muted = !0), Cookies.set("music", "false", { expires: 7 }));
        },
        hideMore: function (e) {
            e.preventDefault();
            e.target.pathname;
            r(".readmorepanel").toggleClass("opened"), r("#container").toggleClass("halfclosed"), r("#mainlogo").toggleClass("halfclosed"), r(".homeindicator ").toggleClass("halfclosed");
        },
        showHome: function (e) {
            e.preventDefault(), this.isOther && this.setContainers();
            var t = e.target.getAttribute("href");
            console.log(t);
            var i = this;
            i.toggleLoader(),
                (app.modz = new app.Section({ id: "10" })),
                (app.modz.url = app.homePath + "wp-json/wp/v2/pages?filter[name]=" + t),
                app.modz.fetch({
                    success: function (e) {
                        var t = app.modz.attributes[0].slides.slide,
                            a = "<div class='background'>";
                        r.each(t, function (e) {
                            var t = this.background_image;
                            i.isVertical && (t = this.background_mobile), (a += "<div class='innerbackground section' style='background-image:url(" + t + ");'></div>");
                        }),
                            (a += "</div>"),
                            (a += "<div class='slides'>"),
                            r.each(t, function (e) {
                                var t = this.link,
                                    i = this.link.split("/");
                                i.pop();
                                var n = i.pop(),
                                    s = "opensection";
                                this.external && ((s = ""), (n = t)),
                                    (a += '<div class="info">'),
                                    (a +=
                                        '<div class="info_tl">' +
                                        this.text_top_left +
                                        '</div><div class="info_tr">' +
                                        this.text_top_right +
                                        '</div><div class="info_bl">' +
                                        this.text_bottom_left +
                                        '</div><div class="info_br">' +
                                        this.text_bottom_right +
                                        "</div>"),
                                    this.title &&
                                        (a += '<div class="centered"><div><h2>' + this.title + '</h2><div class="slidenav"><a href="' + n + '" class="' + s + '">' + this.subtitle + '</a><div class="line"></div></div></div></div>'),
                                    this.special_content && (a += '<div class="centered"><div>' + this.special_content + "</div></div>"),
                                    (a += "</div>");
                            }),
                            (a += "</div>"),
                            r("#container").html(a),
                            r("#container")
                                .imagesLoaded()
                                .always(function (e) {
                                    (i.isSection = !1), (i.currentSlide = i.homeSlide), i.setIndicators(), i.setHomeSlides(), i.resizeBackgrounds(), i.toggleLoader(), i.adjustSectionNavigation(!0);
                                })
                                .done(function (e) {})
                                .fail(function () {})
                                .progress(function (e, t) {
                                    t.isLoaded;
                                });
                    },
                });
        },
        selectPartner: function (e) {
            (this.partnerSelected = !this.partnerSelected),
                r(e.target).hasClass("selected")
                    ? (r(".partnerboard img").removeClass("selected"), r(".partnerboard img").removeClass("dimmed"), (this.partnerSlected = !1), (this.selectedPartner = {}))
                    : (r(".partnerboard img").removeClass("selected"),
                      r(".partnerboard img").removeClass("dimmed"),
                      r(".partnerboard img").addClass("dimmed"),
                      r(e.target).removeClass("dimmed"),
                      r(e.target).addClass("selected"),
                      (this.selectedPartner = r(e.target).data("partner")));
        },
        showPartnerInfo: function (e) {
            var t = r(e.target).data("partner");
            r(".partnername").html(t.name),
                r(".partnerinfo").html(t.info),
                t.ppcomment ? r(".ppcomment").html(t.ppcomment + "<br/><span class='pp'>Paul Pairet</span>") : r(".ppcomment").html(""),
                t.website ? r(".partnerwebsite").html('<a href="' + t.website + '">WWW</a>') : r(".partnerwebsite").html("");
        },
        hidePartnerInfo: function (e) {
            r(".partnername").html(this.selectedPartner.name),
                r(".partnerinfo").html(this.selectedPartner.info),
                this.selectedPartner.ppcomment ? r(".ppcomment").html(this.selectedPartner.ppcomment + "<br/><span class='pp'>Paul Pairet</span>") : r(".ppcomment").html(""),
                this.selectedPartner.website ? r(".partnerwebsite").html('<a href="' + this.selectedPartner.website + '">WWW</a>') : r(".partnerwebsite").html("");
        },
        showPartnersContent: function () {
            jQuery.ajax({
                url: app.homePath + "/partners-board/",
                type: "GET",
                dataType: "html",
                data: { param1: "value1" },
                complete: function (e, t) {},
                success: function (e, t, i) {
                    r(".partnersslide").append(e);
                },
                error: function (e, t, i) {},
            });
        },
        showSection: function (e) {
            e.preventDefault(), this.isOther && this.setContainers();
            var t = e.target.getAttribute("href"),
                a = this;
            a.toggleLoader(),
                (app.modz = new app.Section({ id: "10" })),
                (app.modz.url = app.homePath + "wp-json/wp/v2/pages?filter[name]=" + t),
                app.modz.fetch({
                    success: function (e) {
                        var t = app.modz.attributes[0].slides.slide,
                            n = "<div class='background'>";
                        r.each(t, function (e) {
                            var t = this.background_image;
                            a.isVertical && (t = this.background_mobile), (n += "<div class='innerbackground section' style='background-image:url(" + t + ");'></div>");
                        }),
                            (n += "<div class='innerbackground section'></div>"),
                            (n += "</div>"),
                            (n += "<div class='slides'>"),
                            r.each(t, function (e) {
                                var t = "",
                                    i = "";
                                this.tl_middle && (t = "vcenter"),
                                    this.tr_middle && (i = "vcenter"),
                                    (n += '<div class="info">'),
                                    (n +=
                                        '<div class="info_tl ' +
                                        t +
                                        '">' +
                                        this.text_top_left +
                                        '</div><div class="info_tr ' +
                                        i +
                                        '">' +
                                        this.text_top_right +
                                        '</div><div class="info_bl">' +
                                        this.text_bottom_left +
                                        '</div><div class="info_br">' +
                                        this.text_bottom_right +
                                        "</div>"),
                                    this.title &&
                                        this.subtitle &&
                                        (n += '<div class="centered"><div><h2>' + this.title + '</h2><div class="slidenav"><a href="#" class="section">' + this.subtitle + '</a><div class="line"></div></div></div></div>'),
                                    this.quotes.length &&
                                        ((n += '<div class="sectionquotes">'),
                                        r.each(this.quotes, function () {
                                            n += '<div class="quote"><h3>"' + this.quote + '"</h3><h4>-' + this.author + "</h4></div>";
                                        }),
                                        (n += '<div class="bullets">'),
                                        r.each(this.quotes, function () {
                                            n += '<div class="bullet"></div>';
                                        }),
                                        (n += "</div>"),
                                        (n += "</div>")),
                                    this.partners_board && (n += "<div class='partnersslide'></div>"),
                                    (n += "</div>");
                            });
                        var i = r(".slidethumbnails").html();
                        (n += '<div class="info"><div class="sectionthumbnails">' + i + "</div></div>"), (n += "</div>");
                        var s = new RegExp("<p>\x3c!--more--\x3e</p>", "g");
                        (n = n.replace(s, '<div class="morecross">MORE...</div>')),
                            r("#container").html(n),
                            r(window).width() < 768 &&
                                r("body")
                                    .find("div.morecross")
                                    .each(function (e, t) {
                                        r(this).next().hide();
                                    }),
                            r("#container")
                                .imagesLoaded()
                                .always(function (e) {
                                    a.isSection || (a.homeSlide = a.currentSlide),
                                        (a.currentSlide = 0),
                                        (a.isSection = !0),
                                        a.setIndicators(),
                                        a.setSectionSlides(),
                                        a.resizeBackgrounds(),
                                        a.toggleLoader(),
                                        a.adjustSectionNavigation(!1),
                                        setTimeout(function () {}, 1e3),
                                        r(".sectionquotes").each(function () {
                                            new app.QuotesView({ el: this });
                                        }),
                                        a.showPartnersContent();
                                })
                                .done(function (e) {})
                                .fail(function () {})
                                .progress(function (e, t) {
                                    t.isLoaded;
                                });
                    },
                });
        },
        showMore: function (e) {
            e.preventDefault();
            var t = e.target.getAttribute("href"),
                i = t.split("/");
            i.pop(),
                (t = i.pop()),
                (app.modz = new app.Section({ id: "10" })),
                (app.modz.url = app.homePath + "wp-json/wp/v2/pages?filter[name]=" + t),
                app.modz.fetch({
                    success: function (e) {
                        r(".readmoretitle").html(app.modz.attributes[0].title.rendered), r(".readmorecontent").html(app.modz.attributes[0].content.rendered);
                    },
                }),
                r("#container").toggleClass("halfclosed"),
                r("#mainlogo").toggleClass("halfclosed"),
                r(".homeindicator ").toggleClass("halfclosed"),
                r(".readmorepanel").toggleClass("opened");
        },
        initRouter: function (e) {
            (app.modz = new app.Section({ id: 7 })), app.modz.fetch({ success: function (e) {} }), e.preventDefault();
            var t = e.target.pathname;
            app.router.navigate(t, { trigger: !0 });
        },
        toggleMenu: function () {
            r(".noise").toggleClass("opened"), r(".menupanel").toggleClass("opened"), r(".hamburger.menu .bar").toggleClass("animate");
        },
        switchReviewTab: function (e) {
            e.preventDefault();
            var t = r(".tabtrigger").index(r(e.target));
            r(".tab").removeClass("active"), r(".tab").eq(t).addClass("active"), r(".reviewsnav div").removeClass("active"), r(".reviewsnav div").eq(t).addClass("active");
        },
        addAll: function () {},
        addOne: function (e) {},
    });
})(jQuery);
app = app || {};
!(function () {
    "use strict";
    var e = Backbone.Router.extend({
        routes: { "*notFound": "go", "": "go" },
        go: function (e) {
            var t = "/";
            _.isNull(e) || (t += e), console.log(t);
        },
    });
    (app.router = new e()), Backbone.history.start({ pushState: !0, silent: !0 });
})();
app = app || {};
jQuery(document).ready(function (e) {}),
    jQuery(function () {
        "use strict";
        app.core = new app.CoreView();
    });
