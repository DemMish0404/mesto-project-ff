//! validation start

function showError(inputElement , errorSpanElement, errorMessage) {

   inputElement.classList.add('error')
   errorSpanElement.classList.add('error')
   errorSpanElement.textContent = errorMessage

}

function unShowError(inputElement , errorSpanElement){
   console.log('убираем все ошибки тк их нет')
   inputElement.classList.remove('error')
   errorSpanElement.classList.remove('error')
   errorSpanElement.textContent = ''
}

function validateAnInput(inputElement ){
   
   console.log('валидируем инпут' )

   if(inputElement.validity.patternMismatch){

      //устанавливаем кастомное сообщение об ошибке
      inputElement.setCustomValidity(inputElement.dataset.patternErrorMessage)
   } else{
      // иначе убираем кастомное сообщение и позволяем использовать стандартное (если setCustomValidity передать пустаю строку - он будет использовать стандартные браузерные сообщения) 
      inputElement.setCustomValidity("")
      
   }

   
   const errorSpanElement = document.querySelector(`.${inputElement.id}-error-span`)
   if(!inputElement.validity.valid){

      const errorMessage = inputElement.validationMessage
      showError(inputElement, errorSpanElement,errorMessage )
   
   } else{
      unShowError(inputElement, errorSpanElement)
   }

   const currentForm = inputElement.closest('form')
   // если какое-то поле некорректно заполнено - кнопку мы отключаем (чтобы нельзя было отправить форму дальше)
   disableTheFormSendButtonAndViceVersa(currentForm)

   
}


function disableTheFormSendButtonAndViceVersa(formElement){
   const theFormSendButton = formElement.querySelector('.send-form-data-button')
   theFormSendButton.disabled = checkIfTheFormHasAnInvalidInput(formElement)
}


function enableAllFormsValidation(allFormsOnThePage){
   const arrOfAllForms = Array.from(allFormsOnThePage)
   console.log('запускаем валидацию на всех формах')
   arrOfAllForms.forEach((form, index,arr)=>{
      console.log('получили форму', form)
      enableAFormValidation(form)

   })

   
}







function enableAFormValidation(form){
   // с самого начала ставим кнопкам disabled так как все инпуты не могут быть сразу заполнены
   disableTheFormSendButtonAndViceVersa(form) 


   const allInputsOfTheCurrentForm = Array.from(form.querySelectorAll('input'))
      console.log('получили все инпуты формы' , allInputsOfTheCurrentForm)

      allInputsOfTheCurrentForm.forEach((input, index)=>{

         
         // если не завернем в анонимную функцию то не сможем передать параметр input
         input.addEventListener('input', ()=> validateAnInput(input))  
      })
}


function resetTheCurrentFormsValidation(form){
   const inputsOfTheForm  = Array.from(form.querySelectorAll('input'))

   form.reset()
   inputsOfTheForm.forEach((input)=>{
      const errorSpanElement = document.querySelector(`.${input.id}-error-span`)
      unShowError(input,errorSpanElement)

   })

   // кнопку ставим не активной чтобы когда откроешь в следующий раз нельзя было форму отправить
   disableTheFormSendButtonAndViceVersa(form)
}

function checkIfTheFormHasAnInvalidInput(form){
   const inputs = Array.from(form.querySelectorAll('input'))
   const ifHasAnInvalidInput = inputs.some(input=> !input.validity.valid)
   return  ifHasAnInvalidInput
}

function checkIfEveryInputOfTheFormIsValid(form){
   const inputs = Array.from(form.querySelectorAll('input'))
   const ifEveryInputIsValid = inputs.every(input=> input.validity.valid)
   return  ifEveryInputIsValid
}


//! validation END

export {resetTheCurrentFormsValidation,enableAllFormsValidation} 