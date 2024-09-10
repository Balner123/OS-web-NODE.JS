document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prispevek-form');
    const textArea = document.getElementById('prispevek-text');
    const list = document.getElementById('prispevky-list');

    const formatText = (text) => text.replace(/\n/g, '<br>');

    const loadPosts = async () => {
        try {
            const response = await fetch('/posts');
            const posts = await response.json();
            list.innerHTML = posts.map(post =>
                `<div class="post-card">
                    <div class="post-card-header">${new Date(post.time).toLocaleString()}</div>
                    <div class="post-card-content">${formatText(post.text)}</div>
                    <button class="delete-btn" data-id="${post.id}">Smazat</button>
                </div>`
            ).join('');

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const postId = e.target.getAttribute('data-id');
                    try {
                        await fetch(`/posts/${postId}`, { method: 'DELETE' });
                        loadPosts();
                    } catch (error) {
                        console.error('Error deleting post:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    loadPosts();

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            textArea.value = '';
            loadPosts();
        } catch (error) {
            console.error('Error saving post:', error);
        }
    });

    const dragElement = (element, handle) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    }

    const dragHandle = document.querySelector('.drag-handle');
    dragElement(form, dragHandle);
});
