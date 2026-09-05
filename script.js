let words = [];

let learned =
    JSON.parse(
        localStorage.getItem("parleai_learned")
    ) || [];

let favorites =
    JSON.parse(
        localStorage.getItem("parleai_favorites")
    ) || [];

let currentCategory = "all";


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        if (
            typeof dictionary !== "undefined"
        ) {

            words = dictionary;

            initialize();

        } else {

            showError();

        }

    }
);


/* =========================
   INITIALIZE
========================= */

function initialize() {

    updateStats();

    renderWords();

}


/* =========================
   DISPLAY WORDS
========================= */

function renderWords() {

    const list =
        document.getElementById(
            "wordList"
        );

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    let filtered =
        words.filter(word => {

            const categoryMatch =
                currentCategory === "all" ||
                word.category === currentCategory;


            const searchMatch =
                word.french
                    .toLowerCase()
                    .includes(search)

                ||

                word.russian
                    .toLowerCase()
                    .includes(search);


            return (
                categoryMatch &&
                searchMatch
            );

        });


    document.getElementById(
        "resultCount"
    ).textContent =
        filtered.length.toLocaleString(
            "ru-RU"
        )
        +
        " слов";


    if (!filtered.length) {

        list.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🔎
                </div>

                <p>
                    Ничего не найдено
                </p>

            </div>

        `;

        return;

    }


    /*
       Важный момент:
       не создаём 10 000 DOM-элементов
       одновременно.

       Иначе телефон начнёт
       задумываться о жизненных решениях.
    */

    const visible =
        filtered.slice(0, 100);


    list.innerHTML =
        visible
            .map(
                createWordCard
            )
            .join("");

}


/* =========================
   WORD CARD
========================= */

function createWordCard(word) {

    const isLearned =
        learned.includes(
            word.french
        );

    const isFavorite =
        favorites.includes(
            word.french
        );


    return `

        <div class="word-card">

            <div class="word-info">

                <div class="french">
                    ${escapeHTML(
                        word.french
                    )}
                </div>

                <div class="russian">
                    ${escapeHTML(
                        word.russian
                    )}
                </div>

                <div class="word-meta">

                    ${categoryName(
                        word.category
                    )}

                    ${isLearned
                        ? " • ✅ изучено"
                        : ""
                    }

                </div>

            </div>


            <div class="actions">

                <button
                    class="action"
                    onclick="
                        speakWord(
                            '${escapeJS(
                                word.french
                            )}'
                        )
                    "
                    title="Произнести">

                    🔊

                </button>


                <button
                    class="action"
                    onclick="
                        toggleLearned(
                            '${escapeJS(
                                word.french
                            )}'
                        )
                    "
                    title="Изучено">

                    ${
                        isLearned
                            ? "✅"
                            : "➕"
                    }

                </button>


                <button
                    class="action"
                    onclick="
                        toggleFavorite(
                            '${escapeJS(
                                word.french
                            )}'
                        )
                    "
                    title="Избранное">

                    ${
                        isFavorite
                            ? "❤️"
                            : "🤍"
                    }

                </button>

            </div>

        </div>

    `;

}


/* =========================
   SEARCH
========================= */

function searchWords() {

    renderWords();

}


/* =========================
   CATEGORY
========================= */

function filterCategory(
    category,
    button
) {

    currentCategory =
        category;


    document
        .querySelectorAll(
            ".category"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


    button.classList.add(
        "active"
    );


    renderWords();

}


/* =========================
   LEARNED
========================= */

function toggleLearned(
    french
) {

    if (
        learned.includes(
            french
        )
    ) {

        learned =
            learned.filter(
                word =>
                    word !== french
            );

    } else {

        learned.push(
            french
        );

    }


    localStorage.setItem(
        "parleai_learned",
        JSON.stringify(
            learned
        )
    );


    updateStats();

    renderWords();

}


/* =========================
   FAVORITES
========================= */

function toggleFavorite(
    french
) {

    if (
        favorites.includes(
            french
        )
    ) {

        favorites =
            favorites.filter(
                word =>
                    word !== french
            );

    } else {

        favorites.push(
            french
        );

    }


    localStorage.setItem(
        "parleai_favorites",
        JSON.stringify(
            favorites
        )
    );


    updateStats();

    renderWords();

}


/* =========================
   STATS
========================= */

function updateStats() {

    document.getElementById(
        "totalWords"
    ).textContent =
        words.length.toLocaleString(
            "ru-RU"
        );


    document.getElementById(
        "learnedWords"
    ).textContent =
        learned.length.toLocaleString(
            "ru-RU"
        );


    document.getElementById(
        "favoriteWords"
    ).textContent =
        favorites.length.toLocaleString(
            "ru-RU"
        );

}


/* =========================
   SPEECH
========================= */

function speakWord(
    text
) {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Озвучка не поддерживается."
        );

        return;

    }


    speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.lang =
        "fr-FR";

    speech.rate =
        0.85;


    speechSynthesis.speak(
        speech
    );

}


/* =========================
   THEME
========================= */

function toggleTheme() {

    document.body
        .classList
        .toggle(
            "dark"
        );


    localStorage.setItem(
        "parleai_dark",
        document.body.classList.contains(
            "dark"
        )
    );

}


function loadTheme() {

    if (
        localStorage.getItem(
            "parleai_dark"
        )
        ===
        "true"
    ) {

        document.body
            .classList
            .add(
                "dark"
            );

    }

}


/* =========================
   CATEGORY NAMES
========================= */

function categoryName(
    category
) {

    const names = {

        basic:
            "Основное",

        people:
            "Люди",

        food:
            "Еда",

        home:
            "Дом",

        school:
            "Учёба",

        travel:
            "Путешествия",

        verbs:
            "Глаголы",

        other:
            "Другое"

    };


    return (
        names[category]
        ||
        "Другое"
    );

}


/* =========================
   SECURITY / TEXT
========================= */

function escapeHTML(
    text
) {

    return String(text)
        .replace(
            /[&<>"']/g,
            character => ({

                "&":
                    "&amp;",

                "<":
                    "&lt;",

                ">":
                    "&gt;",

                '"':
                    "&quot;",

                "'":
                    "&#039;"

            })[
                character
            ]
        );

}


function escapeJS(
    text
) {

    return String(text)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


/* =========================
   ERROR
========================= */

function showError() {

    document.getElementById(
        "wordList"
    ).innerHTML = `

        <div class="empty">

            <div class="empty-icon">
                ⚠️
            </div>

            <p>
                Не найден файл words.js
            </p>

            <br>

            <small>
                Помести words.js
                рядом с index.html.
            </small>

        </div>

    `;

}
