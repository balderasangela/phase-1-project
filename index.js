

// document.addEventListener("DOMContentLoaded", () => {
   
  //TO-DO LIST 

    //Make taskList be the li id called create-task-form
    let taskList = document.getElementById('create-task-form')
    //make taskList have an event listerner that when submitted the function event 
    //is prevented from reloading 
    taskList.addEventListener('submit', function(event){
      event.preventDefault()
  
  //make a text variable to represent the text that will be typed as a paragraph
      const text = document.createElement('li');
      
  
      //create a button for deleting later on
      const deleteButton = document.createElement('button')
      deleteButton.className = "deleteButton"
      //grab the button that was just created and make it text = X
      deleteButton.textContent = '❌'
  
      //add an event listerner to the button so when we click the X it is removed
      deleteButton.addEventListener('click', function(){
       text.remove()
        deleteButton.remove()
      })
  
      text.textContent = `${event.target['new-task-description'].value} `
     
      taskList.appendChild(text)
      text.appendChild(deleteButton)
    })
  // });
  //END OF TODO LIST



//  start of api quote

    async function fetchQuote() {
      const url = 'https://type.fit/api/quotes';
    
      try {
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error('Quote not found');
        }
    
        const quotes = await response.json();
    
        return quotes;
      } catch (e) {
        alert(e);
      }
    }

    const quotesPromise = fetchQuote();
    const quoteEl = document.getElementById('quote');
    const quoteAuthorEl = document.getElementById('author');
    
    document.getElementById('new-quote').addEventListener('click', function (e) {
      quotesPromise.then(quotes => {
        const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
        const quoteText = quotes[randomQuoteIndex].text;
        let author = quotes[randomQuoteIndex].author;
    
        if (!author) {
          author = 'Unknown';
        }
    
        if (quoteText.length > 120) {
          quoteEl.classList.add('long-quote');
        } else {
          quoteEl.classList.remove('long-quote');
        }
    
        quoteEl.textContent = quoteText;
        quoteAuthorEl.textContent = `-${author}`;
      });
    });

  //END OF API QUOTES


  // start of pomo
  const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  // sound effects for pomodoro
  const buttonSound = new Audio('button-sound.mp3');
  const mainButton = document.getElementById('js-btn');
  mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    //when click the start button the sound is activated
    if (action === 'start') {
      startTimer();
    } else {
      stopTimer();
    }
  });
  
// timer set 
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    if (timer.mode === 'pomodoro') timer.sessions++;
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    // allowing update to clock
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
  
        switch (timer.mode) {
          case 'pomodoro':
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            break;
          default:
            switchMode('pomodoro');
        }
  
  
  
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
  
        startTimer();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  
   
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }
  
 
  