/**
 * GANSU Accounting System
 * Dashboard Slide Deck
 */

const DashboardDeck = (() => {

    let currentSlide = 0;

    let slides = [];

    let indicators = [];

    const previousButton =
        document.getElementById("dashboardPrevious");

    const nextButton =
        document.getElementById("dashboardNext");

    const indicatorContainer =
        document.getElementById("dashboardIndicators");


    function createIndicators() {

        if (!indicatorContainer) {
            return;
        }

        indicatorContainer.innerHTML = "";

        indicators = [];

        slides.forEach((slide, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "dashboard-slide-indicator";

            button.setAttribute(
                "aria-label",
                `Go to dashboard slide ${index + 1}`
            );

            button.addEventListener(
                "click",
                () => {
                    showSlide(index);
                }
            );

            indicatorContainer.appendChild(button);

            indicators.push(button);

        });

    }


    function updateNavigation() {

        if (previousButton) {

            previousButton.disabled =
                currentSlide === 0;

        }

        if (nextButton) {

            nextButton.disabled =
                currentSlide === slides.length - 1;

        }


        indicators.forEach(
            (indicator, index) => {

                indicator.classList.toggle(
                    "active",
                    index === currentSlide
                );

            }
        );

    }


    function showSlide(index) {

        if (
            index < 0 ||
            index >= slides.length
        ) {
            return;
        }


        slides.forEach(
            slide => {
                slide.classList.remove("active");
            }
        );


        slides[index].classList.add("active");

        currentSlide = index;

        updateNavigation();

    }


    function next() {

        if (
            currentSlide <
            slides.length - 1
        ) {

            showSlide(
                currentSlide + 1
            );

        }

    }


    function previous() {

        if (currentSlide > 0) {

            showSlide(
                currentSlide - 1
            );

        }

    }


    function initialize() {

        slides =
            Array.from(
                document.querySelectorAll(
                    ".dashboard-slide"
                )
            );


        if (!slides.length) {
            return;
        }


        createIndicators();


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                previous
            );

        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                next
            );

        }


        showSlide(0);

    }


    return {
        initialize,
        next,
        previous,
        showSlide
    };

})();


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        DashboardDeck.initialize
    );

} else {

    DashboardDeck.initialize();

}