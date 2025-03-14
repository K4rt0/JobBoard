/*
Template Name: Massive
Author: GrayGrids
*/

;(function () {
    //===== Preloader
    window.addEventListener('load', function () {
        const loadingArea = document.querySelector('#loading-area')
        if (loadingArea) {
            setTimeout(() => {
                loadingArea.style.opacity = '0'
                loadingArea.style.display = 'none'
            }, 500)
        }
    })

    // Sticky Navbar and Scroll-to-top
    window.addEventListener('scroll', () => {
        const headerNavbar = document.querySelector('.navbar-area')
        const scrollPosition =
            window.pageYOffset || document.documentElement.scrollTop

        if (header_navbar) {
            const stickyOffset = headerNavbar.offsetTop

            if (window.pageYOffset > sticky) {
                headerNavbar.classList.add('sticky')
            } else {
                headerNavbar.classList.remove('sticky')
            }
        }

        // Back-to-top button
        const backToTopBtn = document.querySelector('.scroll-top')
        if (backToTopBtn) {
            if (scrollY > 50) {
                backToTopBtn.style.display = 'flex'
            } else {
                backToTopBtn.style.display = 'none'
            }
        }
    })

    // Smooth scrolling for anchor links
    document.querySelectorAll('.page-scroll').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const targetId = link.getAttribute('href')
            const targetElement = document.querySelector(targetId)

            if (targetId && targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }

            // Close navbar after click
            const navbarCollapse = document.querySelector('.collapse')
            const navbarToggler = document.querySelector('.navbar-toggler')

            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show')
            }

            if (navbarToggler && navbarToggler.classList.contains('active')) {
                navbarToggler.classList.remove('active')
            }
        })
    })

    // Navbar toggler
    const navbarToggler = document.querySelector('.navbar-toggler')
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            navbarToggler.classList.toggle('active')
        })
    }

    // WOW.js initialization
    if (typeof WOW !== 'undefined') {
        new WOW().init()
    }
})()
