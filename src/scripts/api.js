//? API запросы (блок с API)

const baseApiUrl = 'https://nomoreparties.co/v1/wff-cohort-29'
const accessToken = '2e665ceb-5a90-4c93-b023-6e976a46c586'

 function getUserProfileData(){
   return fetch(`${baseApiUrl}/users/me`,{
      headers: {
         authorization: accessToken
      }
   })
}

// // по-умолчанию ставим изначальные данные чтобы если что-то не было передано то оставлалось как и было до этого
// function setProfileData(nickName = `${profileTitle.textContent}`, Bio =  profileBio.textContent, linkToTheProfileImg = currentProfileImage.style.backgroundImage , profileId = profileSection.dataset.userId ){
   
//       profileTitle.textContent = nickName
//       profileBio.textContent = Bio
//       currentProfileImage.style.backgroundImage = `url(${linkToTheProfileImg})`
//       profileSection.dataset.userId = profileId
   
   
// }

// const userProfileData = await getUserProfileData().then((res)=> res.json()).then((dataFromTheServer)=> dataFromTheServer )
// profileSection.dataset.userId = userProfileData['_id']
// console.log(userProfileData)

// setProfileData(userProfileData.name, userProfileData.about , userProfileData.avatar, userProfileData['_id'] )


// запрос на смену ника и био профиля END

function changeTheProfileNicknameAndBio(newNickName='Demid', newBio='cool web dev'){
   return fetch(`${baseApiUrl}/users/me`,{
      method: 'PATCH',
      headers:{
         authorization: accessToken,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name: newNickName ,
         about: newBio
      })
   })
}

// запрос на смену ника и био профиля END




// запрос на смену аватарки 
async function checkIfTheLinkLeadsToAnImage(url= 'https://avatars.mds.yandex.net/i?id=7cb577fccf8b7354b5248cb8101dd09433fa521f-4253662-images-thumbs&n=13'){
   try {
      const response =  await fetch(url,{method: 'HEAD'})
      const contentType = response.headers.get('Content-Type').toLowerCase()

      return contentType && contentType.startsWith('image/')
   } catch (err) {
      console.log(err)
      return false
   }
  
}

// проверка функции на то ведет ли ссылка на картинку
console.log(await checkIfTheLinkLeadsToAnImage('http://127.0.0.1:5502/index.html').then(res => res).catch(res => res))
console.log(await checkIfTheLinkLeadsToAnImage().then(res => res).catch(res => res))

function changeUsersAvatar(newAvatarUrl = 'https://avatars.mds.yandex.net/i?id=7cb577fccf8b7354b5248cb8101dd09433fa521f-4253662-images-thumbs&n=13'){
   return fetch(`${baseApiUrl}/users/me/avatar`,{
      method: 'PATCH',
      headers: {
         authorization: accessToken, 
         'content-type': 'application/json'
      },
      body : JSON.stringify({
         avatar: newAvatarUrl
      })
      
   })
}



// запрос на смену аватарки END 




// получение всех карточек 
function getAllCardsFromTheServer(){
   return fetch(`${baseApiUrl}/cards`,{
      headers: {
         authorization: accessToken
      }
   })
}
//       // все карточки берем на данный момент
// console.log(await getAllCardsFromTheServer().then(res=> res.json()).then(cards=> cards).catch(err=> {
//    console.log(err)
//    return []

// }))

// function displayAllCards(cards = []){
//    const profileBlockWithUserInfo = document.getElementById('profile-section')
//    const currentUserId = profileBlockWithUserInfo.dataset.userId
//    console.log(currentUserId,'!!!!!!')

//    cards.forEach((card,index)=>{
//       const newCard = createANewCard(card.likes.length,card['_id'],card.owner['_id'],currentUserId,card.link,card.name,deleteCardFunction,ifImageOfACardWasClicked)
//       const cardLikeBtn = newCard.querySelector('.card__like-button')
      
//       // если в массиве лайков нашей карточки есть имя ВЛАДЕЛЬЦА ПРОФИЛЯ - значит ВЛАДЕЛЕЦ ПРОФИЛЯ лайкнул карточку . ЗНАЧИТ НАДО это показать
//       cards[index].likes.forEach((user,index)=>{
         
//          if(user['_id'] === currentUserId){

//             cardLikeBtn.classList.add('card__like-button_is-active')
//          }
//       })


   
//       cardsContainer.append(newCard)
//    })
// }

// displayAllCards(await getAllCardsFromTheServer().then(res=> res.json()).then(cards=> cards))
// // получение всех карточек END


// post запрос для создания новой карточки 
function postANewCardToTheServer(cardTitle, linkToTheCardImage){
   return fetch(`${baseApiUrl}/cards`,{
      method: 'POST',
      headers: {
         authorization: accessToken,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         name: cardTitle,
         link: linkToTheCardImage,
      })
   })
}


//post запрос для создания новой карточки   end



// delete запрос карточки 
function deleteACard (cardId = 'CARD-ID-KJSFBNKJSDBFNKJEBNFKJFDSBFJBSJHDFBJHBFS'){
   return fetch(`${baseApiUrl}/cards/${cardId}`,{
      method: 'DELETE',
      headers:{
         authorization: accessToken

      }
   })
}


// delete запрос карточки  END



// // поставить/снять лайк запросы
function giveACardALike(cardId= ''){
   return fetch(`${baseApiUrl}/cards/likes/${cardId}`,{
      method: 'PUT',
      headers: {
         authorization: accessToken,
         
      },
      
   })
}

function getRidOfYourLike(cardId= ''){
   console.log(`удаляем карточку под id ${cardId}`,"!!!!!!")
   return fetch(`${baseApiUrl}/cards/likes/${cardId}`,{
      method: 'DELETE',
      headers: {
         authorization: accessToken,
         
      },
      
   })
}

// // поставить/снять лайк запросы END 

// //? API запросы (блок с API) END 


export {getUserProfileData,changeUsersAvatar,checkIfTheLinkLeadsToAnImage,changeTheProfileNicknameAndBio,getAllCardsFromTheServer,postANewCardToTheServer,deleteACard as deleteACardApiRequest, giveACardALike as giveACardALikeAPI, getRidOfYourLike as getRidOfYourLikeAPI}