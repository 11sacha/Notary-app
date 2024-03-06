// Loading a book from the disk
function loadBook(filename, displayName) {
    let currentBook = "";
    let url = "books/" + filename;

    //Resetting our UI
    document.getElementById('fileName').innerHTML = displayName;
    document.getElementById('searchstat').innerHTML = "";
    document.getElementById('keyword').value = "";

    //Creating a server request to load the book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocumentStats(currentBook);

            // Removing mistakes from raw file
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');


            // Setting the book content to html element
            document.getElementById("fileContent").innerHTML = currentBook;

            let element = document.getElementById("fileContent");
            element.scrollTop = 0;
        }
    };
};

//Getting the stats for the book
function getDocumentStats(fileContent) {

    let docLength = document.getElementById('docLength');
    let wordCount = document.getElementById('wordCount');
    //let charCount = document.getElementById('charCount');

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    let uncommonWords = [];
    uncommonWords = filterStopWords(wordArray);

    console.log("Uncommon Words:", uncommonWords);
    console.log(typeof uncommonWords)
    //Count every word in the wordArray
    // for (let word in uncommonWords) {
    //     let wordValue = uncommonWords[word];
    //     if  (wordDictionary[wordValue] > 0) {
    //         wordDictionary[wordValue] += 1
    //     }
    //     else {
    //         wordDictionary[wordValue] = 1;
    //     }
    // }
    for (let i = 0; i < uncommonWords.length; i++) {
        let wordValue = uncommonWords[i];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }
    console.log("Word Dictionary:", wordDictionary);

    //Sorting the array
    let wordsList = sortItems(wordDictionary);
    console.log("Sorted Word List:", wordsList);

    //Top 5 words
    let top5Words = wordsList.slice(0,6);
    console.log("Top 5 Words:", top5Words);

    //Least 5 words
    let least5Words = wordsList.slice(-6,wordsList.length);

    //Showing values on the page
    ULTemplate(top5Words, document.getElementById('mostUsed'));
    ULTemplate(least5Words, document.getElementById('leastUsed'));

    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;
}

function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (let i = 0; i < items.length; i++) {
        // resultsHTML += templateHTML.replace('{{value}}', items[i][0] + " : " + items[i][1] + " time(s)");
        resultsHTML += "<li>" + items[i][0] + " : " + items[i][1] + " time(s)</li>";
    }

    element.innerHTML = resultsHTML;
}


function sortItems(obj) {
    // Converting the Obj to an array
    let xArray = Object.entries(obj);

    // Sorting the array
    xArray.sort(function (first, second) {
        return second[1] - first[1]
    });

    return xArray
}

function filterStopWords(wordArray) {
    let commonWords = ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will' ,'and' ,'with','he', 'said', 'his', 'you', 'i', 'him', 'her', 'those', 'out', 'up', 'all', 'about', 'had', 'me', 'so', 'what', 'how', 'who', 'why', 'which', 'my', 'have', 'has', 'into', 'she', 'would', 'now', 'when', 'just', 'from', 'them', 'your'];
    let commonObj = {};
    let uncommonArr = [];

    for (let i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (let i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }
    return uncommonArr
}

// Stop words not included in the stats
// function getStopWords() {
//     return ['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will' ,'and' ,'with'];
// }


//Highlight the words in search
function performMark() {
    //Reading the keyword in search
    let keyword = document.getElementById('keyword');
    let display = document.getElementById('fileContent');

    let newContent = '';

    //Finding all currently marked words
    let spans = document.querySelectorAll('mark');

    for (let i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    let re = new RegExp(keyword, 'gi');
    let replaceText = "<mark id='marked'>$&</mark>";
    let bookContent = display.innerHTML;

    //Add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    let count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        let element = document.getElementById("markme");
        element.scrollIntoView();
    };
}
