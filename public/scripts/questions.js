startDate = document.getElementById("startDate")
endDate = document.getElementById("endDate")

startDate.addEventListener("change", () => {
    endDate.min = startDate.value
})

endDate.addEventListener("change", () => {
    startDate.max = endDate.value
})

let styles = "div div div div div button {position:relative; bottom: 3px; margin-right: 5px;}" + 
             "input {height: 38px; margin-right: 5px;}"
let styleSheet = document.createElement("style")
//styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

const questions = document.getElementById("questions")

const srv = questions.getAttribute("srv").split(";")

for (let i = 0; i < srv.length; i++ ) {
    srv[i] = srv[i].split(",")
}

const survey = [["", "", "", "", ""]]

for (let i = 0; i < srv.length ; i++) {
    survey.push(srv[i]) 
}

let qNum = 1

let br = "div.appendChild(document.createElement('br'))"

addQuestion = () => {
    question = survey[0]
    if (document.title == "Edit Survey" && qNum < survey.length) {
        question = survey[qNum]
    }

    let div = document.createElement("div")
    div.id = "question " + qNum
    questions.appendChild(div)

    for (let j = 0; j < question.length; j++) {
        id = "q" + qNum
        id += (j == 0) ? "" : ("_" + j)
        lbl = "Question " + qNum
        lbl = (j == 0) ? lbl : ("Option " + j + " of " + lbl)
        let label = document.createElement("label")
        let input = document.createElement("input")
        input.type = "text"
        input.id = input.name = label.for = id
        label.innerHTML = lbl
        input.value = question[j]
        input.required = "required"
        div.appendChild(label)
        eval(br)
        div.appendChild(input)
        if (j != 0) {
            let button = document.createElement("button")
            button.id = "b" + qNum + "_" + j
            button.className = "btn btn-danger"
            button.type = "button"
            button.innerHTML = '<i class="fas fa-minus"></i>'
            div.appendChild(button)
            button.addEventListener("click", function () {
                let questionNumber = parseInt(this.id.split("_")[0].substring(1))
                let optionNumber = parseInt(this.id.split("_").at(-1))
                try {
                    survey[questionNumber].splice(optionNumber, 1)
                } catch (err) {
                    //console.log(err)
                }    
                for (optionNumber; ;optionNumber++) {
                    try {
                        document.getElementById("q" + questionNumber + "_" + optionNumber).value = 
                        document.getElementById("q" + questionNumber + "_" + (optionNumber + 1)).value
                    } catch (err) {
                        let last = document.getElementById("q" + questionNumber + "_" + optionNumber)
                        last.previousSibling.remove()
                        last.previousSibling.remove()
                        last.previousSibling.remove()
                        last.nextSibling.remove()
                        last.remove()
                        break
                    }
                }
            })
        }
        eval(br)
        if (j == 0) {
            eval(br)
            input.style.width = "100%"
        } else {
            input.style.width = "40%"
        }
    }

    eval(br)
    let button = document.createElement("button")
    button.id = "b" + qNum
    button.className = "btn btn-danger"
    button.type = "button"
    button.innerHTML = '<i class="fas fa-minus"></i> Remove Question ' + qNum
    div.appendChild(button)
    button.addEventListener("click", function () {
        let i = parseInt(this.id.substring(1))
        survey.splice(i, 1)
        document.getElementById("question " + i).remove()
        qNum--
        i++

        for (i; ;i++) {
            try {
                document.getElementById("question " + i).id = "question " + (i - 1)
                const arr = document.getElementById("question " + (i - 1)).getElementsByTagName("label")
                arr[0].innerHTML = "Question " + (i - 1)
                for (let k = 1; k < arr.length; k++) {
                    arr[k].innerHTML = "Option " + k + " of Question " + (i - 1) 
                }
                document.getElementById("q" + i).id = "q" + (i - 1)
                document.getElementById("q" + (i - 1)).name = "q" + (i - 1)
                document.getElementById("b" + i).id = "b" + (i - 1)
                document.getElementById("bo" + i).id = "bo" + (i - 1)

                for (let j = 1; ; j++) {
                    try {
                        document.getElementById("q" + i + "_" + j).id = "q" + (i - 1) + "_" + j
                        document.getElementById("q" + (i - 1) + "_" + j).name = "q" + (i - 1) + "_" + j
                        document.getElementById("b" + i + "_" + j).id = "b" + (i - 1) + "_" + j
                    } catch (err) {
                        //console.log(err)
                        break
                    }
                }
            } catch (err) {
                //console.log(err)
                break
    }
        }
    })
    
    button = document.createElement("button")
    button.id = "bo" + qNum
    button.className = "btn btn-outline-secondary"
    button.type = "button"
    button.innerHTML = '<i class="fas fa-plus"></i> Add Option'
    div.appendChild(button)
    button.addEventListener("click", function () {
        let questionNumber = parseInt(this.id.substring(2))

        let labelToClone = eval("this" + ".previousSibling".repeat(7))
        let inputToclone = labelToClone.nextSibling.nextSibling
        let buttonToClone = inputToclone.nextSibling

        let labelCloned = labelToClone.cloneNode(true)
        let inputCloned = inputToclone.cloneNode(true)
        let buttonCloned = buttonToClone.cloneNode(true)

        let nextOptionNumber = parseInt(inputCloned.id.split("_").at(-1)) + 1

        labelCloned.innerHTML = "Option " + nextOptionNumber + " of " + "Question " + questionNumber
        inputCloned.id = inputCloned.name = "q" + questionNumber + "_" + nextOptionNumber
        inputCloned.value = ""
        buttonCloned.id = "b" + questionNumber + "_" + nextOptionNumber

        let removeQuestionButton = document.getElementById("b" + questionNumber)
        removeQuestionButton.previousSibling.remove()

        let div = document.getElementById("question " + questionNumber)

        div.insertBefore(labelCloned, removeQuestionButton)
        div.insertBefore(document.createElement('br'), removeQuestionButton)
        div.insertBefore(inputCloned, removeQuestionButton)
        div.insertBefore(buttonCloned, removeQuestionButton)
        div.insertBefore(document.createElement('br'), removeQuestionButton)
        div.insertBefore(document.createElement('br'), removeQuestionButton)

        buttonCloned.addEventListener("click", function () {
            let questionNumber = parseInt(this.id.split("_")[0].substring(1))
            let optionNumber = parseInt(this.id.split("_").at(-1))
            try {
                survey[questionNumber].splice(optionNumber, 1)
            } catch (err) {
                //console.log(err)
            }
            for (optionNumber; ;optionNumber++) {
                try {
                    document.getElementById("q" + questionNumber + "_" + optionNumber).value = 
                    document.getElementById("q" + questionNumber + "_" + (optionNumber + 1)).value
                } catch (err) {
                    let last = document.getElementById("q" + questionNumber + "_" + optionNumber)
                    last.previousSibling.remove()
                    last.previousSibling.remove()
                    last.previousSibling.remove()
                    last.nextSibling.remove()
                    last.remove()
                    break
                }
            }
        })

    })
    
    eval(br)
    eval(br)
    eval(br)
    qNum++
}

if (document.title == "Add Survey" ) {
    addQuestion()
} else {
    for (let j = 0; j < survey.length - 1; j++) { 
        addQuestion()
    }
}