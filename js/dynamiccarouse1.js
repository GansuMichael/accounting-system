/**
 * GANSU Accounting System
 * Dashboard Carousel
 */

const DashboardCarousel = (() => {

    const CARD_GAP = 18;

    function initializeCarousel(carousel) {

        const track =
            carousel.querySelector(".dashboard-cards");

        const previousButton =
            carousel.querySelector(
                ".dashboard-carousel-prev"
            );

        const nextButton =
            carousel.querySelector(
                ".dashboard-carousel-next"
            );

        if (!track || !previousButton || !nextButton) {
            return;
        }

        function getScrollAmount() {

            const card =
                track.querySelector(".dashboard-card");

            if (!card) {
                return 250;
            }

            return card.offsetWidth + CARD_GAP;
        }

        function updateButtons() {

            const maxScroll =
                track.scrollWidth - track.clientWidth;

            previousButton.disabled =
                track.scrollLeft <= 1;

            nextButton.disabled =
                track.scrollLeft >= maxScroll - 1;
        }

        previousButton.addEventListener(
            "click",
            () => {

                track.scrollBy({
                    left: -getScrollAmount(),
                    behavior: "smooth"
                });

            }
        );

        nextButton.addEventListener(
            "click",
            () => {

                track.scrollBy({
                    left: getScrollAmount(),
                    behavior: "smooth"
                });

            }
        );

        track.addEventListener(
            "scroll",
            updateButtons
        );

        window.addEventListener(
            "resize",
            updateButtons
        );

        updateButtons();
    }


    function initialize() {

        const carousels =
            document.querySelectorAll(
                ".dashboard-carousel"
            );

        carousels.forEach(
            initializeCarousel
        );
    }


    return {
        initialize
    };

})();


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        DashboardCarousel.initialize
    );

} else {

    DashboardCarousel.initialize();

}