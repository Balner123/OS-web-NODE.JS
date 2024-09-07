// Funkce pro načtení příspěvků
function nactiPrispevky() {
    fetch('/prispevky')
        .then(response => response.json())
        .then(prispevky => {
            const prispevkyList = document.getElementById('prispevky-list');
            prispevkyList.innerHTML = '';  // Vyprázdnit seznam
            prispevky.forEach(prispevek => {
                const li = document.createElement('li');
                li.textContent = prispevek;
                prispevkyList.appendChild(li);
            });
        })
        .catch(error => console.error('Chyba při načítání příspěvků:', error));
}

// Funkce pro odeslání nového příspěvku
document.getElementById('prispevek-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const prispevekText = document.getElementById('prispevek-text').value;

    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prispevek: prispevekText }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        nactiPrispevky();  // Načíst příspěvky po uložení
        document.getElementById('prispevek-text').value = '';  // Vymazat textové pole
    })
    .catch(error => console.error('Chyba při ukládání příspěvku:', error));
});

// Načíst příspěvky při načtení stránky
nactiPrispevky();
