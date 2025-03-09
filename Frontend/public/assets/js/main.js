/*
Template Name: Massive
Author: GrayGrids
*/

(function () {
    // Chỉ chạy script nếu là trang client (HomePage hoặc JobDetailPage)
    if (window.location.pathname === '/' || window.location.pathname.startsWith('/job')) {
        //===== Prealoder
        window.onload = function () {
            window.setTimeout(fadeout, 500);
        };

        function fadeout() {
            const loadingArea = document.querySelector('#loading-area');
            if (loadingArea) {
                loadingArea.style.opacity = '0';
                loadingArea.style.display = 'none';
            } else {
                console.warn('Element #loading-area not found, skipping fadeout');
            }
        }

        /*=====================================
        Sticky
        ======================================= */
        window.onscroll = function () {
            var header_navbar = document.querySelector(".navbar-area");
            if (header_navbar) {
                var sticky = header_navbar.offsetTop;
                if (window.pageYOffset > sticky) {
                    header_navbar.classList.add("sticky");
                } else {
                    header_navbar.classList.remove("sticky");
                }
            } else {
                console.warn('Element .navbar-area not found');
            }

            // show or hide the back-to-top button
            var backToTo = document.querySelector(".scroll-top");
            if (backToTo) {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    backToTo.style.display = "flex";
                } else {
                    backToTo.style.display = "none";
                }
            } else {
                console.warn('Element .scroll-top not found');
            }
        };

        // for menu scroll 
        var pageLink = document.querySelectorAll('.page-scroll');
        if (pageLink.length > 0) {
            pageLink.forEach(elem => {
                elem.addEventListener('click', e => {
                    e.preventDefault();
                    const target = document.querySelector(elem.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            offsetTop: 1 - 60,
                        });
                    } else {
                        console.warn(`Target ${elem.getAttribute('href')} not found`);
                    }
                });
            });
        } else {
            console.warn('No elements with class .page-scroll found');
        }

        //===== close navbar-collapse when a clicked
        let navbarToggler = document.querySelector(".navbar-toggler");
        var navbarCollapse = document.querySelector(".collapse");

        if (navbarToggler && navbarCollapse) {
            document.querySelectorAll(".page-scroll").forEach(e =>
                e.addEventListener("click", () => {
                    navbarToggler.classList.remove("active");
                    navbarCollapse.classList.remove('show');
                })
            );

            navbarToggler.addEventListener('click', function () {
                navbarToggler.classList.toggle("active");
            });
        } else {
            console.warn('Navbar toggler or collapse element not found');
        }

        // WOW active
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        } else {
            console.warn('WOW.js not loaded');
        }
    } else {
        console.log('Skipping client-specific scripts on this page:', window.location.pathname);
    }
})();