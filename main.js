function initEditor(){
    editor = new toastui.Editor({
        el: document.querySelector('#editor'),
        toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol", "task", "indent", "outdent"],
        ["table", "image"],
        ["code", "codeblock"]
        ],
        previewStyle: 'vertical',
        initialEditType: 'WYSIWYG',
        height: '100%',
        usageStatistics: false
    });
}
function editorSetData(data){
    editor.setHTML(data)
    editor.moveCursorToStart()
}
function editorGetData(){
    return editor.getHTML()
}


let ElementWhoseColorChanges;
function showPalette(elem){

    let palette = document.getElementById('palette')
    let boxOfElement = elem.getBoundingClientRect();

    ElementWhoseColorChanges=elem.parentNode.parentNode.id
    palette.style.top=(boxOfElement.top+30) +'px'
    palette.style.left=(boxOfElement.left+12)+'px'
    palette.style.display='flex'
}
function changeColor(color){
        let element = document.getElementById(ElementWhoseColorChanges)
        element.style.background=`linear-gradient(${Math.floor(Math.random() * 358 + 1)}deg, ${color} 35%,rgb(${color.replace('rgb(','').replaceAll(' ','').replace(')','').split(',').map((value, index) => value=Math.floor(Math.random() * 255)).join()}) 270%)`
        element.style.backgroundClip='padding-box'
        saveCard(ElementWhoseColorChanges)
}


function makeId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return 'c'+result;
}
function shake(node){
    animateCSS(`#${node.id}`,'pulse').then(()=>{

    })
}

function clock(){
    function setTime() {
        let dateTime = new Date();
        document.getElementById("clock").innerHTML = dateTime.toLocaleTimeString().slice(0,5);
    }
    setTime()
     setInterval(function updateTime() {
        let dateTime = new Date();
         document.getElementById("clock").innerHTML = dateTime.toLocaleTimeString().slice(0,5);
    }, 30000);
}
function dayOfWeek(){
    let date = new Date()
    let day = document.getElementById("dayOfWeek");
    day.innerText=date.toDateString()
}


const animateCSS = (element, animation) =>
    new Promise((resolve, reject) => {
        const animationName = `${animation}`;
        const node = document.querySelector(element);

        if (!node){
            return
        }

        node.classList.add(`animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });


function showSideNavSettings(){
    const sideNavScreenListContainer = document.querySelector('.sideNavScreenListContainer')
    const sideNavSettings = document.querySelector(`.sideNavSettings`)

    if (sideNavSettings.style.display==='none'){
        animateCSS('.sideNavScreenListContainer','fadeOutLeft').then(()=>{
            sideNavScreenListContainer.style.display='none'
            sideNavSettings.style.display=''
        })
        animateCSS(`.sideNavSettings`,'fadeInRight')
    }

}
function hideSideNavSetting(){
    const sideNavScreenListContainer = document.querySelector('.sideNavScreenListContainer')
    const sideNavSettings = document.querySelector(`.sideNavSettings`)

    if (sideNavSettings.style.display===''){
        animateCSS('.sideNavSettings','fadeOutRight').then(()=>{
            sideNavScreenListContainer.style.display=''
            sideNavSettings.style.display='none'
        })
        animateCSS(`.sideNavScreenListContainer`,'fadeInLeft')
    }

}



//
// function toDataURL(url, callback) {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//         const reader = new FileReader();
//         reader.onloadend = function() {
//             callback(reader.result);
//         }
//         reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
// }
//
//
// function setBackground(decodedImage){
//
//     const screen=getScreen(getCurrentScreenId())
//     const wraper=document.getElementById('backgroundOfScreen')
//
//     // wraper.style.backgroundImage=`url(${decodedImage})`
//     // screen.background=decodedImage
//     // setData(getCurrentScreenId(),screen)
//
//     wraper.style.setProperty('--backgroundImageOfScreen',decodedImage)
//     screen.background=decodedImage
//     setData(getCurrentScreenId(),screen)
//
// }
//
// function encodeImageFileAsURL(element) {
//     let file = element.files[0];
//     let reader = new FileReader();
//     reader.onloadend = function() {
//         setBackground(reader.result)
//     }
//     reader.readAsDataURL(file);
// }
//
// function openFileInput(){
//
//     const fileInputButton=document.getElementById('fileInputButton')
//     fileInputButton.click()
// }
