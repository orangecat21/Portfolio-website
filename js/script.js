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

    //Настройка маски ввода номера телефона
    const phoneInput = document.querySelector('#phone');
    phoneInput.addEventListener('keydown', function(event){
        if( !(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) { 
            event.preventDefault();
        }
        const mask = '+7 (111) 111-11-11';

        let currentString = this.value;
        let currentLength = currentString.length;
        if (/[0-9]/.test(event.key)) {
            if (mask[currentLength] == '1') {
                this.value = currentString + event.key;
            } else {
                for (var i=currentLength; i<mask.length; i++) {
                if (mask[i] == '1') {
                    this.value = currentString + event.key;
                    break;
                }
                currentString += mask[i];
                }
            }
        }
    });


    //Настройка отключения скролла
    const keys = {
        32: true,
        33: true,
        34: true,
        35: true,
        36: true,
        37: true,
        38: true,
        39: true,
        40: true,
    };

    const disableDefault = (e = window.event) => {
        e.preventDefault && e.preventDefault();
        e.returnValue = false;
    };

    const disableDefaultKeys = (e) => {
        keys[e.keyCode] && disableDefault(e);
    };

    const disableScroll = () => {
        document.body.classList.add('fixed')
        window.onwheel = disableDefault;
        window.onmousewheel = document.onmousewheel = disableDefault;
        window.ontouchmove  = disableDefault;
        document.onkeydown  = disableDefaultKeys;
    };

    const enableScroll = () => {
        document.body.classList.remove('fixed')
        window.onwheel = null;
        window.onmousewheel = document.onmousewheel = null;
        window.ontouchmove  = null;
        document.onkeydown  = null;
    };


    //Функция открывающая popup
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    const loader = document.querySelector('.loader');

    const openPopup = () => {
        disableScroll();
        popup.classList.remove('invisible');
        overlay.classList.remove('invisible');
        setTimeout(() => {
            popup.classList.add('op1');
            overlay.classList.add('op08');
        }, 100);
        
    }

    //Функция, закрывающая popup
    const closePopup = () => {
        enableScroll();
        popup.classList.remove('op1');
        overlay.classList.remove('op08');
        setTimeout(() => {
            popup.classList.add('invisible');
            overlay.classList.add('invisible');
        }, 500);
    }

    //Функция открытия loader`a
    const openLoader = () => {
        loader.classList.remove('invisible');
        setTimeout(() => {
            loader.classList.add('op1');
        }, 100);
    }

    //Функция закрытия loader
    const closeLoader = () => {
        loader.classList.remove('op1');
        setTimeout(() => {
            loader.classList.add('invisible');
        }, 500);
    }


    //Обработка кликов на кнопки
    const orderBtn = document.querySelectorAll('.order-btn');
    for (const btn of orderBtn) {
        btn.addEventListener('click', openPopup);
    }

    const closeBtn = document.querySelector('.popup__close-btn');
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    //Обработка события submit
    const form = document.orderCall;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.phone.classList.remove('red-border');
        const phone = form.phone.value;
        if (phone.length < 18) {
            form.phone.classList.add('red-border');
            return false;
        }
        openLoader();
        const formData = new FormData(form);
        fetch(form.action, { method: 'POST', body: formData })
            .then(response => {
                closeLoader();
                if (response.status == 200) {
                    sendSuccesed();
                } else {
                    sendFailed(response.statusText);
                }
            })
            .catch(error => {
                sendFailed(error);
            });
    });

    //Обработка успешной отправки
    const sendSuccesed = () => {
        popup.innerHTML = `<div class="success">
                                <div class="success__check-mark">
                                <span class="success__check-dash"></span>
                                </div>
                                <h3 class="success__title">Заявка успешно отправлена</h3>
                            </div>`;
        setTimeout(closePopup, 2000);
    }


    //Обработка ошибки отправки
    const sendFailed = (error) => {
        const popupTitle = document.querySelector('.popup__title');
        popupTitle.insertAdjacentHTML('afterend', `<p class="popup__error">Ой, кажется что-то пошло не так, попробуйте ещё раз</p>`);
        console.error(error);
        const errorMessage = document.querySelector('.popup__error');
        setTimeout(() => {
            errorMessage.remove();
        },2000)
    }

});