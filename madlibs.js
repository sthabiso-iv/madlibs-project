// Get references to the elements
const playBtn = document.getElementById('play');
const stopBtn = document.getElementById('stop');
const translateBtn = document.getElementById('google_translate_element');

const backgroundVideo = document.getElementById('backgroundVideo');
const backgroundVideo1 = document.getElementById('backgroundVideo1');

if (backgroundVideo) {
    playBtn.addEventListener('click', function() {
        backgroundVideo.style.display = 'block';
        backgroundVideo.play();
        playBtn.textContent = 'Playing';
        stopBtn.textContent = 'Pause';
    });

    stopBtn.addEventListener('click', function() {
        backgroundVideo.pause();
        backgroundVideo.style.display = 'none';
        playBtn.textContent = 'Resume';
        stopBtn.textContent = 'Paused';
    });
}

if (backgroundVideo1) {
    playBtn.addEventListener('click', function() {
        backgroundVideo1.style.display = 'block';
        backgroundVideo1.play();
        playBtn.textContent = 'Playing';
        stopBtn.textContent = 'Pause';
    });

    stopBtn.addEventListener('click', function() {
        backgroundVideo1.pause();
        playBtn.textContent = 'Resume';
        stopBtn.textContent = 'Paused';
    });
}

// Google Translate function
if (translateBtn) {
    translateBtn.addEventListener('click', function() {
        new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'translate');
    });
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}

function parseStory(rawStory) {
  let n = /\[n\]/g;
  let v = /\[v\]/g;
  let a = /\[a\]/g;

  const arrayOfStory = [];
  const splittedWords = rawStory.split(" ");

  for (let i = 0; i < splittedWords.length; i++) {
    const words = splittedWords[i];

    if (v.test(words)) {
      arrayOfStory.push({ words: words.slice(0, -3), pos: " ____ (noun)" });
    } else if (n.test(words)) {
      arrayOfStory.push({ words: words.slice(0, -3), pos: " ____ (verb)" });
    } else if (a.test(words)) {
      arrayOfStory.push({ words: words.slice(0, -3), pos: " ____ (adjective)" });
    } else {
      arrayOfStory.push({ words });
    }
  }
  return arrayOfStory;
}

async function getRawStory() {
  try {
    const response = await fetch('story.txt');
    const storyText = await response.text();
    return storyText;
  } catch (error) {
    console.error('Error fetching story:', error);
    return '';
  }
}

getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    const editVersion = document.querySelector(".madLibsEdit");
    const previewVersion = document.querySelector(".madLibsPreview");

    if (!editVersion || !previewVersion) return;

    for (let words of processedStory) {
      if (words.pos) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", `${words.pos}`);
        input.setAttribute("maxlength", 20);
        editVersion.appendChild(input);

        const output = document.createElement("span");
        output.className = "blank";
        output.innerText = `${words.pos}`;
        previewVersion.appendChild(output);

        input.addEventListener("input", (event) => {
          output.innerText = input.value;
        });
      } else {
        const edit = document.createElement("span");
        edit.innerText = ` ${words.words}`;
        editVersion.appendChild(edit);
        const preview = document.createElement("span");
        preview.innerText = ` ${words.words}`;
        previewVersion.appendChild(preview);
      }
    }

    const blanks = document.querySelectorAll("input");
    for (let i = 0; i < blanks.length; i++) {
      blanks[i].addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          if (i === blanks.length - 1) {
            blanks[0].focus();
          } else {
            blanks[i + 1].focus();
          }
        }
      });
    }

    const reset = document.querySelector("#reset");
    const outputBlanks = document.getElementsByClassName("blank");

    reset.addEventListener("click", (e) => {
      for (let i = 0; i < blanks.length; i++) {
        blanks[i].value = "";
        outputBlanks[i].innerText = blanks[i].placeholder;
      }
    });
  });
