document.addEventListener("DOMContentLoaded", function () {
    const incompleteBookshelf = document.getElementById("incompleteBookshelfList");
    const completeBookshelf = document.getElementById("completeBookshelfList");
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");

    function moveBook(bookElement, targetShelf) {
        targetShelf.appendChild(bookElement);
        saveBooks();
    }

    function removeBook(bookElement) {
        bookElement.remove();
        saveBooks();
    }

    function toggleBookStatus(bookElement) {
        const actionButton = bookElement.querySelector('button.green, button.red');
        const bookData = JSON.parse(bookElement.getAttribute("data-book"));
        bookData.isComplete = !bookData.isComplete;
        bookElement.setAttribute("data-book", JSON.stringify(bookData));
    
        if (bookData.isComplete) {
            moveBook(bookElement, completeBookshelf);
            actionButton.textContent = "selesai di Baca";
            actionButton.classList.remove("red");
            actionButton.classList.add("green");
        } else {
            moveBook(bookElement, incompleteBookshelf);
            actionButton.textContent = "Belum Selesai dibaca";
            actionButton.classList.remove("red");
            actionButton.classList.add("green");
        }
    }
    
    
    function saveBooks() {
        const allBooks = {
            incompleteBooks: Array.from(incompleteBookshelf.querySelectorAll(".book_item")).map(bookElement => JSON.parse(bookElement.getAttribute("data-book"))),
            completeBooks: Array.from(completeBookshelf.querySelectorAll(".book_item")).map(bookElement => JSON.parse(bookElement.getAttribute("data-book")))
        };
        localStorage.setItem('allBooks', JSON.stringify(allBooks));
    }
    
    

    function handleBookAction(button, action) {
        const book = button.parentElement.parentElement;
        action(book);
    }

    function addBookToShelf(title, author, year, isComplete, id) {
    const shelf = isComplete ? completeBookshelf : incompleteBookshelf;
    const bookData = {
        id: id || +new Date(), 
        title: title,
        author: author,
        year: parseInt(year, 10),
        isComplete: isComplete
    };


        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.setAttribute("data-book", JSON.stringify(bookData));

        const titleElement = document.createElement("h3");
        titleElement.textContent = title;

        const authorElement = document.createElement("p");
        authorElement.textContent = "Penulis: " + author;

        const yearElement = document.createElement("p");
        yearElement.textContent = "Tahun: " + year;

        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action");

        const actionButton = document.createElement("button");
        actionButton.textContent = isComplete ? "selesai di Baca" : "Belum Selesai dibaca";
        actionButton.classList.add(isComplete ? "green" : "green");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus buku";
        deleteButton.classList.add("red");

        actionDiv.appendChild(actionButton);
        actionDiv.appendChild(deleteButton);

        bookItem.appendChild(titleElement);
        bookItem.appendChild(authorElement);
        bookItem.appendChild(yearElement);
        bookItem.appendChild(actionDiv);

        shelf.appendChild(bookItem);
        saveBooks();
    }


    function loadBooks() {
        const allBooks = JSON.parse(localStorage.getItem('allBooks')) || { incompleteBooks: [], completeBooks: [] };
        allBooks.incompleteBooks.forEach(bookData => addBookToShelf(bookData.title, bookData.author, bookData.year, bookData.isComplete, bookData.id));
        allBooks.completeBooks.forEach(bookData => addBookToShelf(bookData.title, bookData.author, bookData.year, bookData.isComplete, bookData.id));
    }
    


    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        addBookToShelf(title, author, year, isComplete);
        inputBookForm.reset();
    });

    function searchBook(title) {
        const allBooks = document.querySelectorAll('.book_item');
        allBooks.forEach(book => {
            const bookTitle = book.querySelector('h3').textContent.toLowerCase();
            if (bookTitle.includes(title.toLowerCase())) {
                book.style.display = 'block';
            } else {
                book.style.display = 'none';
            }
        });
        if (title === '') {
            allBooks.forEach(book => {
                book.style.display = 'block';
            });
        }
        
    }
    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("searchBookTitle").value;
        searchBook(title);
    });
    

    incompleteBookshelf.addEventListener("click", function (event) {
        if (event.target.classList.contains("green")) {
            handleBookAction(event.target, toggleBookStatus);
        } else if (event.target.classList.contains("red")) {
            handleBookAction(event.target, removeBook);
        }
    });

    completeBookshelf.addEventListener("click", function (event) {
        if (event.target.classList.contains("green")) {
            handleBookAction(event.target, toggleBookStatus);
        } else if (event.target.classList.contains("red")) {
            handleBookAction(event.target, removeBook);
        }
    });

    loadBooks();
});
