 import { takeACloserLookAtAnImagePopup } from "./index.js";

  import {  deleteACardApiRequest , giveACardALikeAPI , getRidOfYourLikeAPI,  } from './api.js'
  
  


  


 const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];


 function createANewCard (likes, cardId, cardCreatorId, currentUserId= 'edc3b61e14d9862014d029ef',link='https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg', title = 'random title', deleteCardFunction,giveAnImageACloserLookFunction, giveALikeFunction){
  console.log(likes,cardId,cardCreatorId)

  const cardTemplate = document.getElementById('card-template').content

  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  //добавляем контент в новую карточку чтобы не добавлять пустую карточку на страницу 
  
  const likeBtn = cardElement.querySelector('.card__like-button')
  const cardLikes = cardElement.querySelector('.how-many-likes')
  const imageOfTheCard = cardElement.querySelector('.card__image')
   imageOfTheCard.src = link
    imageOfTheCard.alt = title


    imageOfTheCard.addEventListener('click', giveAnImageACloserLookFunction)
  //  заворачиваем в анонимныую функцию чтобы сразу не вызвалось передавая аргумент
  likeBtn.addEventListener('click', ()=>toggleALike(likeBtn) )
  cardElement.querySelector('.card__title').textContent = title

  // вешаем на клик функцию чтобы удаляло (по заданию удалять имеет право только тот кто создал)
  if(currentUserId === cardCreatorId){
    cardElement.querySelector('.card__delete-button').addEventListener('click', deleteCardFunction)
    cardElement.querySelector('.card__delete-button').classList.add('visible')
    console.log(`это ваша ваша карточка `, cardElement)
  } else{
    cardElement.querySelector('.card__delete-button').classList.add('invisible')
    console.log(`это не ваша карточка`, cardElement)
  }
  
  

  console.log(cardElement.dataset)
  cardElement.id = cardId
  cardElement.dataset.cardCreatorId = cardCreatorId
  cardElement.dataset.stringLikesAmount = likes
  

  cardLikes.textContent = cardElement.dataset.stringLikesAmount
  return cardElement
}




async function deleteCardFunction(event){
  // получаем родительскую карточку где была кликнута кнопка удалить
  const cardWhenTheButtonClicked = event.target.closest('.card')
  const cardId = cardWhenTheButtonClicked.id

  const deletedCard = await deleteACardApiRequest(cardId).then(res => {
    if(res.ok){
      return res.json()
    } else{
      Promise.reject(`не удалось удалить карточку.`)
    }
  }).then(deletedCard=> deletedCard).catch(err=> {
    console.error(err)
    return null
  })

  if(deletedCard){
    cardWhenTheButtonClicked.remove()
  }
  
  

}

async function toggleALike(likeBtn ){
  const cardElement = likeBtn.closest('.card')
  console.log(cardElement.dataset.stringLikesAmount)
  
  const cardId = cardElement.id
  const howManyLikesBlock = cardElement.querySelector('.how-many-likes')
  
  // проверяем содержит ли класс активного(нажатого ) лайка и от этого вызываем определенный метод
  if(likeBtn.classList.contains('card__like-button_is-active')){
    const tryingToGetRidOfTheLike = await getRidOfYourLikeAPI(cardId).then(res=> {
      if(res.ok){
        return res.json()
      } else{
        Promise.reject(`возникла ошибка при удалении вашего лайка у карточки под id ${cardId}. ${res.status}`)
      }

      

    }).then(changedCard => changedCard).catch(err=> {
      console.error(err)
      return null
    })

    if(tryingToGetRidOfTheLike){
      cardElement.dataset.stringLikesAmount = +cardElement.dataset.stringLikesAmount - 1 // преобразуем строку в число и складываем чтобы не было ошибки в вычислении
      howManyLikesBlock.textContent = cardElement.dataset.stringLikesAmount
      likeBtn.classList.toggle('card__like-button_is-active') // (так как уже есть) удаляем класс класс
    }


  } else{
      const tryingToGiveALike = await giveACardALikeAPI(cardId).then(res=> {
      if(res.ok){
        return res.json()
      } else{
        Promise.reject(`возникла ошибка при добавлении лайка у карточки под id ${cardId}. ${res.status}`)
      }

      

    }).then(changedCard => changedCard).catch(err=> {
      console.error(err)
      return null
    })

    if(tryingToGiveALike){
      cardElement.dataset.stringLikesAmount = +cardElement.dataset.stringLikesAmount + 1 // преобразуем строку в число и складываем чтобы не было ( '1' + 1 = '11'  )
      howManyLikesBlock.textContent = cardElement.dataset.stringLikesAmount
      likeBtn.classList.toggle('card__like-button_is-active')// (так как еще нет) добавляем класс
    }

  }

  
  
} 


export {initialCards , createANewCard , deleteCardFunction}

