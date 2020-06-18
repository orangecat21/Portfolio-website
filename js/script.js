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
    const phoneInputs = [document.querySelector('#phone'), document.querySelector('#Phone')];
    for (const phoneInput of phoneInputs){
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
    }

    //Разлет тегов
    const titleFlies = document.querySelectorAll('.title__fly');
    for (const fly of titleFlies){
        fly.classList.remove('title__fly_initial')
    }

    //Плавный скролл
    const links = document.querySelectorAll('.smooth-scroll')
    for (const link of links) {
        link.addEventListener('click', e => {
            e.preventDefault();
            const destination = link.getAttribute('href');
            document.querySelector(destination).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }


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
    const popupShort = document.querySelector('.popup_short');
    const popupLong = document.querySelector('.popup_long');
    const overlay = document.querySelector('.overlay');
    const loader = document.querySelector('.loader');

    const openPopup = (popup) => {
        disableScroll();
        popup.classList.remove('invisible');
        overlay.classList.remove('invisible');
        setTimeout(() => {
            popup.classList.add('op1');
            overlay.classList.add('op08');
        }, 100);
        
    }

    //Функция, закрывающая popup
    const closePopup = (popup) => {
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
        if (btn.name == 'orderCall'){
            btn.addEventListener('click', () => {
                openPopup(popupShort);
            });
        } else {
            btn.addEventListener('click', () => {
                openPopup(popupLong);
            })
        }
    }

    const closeBtns = document.querySelectorAll('.popup__close-btn');
    for (const btn of closeBtns) {
        btn.addEventListener('click', (e) => {
            closePopup(e.target.parentNode);
        });
        overlay.addEventListener('click', () => {
            closePopup(popupShort);
            closePopup(popupLong);
        });
    }

    //Обработка события submit
    const formShort = document.orderCall;
    formShort.addEventListener('submit', (e) => {
        e.preventDefault();
        formShort.phone.classList.remove('red-border');
        const phone = formShort.phone.value;
        if (phone.length < 18) {
            formShort.phone.classList.add('red-border');
            return false;
        }
        openLoader();
        const formData = new FormData(formShort);
        fetch(formShort.action, { method: 'POST', body: formData })
            .then(response => {
                closeLoader();
                if (response.status == 200) {
                    sendSuccesed(popupShort);
                } else {
                    sendFailed(response.statusText, popupShort);
                }
            })
            .catch(error => {
                sendFailed(error, popupShort);
            });
    });

    const formLong = document.orderAdvice;
    formLong.addEventListener('submit', (e) => {
        e.preventDefault();
        formLong.phone.classList.remove('red-border');
        const phone = formLong.phone.value;
        if (phone.length < 18) {
            formLong.phone.classList.add('red-border');
            return false;
        }
        openLoader();
        const formData = new FormData(formLong);
        fetch(formLong.action, { method: 'POST', body: formData })
            .then(response => {
                closeLoader();
                if (response.status == 200) {
                    sendSuccesed(popupLong);
                } else {
                    sendFailed(response.statusText, popupLong);
                }
            })
            .catch(error => {
                sendFailed(error, popupLong);
            });
    });

    //Обработка успешной отправки
    const sendSuccesed = (popup) => {
        popup.innerHTML = `<div class="success">
                                <div class="success__check-mark">
                                <span class="success__check-dash"></span>
                                </div>
                                <h3 class="success__title">Заявка успешно отправлена</h3>
                            </div>`;
        setTimeout(closePopup, 2000, popup);
    }


    //Обработка ошибки отправки
    const sendFailed = (error, popup) => {
        const popupTitle = popup.querySelector('.popup__title');
        popupTitle.insertAdjacentHTML('afterend', `<p class="popup__error">Ой, кажется что-то пошло не так, попробуйте ещё раз</p>`);
        console.error(error);
        const errorMessage = popup.querySelector('.popup__error');
        setTimeout(() => {
            errorMessage.remove();
        },2000)
    }

});