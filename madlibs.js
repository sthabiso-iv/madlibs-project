// Add an event listener to the button so that it calls a makeMadLib function when clicked.
// In the makeMadLib function, retrieve the current values of the form input elements, make a story from them, and output that in the story div (like "Pamela really likes pink cucumbers.")

// Get references to the elements
const playBtn = document.getElementById('play');
const stopBtn = document.getElementById('stop');
const translateBtn = document.getElementById('google_translate_element');
// const editorDiv = document.getElementById('editor');
const planeAudio = document.getElementById('plane');

// Add event listener to the editor div
// editorDiv.addEventListener('mouseover', function() {
//   planeAudio.play();
// });
// editorDiv.addEventListener('mouseout', function() {
//     planeAudio.pause();
//   });


const backgroundVideo = document.getElementById('backgroundVideo');

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

const backgroundVideo1 = document.getElementById('backgroundVideo1');

playBtn.addEventListener('click', function() {
    backgroundVideo1.style.display = 'block';
    backgroundVideo1.play();
    playBtn.textContent = 'Playing';
    stopBtn.textContent = 'Pause';
});

stopBtn.addEventListener('click', function() {
    backgroundVideo1.pause();
    // backgroundVideo1.style.display = 'none';
    playBtn.textContent = 'Resume';
    stopBtn.textContent = 'Paused';
});


// Google Translate function
translateBtn.addEventListener('click', function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'translate');
  });

  function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
  }

  // $(document).ready(function(){
  //   $('#google_translate_element').bind('DOMNodeInserted', function(event) {
  //     $('.goog-te-menu-value span:first').html('Translate');
  //     $('.goog-te-menu-frame.skiptranslate').load(function(){
  //       setTimeout(function(){
  //         $('.goog-te-menu-frame.skiptranslate').contents().find('.goog-te-menu2-item-selected .text').html('Translate');    
  //       }, 100);
  //     });
  //   });
  // });

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
    const response = await fetch('story.txt'); // Assuming 'story.txt' is in the same directory
    const storyText = await response.text();
    return storyText;
  } catch (error) {
    console.error('Error fetching story:', error);
    return ''; // Return an empty string if there's an error
  }
}


getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    console.log(processedStory);

    const editVersion = document.querySelector(".madLibsEdit");
    const previewVersion = document.querySelector(".madLibsPreview");

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

    //EXTRA
    const reset = document.querySelector("#reset");
    const outputBlanks = document.getElementsByClassName("blank");

    reset.addEventListener("click", (e) => {
      for (let i = 0; i < blanks.length; i++) {
        blanks[i].value = "";
        outputBlanks[i].innerText = blanks[i].placeholder;
      }
    });
  });