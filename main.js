$(document).ready(function () {
    $(".review-slider").slick({
        infinite: true,
        speed: 300,
        prevArrow: $("#review-prev"),
        nextArrow: $("#review-next"),
        fade: true,
        swipe: false,
        draggable: false,
        slidesToShow: 1,
        adaptiveHeight: true
    });

    $(".review-slider").on(
        "afterChange",
        function (ignore, slick, currentSlide) {
            console.log(slick);
            $("#review-number").text("0" + (currentSlide + 1));
        }
    );

    $("#slider-1").slick({
        infinite: true,
        dots: false,
        arrows: false,
        autoplay: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "10%",
        autoplaySpeed: 3000,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3
            }
        },
           {
            breakpoint: 600,
            settings: {
                slidesToShow: 2
            }
        }]
    });

    $("#slider-2").slick({
        infinite: true,
        dots: false,
        arrows: false,
        autoplay: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "10%",
        autoplaySpeed: 4000,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3
            }
        },
           {
            breakpoint: 600,
            settings: {
                slidesToShow: 2
            }
        }]
    });

    $(".accordion div:first").addClass("active");
    $(".accordion p:not(:first)").hide();
    $(".accordion h3").click(function () {
        if (!$(this).parent().hasClass("active")) {
            $(".accordion p:visible").slideUp("fast");
            $(this).next("p").slideToggle("fast");
            $(".accordion div").removeClass("active");
            $(this).parent().toggleClass("active");
        } else {
            $(this).next("p").slideUp("fast");
            $(this).parent().removeClass("active");
        }
    });
});
