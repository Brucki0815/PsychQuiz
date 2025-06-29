
function parseQuestions(text){
  const pattern = /(\d+)\.\s+([^\n]+)\nA\)\s+([^\n]+)\nB\)\s+([^\n]+)\nC\)\s+([^\n]+)\nD\)\s+([^\n]+)\n✅\s+Richtige Antwort:\s+([ABCD])\n📝\s+([\s\S]*?)(?=\n\d+\.|$)/g;
  const questions=[];
  let match;
  const map={A:0,B:1,C:2,D:3};
  while((match=pattern.exec(text))!==null){
    questions.push({
      num:parseInt(match[1]),
      question:match[2].trim(),
      options:[match[3].trim(),match[4].trim(),match[5].trim(),match[6].trim()],
      answer:map[match[7]],
      explanation:match[8].trim()
    });
  }
  return questions;
}

let questions=[];
let current=0;
let score=0;
const questionEl=document.getElementById('question');
const optionsEl=document.getElementById('options');
const submitBtn=document.getElementById('submit');
const nextBtn=document.getElementById('next');
const explanationEl=document.getElementById('explanation');
const resultEl=document.getElementById('result');

fetch('questions.txt')
  .then(r=>r.text())
  .then(t=>{
    questions=parseQuestions(t);
    shuffleArray(questions);
    showQuestion();
  });

function showQuestion(){
  explanationEl.classList.add('hidden');
  nextBtn.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  const q=questions[current];
  questionEl.textContent=`Frage ${current+1}: ${q.question}`;
  optionsEl.innerHTML='';
  q.options.forEach((opt,i)=>{
    const id=`opt${i}`;
    const label=document.createElement('label');
    label.htmlFor=id;
    label.innerHTML=`<input type="radio" name="option" id="${id}" value="${i}"> ${opt}`;
    optionsEl.appendChild(label);
  });
}

submitBtn.addEventListener('click',()=>{
  const selected=document.querySelector('input[name="option"]:checked');
  if(!selected)return;
  const q=questions[current];
  const selectedIndex=parseInt(selected.value);
  optionsEl.querySelectorAll('label').forEach((lab,i)=>{
    lab.classList.remove('correct','incorrect');
    if(i===q.answer)lab.classList.add('correct');
    else if(i===selectedIndex)lab.classList.add('incorrect');
  });
  if(selectedIndex===q.answer)score++;
  explanationEl.textContent=q.explanation;
  explanationEl.classList.remove('hidden');
  submitBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
});

nextBtn.addEventListener('click',()=>{
  current++;
  if(current<questions.length){
    showQuestion();
  }else{
    // quiz finished
    document.getElementById('question-wrapper').classList.add('hidden');
    submitBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
    resultEl.textContent=`Du hast ${score} von ${questions.length} Fragen richtig beantwortet.`;
    resultEl.classList.remove('hidden');
  }
});

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
