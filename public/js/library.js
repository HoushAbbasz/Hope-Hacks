const token = sessionStorage.getItem("token");

// If not logged in, redirect
if (!token) {
  window.location.href = "/auth";
}

const favoritesList = document.getElementById("favorites-list");
const favoriteBtn = document.getElementById("favorite-btn");
const logoutBtn = document.getElementById("logout-btn");

// Load favorites
async function loadFavorites() {
  const res = await fetch("/favorites", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const favorites = await res.json();

  favoritesList.innerHTML = "";
  favorites.forEach(fav => {
    const li = document.createElement("li");
    li.textContent = `${fav.title} - ${fav.address}`;
    favoritesList.appendChild(li);
  });
}

loadFavorites();

// Save favorite
favoriteBtn.addEventListener("click", async () => {
  await fetch("/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ location_id: 1 })
  });

  loadFavorites();
});

// Logout
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  window.location.href = '/auth';
});
