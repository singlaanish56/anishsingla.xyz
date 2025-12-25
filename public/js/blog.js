document.addEventListener("DOMContentLoaded", () => {
    const activeTags = new Set();
    const cards = [...document.querySelectorAll(".blog-card")];
    const tagList = document.getElementById("blog-tag-list");
    const searchInput = document.getElementById("blog-search");

    const tagSet = new Set();

    cards.forEach((card) => {
        const tags = card.dataset.tags?.split(" ") || [];
        tags.forEach((t) => tagSet.add(t));
    });

    const grouped = {};

    [...tagSet].sort().forEach((tag) => {
        const letter = tag[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(tag);
    });

    Object.keys(grouped).forEach((letter) => {
        const group = document.createElement("div");
        group.className = "tag-group";

        const label = document.createElement("div");
        label.className = "tag-letter";
        label.textContent = letter;

        const items = document.createElement("div");
        items.className = "tag-items";

        grouped[letter].forEach((tag) => {
            const btn = document.createElement("button");
            btn.textContent = `#${tag}`;
            btn.onclick = () => toggleTag(tag, btn);
            items.appendChild(btn);
        });

        group.appendChild(label);
        group.appendChild(items);
        tagList.appendChild(group);
    });

    function filterByTag(tag) {
        cards.forEach((card) => {
            card.style.display = card.dataset.tags.includes(tag) ? "" : "none";
        });
    }

    searchInput.addEventListener("input", (e) => {
        // const q = e.target.value.toLowerCase();
        // cards.forEach((card) => {
        //     card.style.display = card.innerText.toLowerCase().includes(q)
        //         ? ""
        //         : "none";
        //});
        applyFilters();
    });

    function toggleTag(tag, btn) {
        if (activeTags.has(tag)) {
            activeTags.delete(tag);
            btn.classList.remove("active");
        } else {
            activeTags.add(tag);
            btn.classList.add("active");
        }

        applyFilters();
    }

    function applyFilters() {
        const q = searchInput.value.toLowerCase() || "";

        document.querySelectorAll(".blog-card").forEach((card) => {
            const title =
                card.querySelector("h3")?.textContent.toLowerCase() || "";
            const desc =
                card.querySelector("p")?.textContent.toLowerCase() || "";
            const tags = card.dataset.tags?.split(" ") || [];

            const matchesSearch =
                title.includes(q) ||
                desc.includes(q) ||
                tags.some((t) => t.includes(q));

            const matchesTags = [...activeTags].every((t) => tags.includes(t));

            card.style.display = matchesSearch && matchesTags ? "" : "none";
        });
    }
});
