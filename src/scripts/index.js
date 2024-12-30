


import '../pages/index.css'; // импортируем css стили для страницы 
import { initialCards, createANewCard , deleteCardFunction } from './cards'; // импортируем изначальные карточки
import { openModal, closeModal } from './modal';
import profilePhoto from '../images/avatar.jpg' // импортируем фото профиля 

//* импортируем функции для валидации
import {resetTheCurrentFormsValidation,enableAllFormsValidation} from './validation.js'
//* импортируем функции для валидации END

//? импортируем API-запросы-функции
import {getUserProfileData, changeUsersAvatar,checkIfTheLinkLeadsToAnImage,changeTheProfileNicknameAndBio,getAllCardsFromTheServer,postANewCardToTheServer , } from './api'
//? импортируем API-запросы-функции END

const buttonToEditUsersProfileData = document.getElementById('profile__edit-button');
const addNewCardForm = document.forms['new-place'];
const addNewCardFormCardTitleInput = addNewCardForm.elements['place-name']
const addNewCardFormLinkToAnImageInput = addNewCardForm.elements['link']
const editProfileForm = document.forms['edit-profile']
const editProfileFormNameInput = editProfileForm.elements.name
const editProfileFormDescriptionInput = editProfileForm.elements.description
const addNewCardButton = document.getElementsByClassName('profile__add-button')[0] // берем кнопку для добавления новой карточки 
const takeACloserLookAtAnImagePopup = document.getElementById('dialog-show-the-card-image')
const addANewCardPopup = document.getElementById('dialog-add-a-new-card')
const changeProfileDataPopup = document.getElementById('change-profile-data')
const changeProfileImageBlock = document.getElementById('profile-image-block')
const changeProfileImagePopup = document.getElementById('change-profile-image-popup')


//* переменные которые нужны при работе с API

const profileSection = document.getElementById('profile-section')
//const currentUserId = profileSection.dataset.userId 
const currentUserId = await getUserProfileData().then((res)=> res.json()).then((dataFromTheServer)=> dataFromTheServer )['_id'] // берем только id пользователя 
const currentProfileImage = document.getElementById('profile__image') // какой-то маньяк задает картинку профиля через задний фон
const profileTitle = document.getElementById('profile__title')
const profileBio = document.getElementById('profile__description')


const changeAvatarForm = document.getElementById
('change-profile-avatar-form')
const changeAvatarFormUrlInput = changeAvatarForm.querySelector('#change-profile-image-input')

//* переменные которые нужны при работе с API END

// вещаем прослушиватель при отправке формы для смены аватарки
changeAvatarForm.addEventListener('submit', async (evt)=>{
   evt.preventDefault()

   console.log('наужно менять аватарку')
   const linkToBecomeTheNewAvatar = changeAvatarFormUrlInput.value
   const ifTheLinkLeadsToAnImageBoolean = await checkIfTheLinkLeadsToAnImage(linkToBecomeTheNewAvatar).then(ifAnImage=> ifAnImage).catch(notImage=> notImage)

   console.log(ifTheLinkLeadsToAnImageBoolean)

   if(ifTheLinkLeadsToAnImageBoolean){
      const newProfileData = await changeUsersAvatar(linkToBecomeTheNewAvatar).then((res)=>{
         if(res.ok) {
            return res.json()
         } else{
            Promise.reject(`запрос на смену аватарки профиля не удался. статус: ${res.status}`)
         }


      }).then(dataFromTheServer=> dataFromTheServer).catch(err=> {
         console.log(err)
          // чтобы при неудачном запросе не вылезали ошибки переносим изначальные данные
         return {
            name: profileTitle.textContent,
            about: profileTitle.textContent,
            avatar: currentProfileImage.style.backgroundImage,
            '_id': profileSection.dataset.userId
         }
      })


      console.log(newProfileData)
      setProfileData(newProfileData.name , newProfileData.about, newProfileData.avatar, newProfileData['_id'] )
      

   }else{
      console.error('введена не ссылка на картинку при попытке поменять аватарку')
   }
   
   closeModal()
})


// вешаем прослушиватель для открытия модального окна для смены иконки профиля 
changeProfileImageBlock.addEventListener('click',()=>{
   openModal(changeProfileImagePopup)
})

//элементы popup для того чтобы детальнее рассмотреть картинку
const popupImage = takeACloserLookAtAnImagePopup.querySelector('.popup__image'); 
const popupCaption = takeACloserLookAtAnImagePopup.querySelector('.popup__caption'); 

const cardsContainer = document.querySelector('.places__list')


const userTitle = document.getElementById('profile__title')
const userDescription = document.getElementById('profile__description')

addNewCardButton.addEventListener('click', (event)=>{
   openModal(addANewCardPopup) 

})

// вещаем чтобы открывалось диалоговое окно при нажатии на кнопку поменять данные профиля
buttonToEditUsersProfileData.addEventListener('click', ()=>{ 
   openModal(changeProfileDataPopup) // передаем id какое модальное окно открыть 
   
  editProfileFormNameInput.value = userTitle.textContent
  editProfileFormDescriptionInput.value = userDescription.textContent

  
   
})




// при событии на 'отправку' формы с изменением данных профиля
editProfileForm.addEventListener('submit', async (event)=>{
   event.preventDefault()// отменяем стандартное поведение
   
   const changedUserObj =  await changeTheProfileNicknameAndBio(editProfileFormNameInput.value, editProfileFormDescriptionInput.value).then(res=> { 

      if(res.ok){
         return res.json()
      } else{
         Promise.reject(`произошла ошибке при изменении имени и описания пользователя , ${res.status}`)
      }
      

   }).then(dataFromTheServer=> dataFromTheServer ).catch(err=> {
      console.log(err)
      // чтобы при неудачном запросе не вылезали ошибки переносим изначальные данные
      return {
         name: profileTitle.textContent,
         about: profileTitle.textContent,
         avatar: currentProfileImage.style.backgroundImage,
         '_id': profileSection.dataset.userId
      }
   })


   console.log(changedUserObj)
   setProfileData(changedUserObj.name , changedUserObj.about, changedUserObj.avatar, changedUserObj['_id'] )


   resetTheCurrentFormsValidation(editProfileForm)
   closeModal()
   
})
addNewCardForm.addEventListener('submit',async (event)=>{
   event.preventDefault()// отменяем стандартное поведение
   const cardTitle = addNewCardFormCardTitleInput.value;
   const linkToTheNewCardImage = addNewCardFormLinkToAnImageInput.value;



   const allDataAboutTheNewCardFromServer = await postANewCardToTheServer(cardTitle,linkToTheNewCardImage).then(res=> {
      if(res.ok){
        return res.json()
      } else{
         Promise.reject(`не удалось создать новую карточку, ${res.status}`)
      }
      

   }).then(newCard=> newCard).catch(err=> {
      console.log(err)
      return null

   })

   console.log(allDataAboutTheNewCardFromServer)


   if(allDataAboutTheNewCardFromServer){
      
      const newCardReadyToBeOnThePage = createANewCard(allDataAboutTheNewCardFromServer.likes.length,allDataAboutTheNewCardFromServer['_id'],allDataAboutTheNewCardFromServer.owner['_id'],currentUserId,allDataAboutTheNewCardFromServer.link,allDataAboutTheNewCardFromServer.name,deleteCardFunction,ifImageOfACardWasClicked)

      cardsContainer.prepend(newCardReadyToBeOnThePage)
   }
   
   closeModal()

})

// ставим профильное фото потому что оно по стилем должно быть задано задним фоном
const profileImageBlock = document.getElementById('profile__image')
profileImageBlock.style.backgroundImage = `url(${profilePhoto})`

// initialCards.forEach((elem,index)=>{
//    const newCard = createANewCard(elem.link,elem.name,deleteCardFunction,ifImageOfACardWasClicked)

//    cardsContainer.append(newCard)
// })

// @todo: Темплейт карточки
//! обработчик на кнопку удалить добавить

function ifImageOfACardWasClicked(event){

   const card = event.target.closest('.card')
   const cardImage = event.target.closest('.card__image')
   const cardTitle = card.querySelector('.card__title');
   
   
   popupImage.src = cardImage.src;
   popupImage.alt = cardTitle.textContent;
   popupCaption.textContent= cardTitle.textContent;
 
   openModal(takeACloserLookAtAnImagePopup) // указываем id модального окна , которое нужно открыть
   
 }


export {takeACloserLookAtAnImagePopup}




// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу


//! validation 
const allForms = document.forms

enableAllFormsValidation(allForms)

//! validation END


//? API запросы (блок с API)


// по-умолчанию ставим изначальные данные чтобы если что-то не было передано то оставлалось как и было до этого
function setProfileData(nickName = `${profileTitle.textContent}`, Bio =  profileBio.textContent, linkToTheProfileImg = currentProfileImage.style.backgroundImage , profileId = profileSection.dataset.userId ){
   
      profileTitle.textContent = nickName
      profileBio.textContent = Bio
      currentProfileImage.style.backgroundImage = `url(${linkToTheProfileImg})`
      profileSection.dataset.userId = profileId
   
   
}

const userProfileData = await getUserProfileData().then((res)=> res.json()).then((dataFromTheServer)=> dataFromTheServer )
profileSection.dataset.userId = userProfileData['_id']
console.log(userProfileData)

setProfileData(userProfileData.name, userProfileData.about , userProfileData.avatar, userProfileData['_id'] )







// проверка функции на то ведет ли ссылка на картинку
console.log(await checkIfTheLinkLeadsToAnImage('http://127.0.0.1:5502/index.html').then(res => res).catch(res => res))
console.log(await checkIfTheLinkLeadsToAnImage().then(res => res).catch(res => res))






      // все карточки берем на данный момент
console.log(await getAllCardsFromTheServer().then(res=> res.json()).then(cards=> cards).catch(err=> {
   console.log(err)
   return []

}))

function displayAllCards(cards = []){
   const profileBlockWithUserInfo = document.getElementById('profile-section')
   const currentUserId = profileBlockWithUserInfo.dataset.userId
   console.log(currentUserId,'!!!!!!')

   cards.forEach((card,index)=>{
      const newCard = createANewCard(card.likes.length,card['_id'],card.owner['_id'],currentUserId,card.link,card.name,deleteCardFunction,ifImageOfACardWasClicked)
      const cardLikeBtn = newCard.querySelector('.card__like-button')
      
      // если в массиве лайков нашей карточки есть имя ВЛАДЕЛЬЦА ПРОФИЛЯ - значит ВЛАДЕЛЕЦ ПРОФИЛЯ лайкнул карточку . ЗНАЧИТ НАДО это показать
      cards[index].likes.forEach((user,index)=>{
         
         if(user['_id'] === currentUserId){

            cardLikeBtn.classList.add('card__like-button_is-active')
         }
      })


   
      cardsContainer.append(newCard)
   })
}

displayAllCards(await getAllCardsFromTheServer().then(res=> res.json()).then(cards=> cards))
// получение всех карточек END





//? API запросы (блок с API) END 






console.log()