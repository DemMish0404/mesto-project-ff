// @todo: после того как будешь в разные модули относить изменить путь функции с очисткой валидации
import {resetTheCurrentFormsValidation} from './validation.js' //импортируем аннулирование валидации при закрытии окна

//! резервируем переменные в которых будут наш дейтсвующий popup и действующая кнопка для закрытия popup 
let currentPopup 
let popupCloseButton 




//точка возврата к работающему коду
function openModal(modalDomElement ){
   console.log('должны открыть окно')
    
   //! заполняем наши переменные с popup и кнопкой закрытия popup содержимым чтобы знать какой popup закрывать
    currentPopup = modalDomElement
    popupCloseButton = modalDomElement.getElementsByClassName('popup__close')[0]
   console.log(currentPopup, popupCloseButton)
   
   
   document.body.classList.add('lock')
   currentPopup.classList.add('popup_is-opened')

   document.addEventListener('keydown',closeIfEscWasPressedOrThereWasClickOutOfThePopup) // вещаем обработчик чтобы окно закрылось при escape
   currentPopup.addEventListener('click',closeIfEscWasPressedOrThereWasClickOutOfThePopup) // вещаем обработчик чтобы окно закрылось клике за пределами тела модального окна
   popupCloseButton.addEventListener('click',closeModal) 
   
   

   
}

// закрываем модальное окно если нажата клавиша 'ESCAPE' или клик вне тела модального окна
function closeIfEscWasPressedOrThereWasClickOutOfThePopup(event){
   console.log(event.target.closest('.popup-body'))
   if(event.key === 'Escape' || !event.target.closest('.popup-body') ){
      console.log('надо закрыть модальное окно')
      closeModal()
      return
   }
}



function closeModal(){
   const currentPopupForm = currentPopup.querySelector('form')
  
   // не у всех всплывающих окон есть форма - поэтому проверяем есть ли форма и если нет - то не запускаем очистку формы перед закрытием всплывающего окна
   currentPopupForm ?  resetTheCurrentFormsValidation(currentPopupForm) : '' 

   console.log('должны закрыть окно')
   console.log(currentPopup)
   document.body.classList.remove('lock') ;
   currentPopup.classList.remove('popup_is-opened')
   popupCloseButton.removeEventListener('click', closeModal)
   document.removeEventListener('keydown',closeIfEscWasPressedOrThereWasClickOutOfThePopup)
   currentPopup.removeEventListener('click',closeIfEscWasPressedOrThereWasClickOutOfThePopup)
   
}

export {openModal,closeModal  }