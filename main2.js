let debug = localStorage.getItem('debug') === 'on'


function mainLoading(){
    const screenId=getCurrentScreenId()
    const screen=getScreen(screenId)

    loadAllScreens()
    clock();
    dayOfWeek();

    if (localStorage.length === 0 )
    {
        restoreDataFromDump()
    }
    else if (screen) {
       loadAllCardsOnScreen(screenId)
       setHeightOfScreenElement(screenId)
       document.getElementById(screenId).classList.add('openedScreen')
   }
}
function setDebugMode() {

    if(localStorage.getItem('debug')==='on'){
        localStorage.setItem('debug','off')
        debug=false
        alert('Debug mode switched off')
    }
    else {
        localStorage.setItem('debug','on')
        debug=true
        alert('Debug mode switched on')
    }
}


function createScreen(obj){

    let id;
    let name;
    let screen = document.createElement('div')
    const screenList = document.getElementById('screenList')

    if(typeof obj=='undefined'){

        let newScreenObj = {};
        let listOfScreens = getData('listOfScreens')

        name=newScreenObj.name='New Group';
        id=newScreenObj.id=`screen-${makeId(3)}`;
        newScreenObj.cards=[]
        newScreenObj.background=null
        setData(id,newScreenObj)
        listOfScreens.screens.push(id)
        setData('listOfScreens',listOfScreens)
    }
    else {

        name=obj.name
        id=obj.id
    }

    screen.id=id
    screen.classList.add('sideNavitem')
    screen.innerHTML=
        `<div class="screenName" role="textbox" onclick="changeScreen(this.parentNode.id)" ondblclick="editScreenName(this.parentElement.id)" onkeypress=onInputNewScreenName(event)>${name}</div>` +
        `<div role="button" class="deleteScreenButon" onclick="shake(this.parentNode)" ondblclick="removeScreen(this.parentNode.id)">X</div>`
    screenList.appendChild(screen)
    animateCSS(`#${id}`,'fadeInLeft').then(()=>{
        typeof obj=='undefined'?editScreenName(id):{}
    })

    if(!getCurrentScreenId()){
      setCurrentScreen(id)
        console.log("hello my dear friend")
    }
    interactScreenName(id)
    setHeightOfScreenElement(id)


}
function removeScreen(id){

    const screen=document.querySelector(`#${id}`)
    const screenObj=getData(id)
    let listOfScreens = getData('listOfScreens')
    let indexOfScreenInObj = listOfScreens.screens.indexOf(id)

    //cant delete last screen
    if (listOfScreens.screens.length===1){
        animateCSS(`#${id}`,'shakeX')
        return
    }

    animateCSS(`#${id}`,'fadeOutLeft').then(()=>{
        screen.remove()
        localStorage.removeItem(id)
        listOfScreens.screens.splice(indexOfScreenInObj,1)
        setData('listOfScreens',listOfScreens)
        if (getCurrentScreenId()===id){
            changeScreen(listOfScreens.screens[0])
        }
    })



    for(let cardId of screenObj.cards){
        console.log(cardId)
        removeCard(cardId, id)
    }
}
function changeScreen(screenId){
    const area=document.querySelector('#area')

    if(screenId===getCurrentScreenId()){
        return
    }

    if(area.childElementCount>0){
        hideAllCards()
    }
    if(getCurrentScreenId()){
        removeHeightOfScreenElements()
    }
    setCurrentScreen(screenId)
    loadAllCardsOnScreen(screenId)




}
function loadAllScreens(){

    if(!getData('listOfScreens')){
        return
    }

    const listOfScreens = getData('listOfScreens')
    for(let screen of listOfScreens.screens){
        createScreen(getData(screen))
        setHeightOfScreenName(screen)
    }
}
function setHeightOfScreenElement(screenId){

    const sideNavScreen=document.getElementById(screenId)
    const screenName=sideNavScreen.querySelector('.screenName')
    let newHeight=0;
    let sideNavCardLinks = sideNavScreen.getElementsByClassName('sideNavCardLink')
    for (let link of sideNavCardLinks){
        newHeight = newHeight+ link.scrollHeight
    }
    newHeight+=screenName.scrollHeight
    sideNavScreen.style.height = newHeight + 'px'
}
function removeHeightOfScreenElements(){

    let sideNavScreen=document.querySelector('.openedScreen')

    if (!sideNavScreen){
        return
    }

    const screenName=sideNavScreen.querySelector('.screenName')
    sideNavScreen.style.height=screenName.style.height
    sideNavScreen.classList.remove('openedScreen')
}
function setHeightOfScreenName (screenId){

    const sideNavScreen=document.getElementById(screenId)
    const screenName=sideNavScreen.querySelector('.screenName')
    screenName.style.height='0px'
    screenName.style.height=screenName.scrollHeight+'px'
}

function setCurrentScreen(id){

    const screenElement = document.getElementById(id)

    if(screenElement){
        screenElement.classList.add('openedScreen')
    }
    localStorage.setItem('currentScreen',id)
    debug?console.log(`curent screen set to ${id}`):{}
}
function getScreen(id){

    const screenId=id;
    const screenObj=JSON.parse(localStorage.getItem(screenId))
    return   screenObj
}
function getCurrentScreenId(){

    const currentScreenId=localStorage.getItem('currentScreen')
    return currentScreenId
}

function editScreenName(id){

    const screen=document.getElementById(id)
    const title = screen.querySelector('.screenName')
    title.setAttribute('contenteditable',true)
    title.focus()
}
function onInputNewScreenName(event){

    if(event.target.textContent.includes('New Group')){
        event.target.textContent=''
    }
    if (event.code === 'Enter'){
        if(event.target.innerText.length>2){
            renameScreen(event.target.parentElement.id,event.target.textContent)
            event.target.setAttribute('contenteditable',false)
            event.target.blur()
        }
        else {
            shake(event.target.parentElement)
            event.preventDefault();
        }
    }

}
function renameScreen(screenId,newName){

    let screenObj=getData(screenId)

    screenObj.name=newName
    setData(screenId,screenObj)
}



function setData(id,obj){

    localStorage.setItem(id,JSON.stringify(obj))

}
function getData(id){

    const obj = JSON.parse(localStorage.getItem(id))
    return obj

}
function clearAllData(){

    if(window.confirm("All data will be lost! Are you sure?")) {
        localStorage.clear()
        alert('All data is deleted')
        window.location.reload()
    }

}
function restoreDataFromDump(userData) {
    if(typeof userData=='undefined')
    {
        let request = new XMLHttpRequest;

        request.open('GET', 'dumpData.txt', true);
        request.onload = function () {
            const data = JSON.parse(request.responseText)
            const keys = Object.keys(data)


            for(let key of keys){
                localStorage.setItem(key,data[key])
            }
            window.location.reload()
        };
        request.send(null);
    }
    else{
        let input = document.createElement('input')

        input.setAttribute('type','file')
        input.setAttribute('accept','.txt')
        input.addEventListener('input',()=>{
           const reader = new FileReader()
            reader.onload = (event)=>{
                const data=JSON.parse(event.target.result)
                const keys = Object.keys(data)

                for(let key of keys){
                    localStorage.setItem(key,data[key])
                }
                window.location.reload()
            }
            reader.readAsText(input.files[0])
        })

        input.click()



    }

}
function dumpData() {
    let myData = JSON.stringify(localStorage)
    let blob = new Blob([myData], {type: "text/plain"})
    let link = document.createElement('a')

    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download','dumpData.txt')
    link.click()
}



function createCard(obj){

    if(!getCurrentScreenId()){
        animateCSS('#sideNavitemCreateNotes','shakeX')
        return
    }

    let date;
    let title;
    let summary;
    let itsNewCard;
    let area= document.getElementById('area');
    let card = document.createElement('div');
    card.className = 'cards';

    if(typeof obj=='undefined'){

        itsNewCard=true;
        card.id='card-'+makeId(5)
        date=new Date().toLocaleDateString()
        summary='';
        title='';
        card.style.width='270px'
        card.style.height='200px'
        card.style.top=window.outerHeight/2.5+'px'
        card.style.left=window.outerWidth/2+'px'
        insertCardIdInScreenObj(card.id,getCurrentScreenId())
    }
    else{

        card.id=obj.id
        summary=obj.summary
        title=obj.title
        date=obj.createTime
        card.style.width=obj.width
        card.style.height=obj.height
        card.style.top=obj.top
        card.style.left=obj.left
        card.style.background=obj.background
    }

    card.style.backgroundClip='padding-box'
    card.innerHTML=`<div class="cardContent" >
			<div class="cardsTitle" role="textbox">${title}</div>
			<div class="cardsSummary" aria-multiline="true" role="textbox" ondblclick=showOpenedCard(this.parentNode.parentNode.id)>${summary}</div>
		</div>
		<div class="cardSetings">
			<div class="cardsCreateTime">${date}</div>
			<img role="button" class='paletteBtn' alt="close" width="22" height="22" src="images/svg/paint-brush-household-thin-svgrepo-com.svg" onclick=showPalette(this)>
			<img role="button" width="24" height="24" src="images/svg/note-pencil-thin-svgrepo-com.svg" onclick=showOpenedCard(this.parentNode.parentNode.id)>
			<img role="button"  width="24" height="24" src="images/svg/trash-thin-svgrepo-com.svg" onclick=shake(this.parentNode.parentNode) ondblclick="removeCard(this.parentNode.parentNode.id, getCurrentScreenId())">
		</div>`;

    area.appendChild(card);
    interactCard(card.id)
    createNavCardsLink(getCurrentScreenId(),card.id)
    animateCSS(`#${card.id}`,'backInRight').then(()=>{
        itsNewCard?saveCard(card.id):{}
        debug?console.log(`created ${itsNewCard?'new':'old'} card id is: ${card.id}`):{}
        // createNavCardsLink(getCurrentScreen(),card.id)
    })


}
function saveCard(id){

    let element = document.getElementById(id);
    let objElement = new Object()
    objElement.id=element.id
    objElement.title=element.querySelector('.cardsTitle').textContent
    objElement.summary=element.querySelector('.cardsSummary').innerHTML
    objElement.createTime=element.querySelector('.cardsCreateTime').textContent
    // objElement.screen=getCurrentScreenId() //not sure
    objElement.top=element.style.top
    objElement.left=element.style.left
    objElement.width=element.style.width
    objElement.height=element.style.height
    objElement.zIndex=element.style.zIndex
    objElement.background=element.style.background

    setData(id,objElement)

    debug?console.log(`save card ${id}`):{}
}
function removeCard(cardId, screenId){

    if(getCurrentScreenId()==screenId){
        hideCard(cardId)
    }
    removeCardIdFromScreenObj(cardId,screenId)
    localStorage.removeItem(cardId)
    debug?console.log(`card removed. id=${cardId} from screen id=${screenId}`):{}
}
function replaceCard(cardId,oldScreenId,newScreenId){


    insertCardIdInScreenObj(cardId,newScreenId)
    removeCardIdFromScreenObj(cardId,oldScreenId)
}
function hideCard(cardId){

    const card = document.getElementById(cardId)
    const cardLink =document.getElementById(`navLink-${cardId}`)

    animateCSS(`#${cardId}`,'backOutLeft').then(()=>{
        card.remove()
    })
    animateCSS(`#navLink-${cardId}`,'backOutLeft').then(()=>{
        cardLink.remove()
    })
}
function hideAllCards(){

    let cards = document.querySelectorAll('.cards')

    for(let card of cards){
        hideCard(card.id)
    }

}
function loadAllCardsOnScreen(screenId){

    const screen=getData(screenId)

    for(let card of screen.cards){
        let cardObj = getData(card)
        createCard(cardObj)
    }

}
function interactCard(id){

    $( `#${id}` ).draggable({
        snap: ".cards, .statusBar",
        snapTolerance: 10,
        stack: ".cards",
        scrollSpeed: 1,
        scrollSensitivity: 1,
        containment: ".area" ,
        distance: 10,
        stop: function(event, ui) {
            saveCard(this.id)
        },
        start: function (event, ui){
        }
    });
    $( `#${id}` ).resizable({
        grid: [ 5, 5 ],
        stop: function() {
            saveCard(this.id)
        }
    });
}

function insertCardIdInScreenObj(cardId,screenId){

    let screenObj = getData(screenId)

    if(screenObj.cards.includes(cardId)){
        return
    }
    else {
        screenObj.cards.push(cardId)
        setData(screenId,screenObj)
    }
}
function removeCardIdFromScreenObj(cardId,screenId){

    let screenObj = getData(screenId)
    let indexOfCard = screenObj.cards.indexOf(cardId)

    screenObj.cards.splice(indexOfCard,1)
    setData(screenId,screenObj)

}



function interactScreenName(screenId){

    $( `#${screenId}` ).droppable({
        accept: ".sideNavCardLink",
        drop:  function( event, ui ) {

            const targetId = event.target.id
            const droppedElementId = ui.draggable[0].id.replace('navLink-','')

            if (targetId!==getCurrentScreenId()){
                replaceCard(droppedElementId,getCurrentScreenId(),targetId)
                hideCard(droppedElementId)
            }
            else {
                console.log('not ok')
            }
        }
    });
}
function createNavCardsLink(screenId,cardId){
    const screen = document.getElementById(screenId)
    const card = document.getElementById(cardId)
    const linkTitle = card.firstElementChild.firstElementChild.textContent===''?`Новая заметка        ${card.getElementsByClassName('cardsCreateTime')[0].textContent}`:card.firstElementChild.firstElementChild.textContent
    const cardLink = document.createElement('div')

    cardLink.classList.add('sideNavCardLink')
    cardLink.textContent=linkTitle
    cardLink.id=`navLink-${cardId}`
    cardLink.ondblclick = function (){

        showOpenedCard(cardId)
    }
    screen.appendChild(cardLink)

    $( `#${cardLink.id}` ).draggable({
        helper: "clone",
        stop: function(event, ui) {
        },
        start: function (event, ui){
        }
    })
    setHeightOfScreenElement(screenId)
}



function showOpenedCard(id){
    let openedCard=document.getElementById('openedCards')
    let card=document.getElementById(id)
    let cardsTitle=document.querySelector(`#${id} .cardsTitle`)
    let cardsSummary=document.querySelector(`#${id} .cardsSummary`)
    let openedTitle=document.getElementById('oct')
    let oldOpenedCard=document.getElementsByClassName('open')

    oldOpenedCard.length>0?oldOpenedCard[0].classList.remove('open'):{}

    openedCard.style.background=card.style.background
    openedTitle.innerHTML=cardsTitle.innerHTML

    document.getElementById('containerOpenedCards').style.display=''
    animateCSS(`#containerOpenedCards`,'fadeIn')
    document.getElementById('openedCards').style.display=''
    animateCSS(`#openedCards`,'zoomIn')

    card.classList.add('open')
    editorSetData(cardsSummary.innerHTML)

}
function hideOpenedCard(){
    if (document.getElementById('containerOpenedCards').style.display!=='none'){
        animateCSS(`#openedCards`,'backOutDown')
        animateCSS(`#containerOpenedCards`,'fadeOut').then(()=>{
            document.getElementById('openedCards').style.display='none'
            document.getElementById('containerOpenedCards').style.display='none'
        })
        document.getElementsByClassName('open')[0].classList.remove('open')
    }
}
function saveChangesOnOpenedCard(){
    let card=document.getElementsByClassName('open')[0]
    let openedCard=document.getElementById('openedCards')
    let title=document.getElementById('oct')
    const screenId=document.getElementById(`navLink-${card.id}`).parentElement.id
    const linkTitle = title.textContent==''?`Новая заметка ${card.getElementsByClassName('cardsCreateTime')[0].textContent}`:title.textContent

    card.style.backgroundColor = openedCard.style.backgroundColor
    document.querySelector(`#${card.id} .cardsSummary`).innerHTML = editorGetData()
    document.querySelector(`#${card.id} .cardsTitle`).textContent = document.getElementById('oct').textContent
    hideOpenedCard()
    saveCard(card.id)
    document.getElementById(`navLink-${card.id}`).textContent=linkTitle
    setHeightOfScreenElement(screenId)
}





