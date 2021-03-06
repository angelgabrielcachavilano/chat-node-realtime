var socket = io();
var cantMsg = 0
var containerMessage = document.getElementById("message")
document.body.onload = init

socket.emit('dataUser', {
    dataUSeremail: dataUSer.email,
    name: dataUSer.realm,
    id: dataUSer.id,
    image: dataUSer.image,
    status: dataUSer.status
});

socket.on('disconn', function (id) {
    document.getElementById(`user${id}`).querySelector(".st .-status-").classList.remove("-status-on-")
});

socket.on('status', function (ids) {
    for (let i = 0; i < ids.length; i++) {
        document.getElementById("lists").removeChild(document.getElementById(`user${ids[i]}`))
    }
});

socket.on('online', function (user) {
    Object.keys(user).forEach(key => {
        if (!document.getElementById(`user${key}`)) {
            let parent = document.getElementById("lists");
            let containerUser = document.createElement("div")
            let status = user[key].status
            let html = ""
            containerUser.classList.add("user")
            containerUser.setAttribute("id", `user${key}`)
            html += '<div class="box-img">'
            html += `<div class="align-img${dataUSer.id == key ? " image-profile-55" : ""}">`
            html += `<img src="${api}${user[key].image}" alt="" class="image-profile-user">`
            html += '</div>'
            html += '</div>'
            html += '<div class="cont-text">'
            html += `<div class="name"><div class="real-name" id="${dataUSer.id == key ? 'reloadName' : ''}">${user[key].name}</div> <div class="type-you">${dataUSer.id == key ? "(You)" : ""}</div></div>`
            html += `<div class="status" title="${status}" id="${dataUSer.id == key ? "changeStatus" : ""}">`
            html += typeof status == "undefined" ? "" : (status.substr(0, 15) + ((status.length > 14) ? "..." : ""))
            html += '</div>'
            html += '</div>'
            html += '<div class="st">'
            html += `<div class="-status- -status-on-"></div>`
            html += '</div>'
            containerUser.innerHTML = html
            parent.appendChild(containerUser)

            let imgP = document.querySelectorAll(".image-profile-user")
            imgP.forEach(img => {
                img.onerror = () => {
                    img.src = "../assets/img/not-image.png"
                }
            })
            // console.log(document.getElementById("textE"))
        } else document.getElementById(`user${key}`).querySelector(".st .-status-").classList.add("-status-on-")
    })

});

socket.on('msg', function (msg) {
    let contCantMsg = document.getElementById("cantMsg")
    let parent = document.getElementById("message")
    let div = document.createElement("div")
    let html = ""

    div.classList.add("message")
    html += '<div class="image-message">'
    html += `<img src="${api}containers/${msg.id}_users/download/perfil.png" alt="" class="items-users-change-892">`
    html += '</div>'
    html += '<div class="msg">'
    html += '<div class="box-arrow">'
    html += `<i class="${msg.id == dataUSer.id ? "fas fa-caret-right" : "fas fa-caret-left"}"></i>`
    html += '</div>'
    html += `<div class="message-user">${msg.id != dataUSer.id ? msg.name : "You"}</div>`
    html += `<div class="show-message">${msg.msg}</div>`
    html += '</div>'

    if (msg.id === dataUSer.id) div.classList.add("you")
    else div.classList.add("other")
    div.innerHTML = html
    parent.appendChild(div)

    let imgProfile = document.querySelectorAll(".items-users-change-892")

    imgProfile.forEach(img => {
        img.onerror = () => {
            img.src = "../assets/img/not-image.png"
        }
    })

    setTimeout(() => {
        let position = containerMessage.scrollTop + containerMessage.offsetHeight
        if (position < (containerMessage.scrollHeight - 200)) {
            if (msg.id != dataUSer.id) {
                document.getElementById("showCantMsg").style.display = "flex"
                cantMsg += 1
                contCantMsg.innerText = cantMsg
            }
        } else {
            containerMessage.scrollTop = containerMessage.scrollHeight
        }
    }, 200)
});

socket.emit('getMessageId', {
    id: dataUSer.id
});

socket.on('getMessage', function (msgs) {
    if (+msgs.id.id != dataUSer.id) return
    let messages = msgs.messages
    for (let i = 0; i < messages.length; i++) {
        let parent = document.getElementById("message")
        let div = document.createElement("div")
        let html = ""

        div.classList.add("message")

        html += '<div class="image-message">'
        html += `<img src="${api}containers/${messages[i].id}_users/download/perfil.png" class="items-users-change">`
        html += '</div>'
        html += '<div class="msg">'
        html += '<div class="box-arrow">'
        html += `<i class="${messages[i].id == dataUSer.id ? "fas fa-caret-right" : "fas fa-caret-left"}"></i>`
        html += '</div>'
        html += `<div class="message-user">${messages[i].id != dataUSer.id ? messages[i].name : "You"}</div>`
        html += `<div class="show-message">${messages[i].msg}</div>`

        if ((i + 1) == messages.length) {
            containerMessage.scrollTop = containerMessage.scrollHeight
            setTimeout(() => {
                containerMessage.style.scrollBehavior = "smooth"
            })
        }

        exists = false

        html += '</div>'

        if (messages[i].id === dataUSer.id) div.classList.add("you")
        else div.classList.add("other")
        div.innerHTML = html
        parent.appendChild(div)


        let imgProfile = document.querySelectorAll(".items-users-change")

        imgProfile.forEach(img => {
            img.onerror = () => {
                img.src = "../assets/img/not-image.png"
            }
        })

    }
});

let txtMessage = document.getElementById("txtMessage")
txtMessage.addEventListener("keypress", (e) => {
    if (e.keyCode == 13) {
        if (txtMessage.innerText.trim() == "") {
            setTimeout(() => {
                txtMessage.innerHTML = ""
            }, 1)

            return
        }
        socket.emit('message', {
            id: dataUSer.id,
            name: dataUSer.realm,
            msg: txtMessage.innerText
        });
        setTimeout(() => {
            txtMessage.innerHTML = ""
            containerMessage.scrollTop = containerMessage.scrollHeight
        }, 1)
    }
})

function init() {
    let showMenu = false
    let txtMessage = document.getElementById("txtMessage")
    createMenu()

    document.getElementById("showMenuProfile").addEventListener("click", (e) => {
        e.stopPropagation()
        if (!showMenu) {
            showMenu = true
        } else {
            showMenu = false
        }
    })

    document.body.addEventListener("click", () => {
        showMenu = false
    })

    containerMessage.addEventListener("scroll", () => {
        let position = containerMessage.scrollTop + containerMessage.offsetHeight
        if (position > containerMessage.scrollHeight - 100) {
            let contCantMsg = document.getElementById("cantMsg")
            document.getElementById("showCantMsg").style.display = "none"
            cantMsg = 0
            contCantMsg.innerText = cantMsg
        }
    })



    let panelOptionUser = document.getElementById("panelOptionUser")
    let dataUSer = JSON.parse(localStorage.session)
    let fileInputOption = document.getElementById("fileInputOption")
    let image = document.getElementById("imgUserOption")
    let loadOption = document.getElementById("loadOption")
    let fullnameOption = document.getElementById("fullnameOption")
    let statusOption = document.getElementById("statusOption")
    let cancelOption = document.getElementById("cancelOption")
    let saveOption = document.getElementById("saveOption")
    let cantOption = document.getElementById("cantOption")
    let base64;
    image.src = imagenProfile
    image.onerror = () => {
        image.src = "../assets/img/not-image.png"
    }


    fileInputOption.addEventListener("change", () => {
        let file = fileInputOption.files[0]
        let reader = new FileReader()

        file.name = "perfil.png"
        type = file.type
        loadOption.style.display = "block"
        reader.readAsDataURL(file)
        reader.onload = function () {
            base64 = reader.result
            image.src = reader.result
            image.onload = function () {
                loadOption.style.display = "none"
            }
        };
    })

    fullnameOption.value = dataUSer.realm
    statusOption.value = dataUSer.status ? dataUSer.status : ""
    cantOption.innerText = 195 - statusOption.value.length

    cancelOption.onclick = () => {
        panelOptionUser.style.right = "-380px"
    }

    saveOption.onclick = () => {

        let data2 = {
            type: "PATCH",
            url: `${api}Users/${dataUSer.id}`,
            data: {
                realm: fullnameOption.value,
                status: statusOption.value
            }
        }

        provider(data2).then(res => {
            document.getElementById("reloadName").innerText = dataUSer.realm = fullnameOption.value
            let status = dataUSer.status = statusOption.value
            dataUSer.image = `containers/${dataUSer.id}_users/download/perfil.png`
            localStorage.session = JSON.stringify(dataUSer)
            document.getElementById("changeStatus").innerText = typeof status == "undefined" ? "" : (status.substr(0, 15) + ((status.length > 14) ? "..." : ""))

        }).catch(err => {
            console.log("error")
        })

        if (fileInputOption.files.length < 1) return

        let data = {
            type: "GET",
            url: `${api}Containers/${dataUSer.id}_users`,
        }

        provider(data).then(res => {
            ejecutSendImg()
        }).catch(err => {
            provider({
                type: "POST",
                url: `${api}Containers`,
                data: {
                    name: `${dataUSer.id}_users`
                }
            }).then(res => {
                ejecutSendImg()
            }).catch(err => {
                console.log(err)
            })
        })
    }

    statusOption.addEventListener("keydown", (e) => {
        if (e.keyCode == 8) return
        if (statusOption.value.length >= 195) e.preventDefault()
    })

    statusOption.addEventListener("keyup", (e) => {
        if (statusOption.value.length <= 195) cantOption.innerText = 195 - statusOption.value.length
    })

    function ejecutSendImg() {
        postFormData(`${dataUSer.id}_users`, base64, "perfil", res => {
            let imagesProfile = document.querySelectorAll(".image-profile-55>img")
            imagesProfile.forEach(image => {
                image.src = ""
                image.src = `${imagenProfile}?${Date()}`
            })
        })
    }

}