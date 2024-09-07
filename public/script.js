document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prispevek-form');
    const textArea = document.getElementById('prispevek-text');
    const list = document.getElementById('prispevky-list');

    // Function to replace newline characters with <br> tags
    const formatText = (text) => {
        return text.replace(/\n/g, '<br>');
    };

    // Function to fetch and display posts
    const loadPosts = async () => {
        try {
            const response = await fetch('/posts');
            const posts = await response.json();
            list.innerHTML = posts.map(post => 
                `<div class="post-card">
                    <div class="post-card-header">${new Date(post.time).toLocaleString()}</div>
                    <div class="post-card-content">${formatText(post.text)}</div>
                </div>`
            ).join('');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Load posts on page load
    loadPosts();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const text = textArea.value.trim();
        if (!text) {
            alert('Příspěvek nemůže být prázdný!');
            return;
        }

        try {
            await fetch('/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            textArea.value = ''; // Clear textarea
            loadPosts(); // Reload posts
        } catch (error) {
            console.error('Error saving post:', error);
        }
    });
});
