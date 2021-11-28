const questions = document.getElementById("questions")

const srv = questions.getAttribute("srv").split(',')

const survey = [["", "", "", "", ""]]

for (let i = 0; i < srv.length ; i += 5) {
    survey.push(srv.slice(i, i+5)) 
}

let i = 1

let br = "questions.appendChild(document.createElement('br'))"

addQuestion = () => {
    question = survey[0]
    if (document.title == "Edit Survey" && i < survey.length) {
        question = survey[i]
    }
    for (let j = 0; j < 5; j++) {
        elementBuilder(i, j)
    }
    eval(br)
    eval(br)
    i++
}

elementBuilder = (i, j) => {
    id = "q" + i
    id += (j == 0) ? "" : ("_" + j)
    lbl = "Question " + i
    lbl = (j == 0) ? lbl : ("Option " + j + " of " + lbl)
    let label = document.createElement("label")
    let input = document.createElement("input")
    input.type = "text"
    input.id = input.name = label.for = id
    label.innerHTML = lbl
    input.value = question[j]
    input.required = "required"
    questions.appendChild(label)
    eval(br)
    questions.appendChild(input)
    eval(br)
    if (j == 0) {
        eval(br)
    }
}

if (document.title == "Add Survey" ) {
    addQuestion()
} else {
    for (let j = 0; j < survey.length - 1; j++) { 
        addQuestion()
    }
}