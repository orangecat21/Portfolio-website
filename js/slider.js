$(document).ready(function(){
    
    //Инициализация слайдера
    $('.examples__wrapper').slick({
        infinite: true,
        variableWidth: true,
        nextArrow: '<button type="button" class="slick-next"><div class="arrow arrow-next"></div></button>',
        prevArrow: '<button type="button" class="slick-prev"><div class="arrow arrow-prev"></div></button>',

        responsive: [{
            breakpoint: 1025,
            settings: {
                slidesToShow: 2,
                arrows: false,
                dots: true
            }
        }]
    });
});